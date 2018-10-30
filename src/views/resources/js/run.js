const { ipcRenderer, shell } = require('electron');

let max_show = '';
let total_listings = '';
let hasNotifications = false;

ipcRenderer.send('run_opened');

ipcRenderer.on('settings', (event, arg) => {
  // gotta wait till settings arrive and set up the page
  setNotifications(arg.settings.notify);
  max_show = arg.settings.max_show;
  total_listings = arg.listings.length;
  const $listings = $('.listings-wrapper');
  arg.listings.reverse().forEach((e, i)=>{
    $listings.prepend(newListing(e));
  })
  $('#ebay-link').click(()=> shell.openExternal(arg.ebay_url));
})

ipcRenderer.on('new listings', (event, arg)=>{
  setNewListings(arg);
});

// https://developer.mozilla.org/en-US/docs/Web/API/notification
function setNotifications(notify){
  if (!("Notification" in window)) {
    if(notify) console.log('This browser does not support notifications');
  }
  else if (Notification.permission === "granted" && notify) {
    hasNotifications = true;
  }
  else if (Notification.permission !== "denied" && notify) {
    Notification.requestPermission( (permission)=> {
      console.log('changed in second');
      if (permission === "granted")
        hasNotifications = true;
    });
  }
}

let notification = null;

// create a new listing html
// TODO add image or signal that it is a new listings, this should be added in the sass (.new-listing)
function newListing(data){
  return (
    `<a class='listing new-listing' onClick="shell.openExternal('${data.link}')" target='_blank'> \
      <div class='img' style='background-image: url("${data.imageSrc}")'></div> \
      <div class='listing-title'>${data.title}</div> \
    </a>`
  )
}


function setNewListings(data){
  if(data.length > 0){
    $('.new-listing').removeClass('new-listing');
    const $listings = $('.listings-wrapper');
    data.reverse().forEach((e, i)=>{
      console.log(total_listings, max_show)
      if(total_listings === max_show){
        console.log('remove');
        $listings.find('.listing:last-child').remove();
        total_listings--;
      }
      total_listings++;
      $listings.prepend(newListing(e));
    })
    // TODO: add a photo or somethign nice
    // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification image option in constructor can do that
    if(hasNotifications){
      notification= new Notification(`New listings found: ${data.length}`);
    }
  }
}
