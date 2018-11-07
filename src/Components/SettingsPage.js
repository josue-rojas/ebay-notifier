import React, { Component } from 'react';
import './Styles/SettingsPage.css';
import Button from './Button';
const { ipcRenderer } = require('electron');

// TODO: might remove state settings. the App.js should take care of the only state or else it will be hard to debug later
export default class SettingsPage extends Component{
  constructor(props){
    super(props);
    this.state = this.props.settings;
    this.createInputs = this.createInputs.bind(this);
    this.handleInput = this.handleInput.bind(this);
    //TODO this.orderSettings = ["item", "max_price", "min_price", "sleep_time", "max_show", "notify"]
  }

  // make sure to stop script if it wasn't stopped already
  componentDidMount(){
    ipcRenderer.send('stop running');
  }

  handleInput(e, name, isBool=false){
    const state = {...this.state}
    const value = isBool ? !this.state[name] : e.target.value;
    state[name] = parseInt(value) || value; //need a better way for checking if it needs to be int
    this.setState(state);
  };

  createInputs(settings){
    let inputs = [];
    for(let name in settings){
      let input_toggle = typeof(settings[name]) === "boolean" ? 'toggle': ' ';
      let toggle_div = input_toggle !== 'toggle' ? '' : (<div className={`input-toggle-box ${settings[name]}`} onClick={()=> this.handleInput(null, name, true)}>
        <div className='toggle'></div>
      </div>)
      inputs.push(
        <div key={name}>
          <div className='input-title'>{name}</div>
          <input
            onChange={(e) => this.handleInput(e, name)}
            className={`input ${input_toggle}`}
            name='item'
            value={settings[name]}
            placeholder='Item'
            type='text'/>
          {toggle_div}
        </div>
      );
    }
    return inputs;
  }

  render() {
    return(
      <div>
        <div className='inputs-wrapper'>
          <h3 className='title'>Settings</h3>
          <div className='line'></div>
          {this.createInputs(this.state)}
          <div className='button-wrapper'>
            <Button
              Name='Save'
              onClick={()=>{this.props.updateSettings(this.state)}}/>
            <Button
              Name='Cancel'
              onClick={this.props.runPage}/>
          </div>
        </div>
      </div>
    );
  }
}
