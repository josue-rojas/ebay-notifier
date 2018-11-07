import React, { Component } from 'react';
import './App.css';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import RunPage from './Components/RunPage';
import SettingsPage from './Components/SettingsPage';

const {ipcRenderer} = require('electron');

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      current_page: 'home',
      settings: {},
      ebay: '',
      listings: [],
    };
    this.setSettings = this.setSettings.bind(this);
    this.syncListings = this.syncListings.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount(){
    ipcRenderer.send('request settings');
    ipcRenderer.once('settings', (event, newSettings)=>{
      this.setState({
        settings: {...newSettings.settings},
        ebay: newSettings.ebay_url,
        listings: newSettings.listings,
      });
    });
  }

  setSettings(newSettings){
    this.setState({
      settings: {...newSettings},
      current_page: 'run',
      listings: [],
    });
    ipcRenderer.send('settings change', newSettings);
  }

  syncListings(listings){
    this.setState({listings: listings});
  }

  changePage(page){
    console.log('app',this.state.listings)
    return ({
      "home": (
        <HomePage
        runPage={()=>{this.setState({current_page: 'run'});}}
        settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
      "run": (
        <RunPage
          settings={this.state.settings}
          listings={this.state.listings}
          syncListings={this.syncListings}
          ebay={this.state.ebay}
          settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
      "settings": (
        <SettingsPage
          settings={this.state.settings}
          updateSettings={this.setSettings}
          runPage={()=>{this.setState({current_page: 'run'});}}/>)
    })[page];
  }
  render() {
    return (
      <div className="whole-wrapper">
        <div className="main-container">
          {this.changePage(this.state.current_page)}
        </div>
        <Footer/>
      </div>
    );
  }
}
