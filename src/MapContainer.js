import React, { Component } from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper, SearchBox} from 'google-maps-react'
import PropTypes from 'prop-types'
import './App.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


export class MapContainer extends Component {

    static propTypes ={
        styles: PropTypes.array
    }

    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        places: []
    }
    
    onMarkerClick = (props, marker, e) => {
        this.setState({
            showingInfoWindow: true,
            activeMarker: marker,
            selectedPlace: props
        })
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    }

    fetchPlaces = (mapProps, map) => {
        console.log("I am ready to fetch places!!")
        const {google} = mapProps
        const service = new google.maps.places.PlacesService(map)
        service.nearbySearch({
            location: { lat: 55.677271, lng: 12.573833 },
            radius: 1000,
            type: ['bar'], //type only supports one. Idea: let user select which type would be nice
        },(results,status)=>{
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results) //Results is an array containing objects
                this.setState({places: results})
            }
        });
    }

    render() {
        return (
        
        <Map 
            onReady={this.fetchPlaces}
            google={this.props.google}
            style={{width: '80%', height: '100%', position: 'relative'}}
            styles={this.props.styles}
            initialCenter={{
                lat: 55.677271,
                lng:  12.573833
            }}
            zoom={15}
            onClick={this.onMapClicked}>

                {this.state.places.map((place) =>
                    <Marker
                        onClick={this.onMarkerClick}
                        key={place.place_id}
                        name={place.name}
                        /*icon={{url: 'insert url'}}*Changes original icon to something else*/
                        photo={place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400})}
                        position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
                )}
        
            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                    <h1>{this.state.selectedPlace.name}</h1>
                    <img alt='place zero' src={this.state.selectedPlace.photo}/>
                </div>
            </InfoWindow>

        </Map>
    );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDlJUajSz51W9QvRPzD3wXUcWCmIauTZ1c"
})(MapContainer)