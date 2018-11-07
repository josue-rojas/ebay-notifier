import React, { Component } from 'react';
import Button from './Button';
import './Styles/RunPage.css';
const { ipcRenderer, shell } = require('electron');

class Listing extends Component {
  render(){
    return(
      <div
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
      listings: this.props.listings,
    }
    this.updateListings = this.updateListings.bind(this);
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
    listings.forEach((listing, index)=>{
      if(newListing.length === this.state.max_show) newListing.pop();
      newListing.unshift(listing);
    })
    this.setState({
      listings: newListing,
    });
    this.props.syncListings(this.state.listings);
  }

  createListings(listings){
    let listingComps = listings.map((listing)=>{
      return (<Listing key={listings.link} listing={listing}/>)
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
