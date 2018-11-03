const { app, BrowserWindow, ipcMain } = require('electron');
const settings_manager =  require('./settings_manage.js');


let settings = settings_manager.getSettings();
let search = require('./search-script');
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

  win.loadFile('./src/views/pages/index.html');

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


// settings data handling
ipcMain.on('settings_opened', (event, arg) => {
  console.log('settings opened')
  event.sender.send('settings', settings);
  clearTimeout(listingTimer);
  isRunning = false;
});
ipcMain.on('settings_change', (event, arg)=>{
  settings = {...arg};
  console.log(arg);
  search_script.setNewURL(settings.item, settings.max_price, settings.min_price);
  isRunning = false;
  settings_manager.changeSettings(settings);
  listings = [];
  clearTimeout(listingTimer);
  event.sender.send('settings_changed', 'success');
});

// run page data handling
ipcMain.on('run_opened', (event, arg) => {
  console.log('run opened')
  // console.log(listings);
  event.sender.send('settings', {settings: settings, listings: listings, ebay_url: search_script.url});
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
  console.log('fetching new listings');
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
          listings.pop();
        }
        listings.unshift(data.not_seen[i]);
      }
      data_send = data.not_seen;
    }
    sender.send('new listings', data_send)
  }
  console.log(`found ${data.not_seen.length} new listings`)
}
