import React, { Component } from "react";
import "./App.css";
import Footer from "./Components/Footer";
import HomePage from "./Components/HomePage";
import RunPage from "./Components/RunPage";
import SettingsPage from "./Components/SettingsPage";
const { ipcRenderer } = require("electron");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "home",
      settings: {},
      ebay: "",
      listings: []
    };
    this.setSettings = this.setSettings.bind(this);
    this.syncListings = this.syncListings.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    ipcRenderer.send("request settings");
    ipcRenderer.once("settings", (event, newSettings) => {
      this.setState({
        settings: { ...newSettings.settings },
        ebay: newSettings.ebay_url,
        listings: newSettings.listings
      });
    });
  }

  setSettings(newSettings) {
    this.setState({
      settings: { ...newSettings },
      current_page: "run",
      listings: []
    });
    ipcRenderer.send("settings change", newSettings);
  }

  syncListings(listings) {
    this.setState({ listings: listings });
  }

  changePage(page) {
    return {
      home: (
        <div className="main-container">
          <HomePage
            runPage={() => {
              this.setState({ current_page: "run" });
            }}
            settingsPage={() => {
              this.setState({ current_page: "settings" });
            }}
          />
        </div>
      ),
      run: (
        <div className="main-container wide">
          <RunPage
            settings={this.state.settings}
            listings={this.state.listings}
            syncListings={this.syncListings}
            ebay={this.state.ebay}
            settingsPage={() => {
              this.setState({ current_page: "settings" });
            }}
          />
        </div>
      ),
      settings: (
        <div className="main-container">
          <SettingsPage
            settings={this.state.settings}
            updateSettings={this.setSettings}
            runPage={() => {
              this.setState({ current_page: "run" });
            }}
          />
        </div>
      )
    }[page];
  }
  render() {
    return (
      <div className="whole-wrapper">
        {this.changePage(this.state.current_page)}
        <Footer />
      </div>
    );
  }
}
