import React, { Component } from 'react';
import Button from './Button';
import './Styles/HomePage.css';

export default class HomePage extends Component {
  render(){
    return(
      <div>
        <h3 className='title'>Hello World!</h3>
        <p>
          To begin with defaults click on 'Start' to edit some settings click on 'Settings'. If you need more info check out the source code with the link in the footer.
        </p>
        <div className='button-container'>
          <Button
            Name='Start'
            onClick={this.props.runPage}/>
          <Button
            Name='Settings'
            onClick={this.props.settingsPage}/>
        </div>
      </div>
    );
  }
}
