const path = require('path');
const { app } = require('electron');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');

class settings_manager{
  constructor(_settings_path){
    this.settings_path = _settings_path || path.join(app.getPath('userData'), 'ebay-notifier-settings.json');
    this.settings = {
      "item": "macbook",
      "sleep_time": 30000,
      "notify": false,
      "max_price": -1,
      "min_price": -1,
      "max_show": 20
    };
    try {
      this.settings = jsonfile.readFileSync(this.settings_path);
    }
    catch(err){
      this.changeSettings(this.settings);
      console.log('file error (1):', err);
    }
  }
  getSettings(){
    return this.settings;
  }
  changeSettings(new_settings){
    this.settings = newSettings;
    try {
      jsonfile.writeFileSync(this.settings_path, new_settings);
    } catch (err) {
      console.log('error', this.settings_path)
      mkdirp.sync(path.dirname(this.settings_path));
      jsonfile.writeFileSync(this.settings_path, new_settings);
    }
  }
}

module.exports = new settings_manager();
