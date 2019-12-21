import React, { Component } from "react";
import "./Styles/Footer.css";
const { shell } = require("electron");

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div
          className="link"
          onClick={() => {
            shell.openExternal(
              "https://github.com/josuerojasrojas/ebay-notifier"
            );
          }}
        >
          Source
        </div>
      </footer>
    );
  }
}
