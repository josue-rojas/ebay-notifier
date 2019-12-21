import React, { Component } from "react";
import "./Styles/Button.css";

export default class Button extends Component {
  render() {
    return (
      <div className="button" onClick={this.props.onClick}>
        {this.props.Name}
      </div>
    );
  }
}
