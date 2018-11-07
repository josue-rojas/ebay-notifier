import React, { Component } from 'react';
import Button from './Button';
import './Styles/RunPage.css';
const { ipcRenderer, shell } = require('electron');

class Listing extends Component {
  render(){
    return(
      <div
        key={this.props.listing.title + this.props.listing.imageSrc}
        className='listing'
        onClick={()=>shell.openExternal(this.props.listing.link)}>
        <div className='img' style={{backgroundImage: `url('${this.props.listing.imageSrc}')`}}></div>
        <div className='listing-title'>{this.props.listing.title}</div>
      </div>
    )
  }
}

export default class RunPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      max_show: this.props.settings.max_show,
      listings: [],
    }
  }

  componentDidMount(){
    ipcRenderer.send('run start');
    ipcRenderer.on('new listings', this.updateListings);
  }

  componentWillUnmount(){
    ipcRenderer.send('stop running');
    ipcRenderer.removeListener('new listings', this.updateListings);
  }

  updateListings(event, listings){
    let newListing = [...this.state.listings];
    for(let listing in listings){
      newListing.pop();
      newListing.unshift(listing);
    }
    this.setState({
      listings: newListing,
    });
  }

  createListings(listings){
    let listingComps = listings.map((listing)=>{
      return (<Listing listing={listing}/>)
    })
    return listingComps;
  }

  render() {
    return(
      <div>
        <div className='buttons-wrapper'>
          <Button
            Name='Settings'
            onClick={this.props.settingsPage}/>
          <Button
            Name='eBay'
            onClick={()=>{shell.openExternal(this.props.ebay)}}/>
        </div>
        <div className='listings-wrapper'>
          {this.createListings(this.props.listings)}
        </div>
      </div>
    );
  }
}
