const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require("electron-is-dev");
const settings_manager =  require('./settings_manage.js');
let search = require('./search-script');

let settings = settings_manager.getSettings();
// makes instance of search_script
let search_script = new search.search_script(settings.item, settings.max_price, settings.min_price);
let listings = [];
let listingTimer = null;
let isRunning = false
let win

function createWindow () {
  win = new BrowserWindow({
    darkTheme: true
    // fullscreen: true
  });

  // https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c
  const startUrl = isDev ? `http://localhost:${process.env.PORT || 8080}` : url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  win.loadURL(startUrl);

  win.on('closed', () => {
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})


// settings data handling
ipcMain.on('request settings', (event, arg) => {
  console.log('electron',listings);
  event.sender.send('settings', {settings: settings, listings: listings, ebay_url: search_script.url});
});
ipcMain.on('settings change', (event, arg)=>{
  settings = {...arg};
  console.log(arg);
  search_script.setNewURL(settings.item, settings.max_price, settings.min_price);
  // isRunning = false;
  settings_manager.changeSettings(settings);
  listings = [];
  event.sender.send('settings_changed', 'success');
});
ipcMain.on('stop running', (event, arg)=>{
  // console.log('stop running');
  isRunning = false;
  clearTimeout(listingTimer);
});

// run page data handling
ipcMain.on('run start', (event, arg) => {
  isRunning = true;
  // run one time for beginnning when there is no listings
  // ummm might be bad if the point of refres is to fetch but then again this is to prevent so many request then getting banned...
  if(listings.length < 1) search_script.getNewLinks(setListings, event.sender)
  clearTimeout(listingTimer); // prevent many instance to run (especially when refreshing);
  listingTimer = setInterval(()=>{
    search_script.getNewLinks(setListings, event.sender)
  }, settings.sleep_time);
});

// // callback for getNewLinks in search_script
function setListings(data, sender) {
  console.log('fetching new listings', settings.max_show);
  if(data.error){
    console.log('error in search script');
    return false;
  }
  if(data.not_seen.length > 0){
    // checking if first fixes ordering issue when a new item is added
    let data_send = null;
    if(listings.length === 0){
      data.not_seen.forEach((listing, index)=>{
        if(index > settings.max_show-1){
          return false;
        }
        listings.push(listing);
      })
      data_send = listings;
    }
    else {
      for(let i = data.not_seen.length-1; i > -1; i--){
        if(listings.length === settings.max_show){
          // console.log('pop');
          listings.pop();
        }
        listings.unshift(data.not_seen[i]);
      }
      data_send = data.not_seen;
    }
    sender.send('new listings', data_send);
    // sender.send('new listings', listings);
  }
  console.log(`found ${data.not_seen.length} new listings`)
}
