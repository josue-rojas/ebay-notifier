import React, { Component } from 'react';
import './Styles/SettingsPage.css';

export default class SettingsPage extends Component{
  constructor(props){
    super(props);
    this.state = this.props.settings;
    this.createInputs = this.createInputs.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e, name, isBool=false){
    console.log(name, this.state[name])
    const state = {...this.state}
    const value = isBool ? !this.state[name] : e.target.value;
    state[name] = value;
    this.setState(state);
    // this.props.handleInput(values)
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
        </div>
      </div>
    );
  }
}
