import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import './map.css';

export class MapContainer extends Component {
	state = {
		showingInfoWindow: false,
		activeMarker: {},
		selectedPlace: {},
	};

	onMarkerClick = (props, marker, e) =>
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true,
		});

	onMapClicked = (props) => {
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null,
			});
		}
	};

	render() {
		const { chores } = this.props;
		return (
			<div id='mapBox'>
				<Map
					initialCenter={{
						lat: 49.27665409999999,
						lng: -123.1185907,
					}}
					google={this.props.google}
					className='infowindowclass....'
					style={{
						width: '30%',
						height: '50%',
						display: 'inline-block',
					}}
					zoom={10}
					onClick={this.onMapClicked}
				>
					{chores.map((chore) => (
						<Marker
							name={chore.title}
							onClick={this.onMarkerClick}
							position={{ lat: chore.latitude, lng: chore.longitude }}
						></Marker>
					))}
					<InfoWindow
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow}
					>
						<div>
							<h1>{this.state.selectedPlace.name}</h1>
						</div>
					</InfoWindow>
				</Map>
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBaR5mIl1BV8M9GlFSlpokpRRUPuLJzS2o',
})(MapContainer);
