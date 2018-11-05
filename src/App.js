import React, { Component } from 'react';
import './App.css';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import SettingsPage from './Components/SettingsPage';

const {ipcRenderer} = require('electron');

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      current_page: 'home',
      settings: {},
    };
    // this.pages = {
    //   "home": (
    //     <HomePage
    //     runPage={()=>{this.setState({current_page: 'run'});}}
    //     settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
    //   "run": (
    //     <HomePage
    //     runPage={()=>{this.setState({current_page: 'run'});}}
    //     settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
    //   "settings": (
    //     <SettingsPage
    //       settings={this.state.settings}/>)
    // }
    this.setSettings = this.setSettings.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount(){
    ipcRenderer.send('request settings');
    ipcRenderer.once('settings', (event, newSettings)=>{
      this.setState({settings: {...newSettings}});
    });
  }

  componentWillUnmount(){
    ipcRenderer.removeListener('request settings');
  }

  setSettings(newSettings){
    this.setState({settings: {...newSettings}});
    ipcRenderer.send('settings change', newSettings);
  }

  changePage(page){
    return ({
      "home": (
        <HomePage
        runPage={()=>{this.setState({current_page: 'run'});}}
        settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
      "run": (
        <HomePage
        runPage={()=>{this.setState({current_page: 'run'});}}
        settingsPage={()=>{this.setState({current_page: 'settings'});}}/>),
      "settings": (
        <SettingsPage
          settings={this.state.settings}/>)
    })[page];
    // return(this.pages[page]);
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
