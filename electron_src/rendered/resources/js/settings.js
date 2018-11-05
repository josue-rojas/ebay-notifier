const {ipcRenderer} = require('electron');

// notify client settings page is opened (ready to receive settings), (maybe there is another way to recieve the info...)
ipcRenderer.send('settings_opened');

// set the settings in their right place
ipcRenderer.on('settings', (event, arg) => {
  for(let setting_name in arg){
    $(`[name="${setting_name}"]`).val(arg[setting_name]);
  }
  if(!arg['notify']){
    $('.inputs-wrapper .input-toggle-box').addClass('false');
  }
})

// handle when settings change (change the page)
ipcRenderer.on('settings_changed', (event, arg)=>{
  if(arg === 'success'){
    window.location = 'run.html'
  }
});

// TODO: TODO check inputs for correctness and onchange
function submitSettings() {
  const item = $('[name="item"]').val();
  const max_price = $('[name="max_price"]').val();
  const min_price = $('[name="min_price"]').val();
  const sleep_time = $('[name="sleep_time"]').val();
  const notify = typeof($('[name="notify"]').val()) === "boolean"  ? $('[name="notify"]').val() : $('[name="notify"]').val() === 'true';
  const max_show = $('[name="max_show"]').val();
  const data = {
    item: item,
    max_price: max_price,
    min_price: min_price,
    sleep_time: sleep_time,
    notify: notify,
    max_show: max_show
  }
  ipcRenderer.send('settings_change', data);
}


$('.inputs-wrapper  .input').keyup(()=> {
  if (event.keyCode === 13) {
    submitSettings();
  }
});

$('.inputs-wrapper .input-toggle-box').click(()=>{
  let nextVal = $('[name="notify"]').val() === 'true' ? 'false': 'true';
  $('[name="notify"]').val(nextVal);
  $('.inputs-wrapper .input-toggle-box').toggleClass('false');
})
