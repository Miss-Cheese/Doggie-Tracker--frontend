import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import getApiKey from './apiKey'


class Emergency extends React.Component {

    state = {
        initialPosition: null,
        hospitalFound: false,
        apiResponse: {}
    }

    componentDidMount() {
        this.requestLocationPermission()
    }


    requestLocationPermission = async () => {
     if (Platform.OS === 'ios') {
        let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        if (response === 'granted') {
            this.locateCurrentPosition()
        }
     } else {
        let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        if (response === 'granted') {
            this.locateCurrentPosition()
        }
     }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {

                let initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }

                this.setState({initialPosition })
            },
            error => Alert.alert(error.message),
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000}
        )
    }

    findAnimalHospital = () => {
        fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Animal%20Hospital&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry/location&key=${getApiKey()}`)
        .then(response => response.json())
        .then(responseData => this.setState({
            hospitalFound: true,
            apiResponse: responseData.candidates[0]
        }, () => this.printLocation()))
    }

    printLocation = () => {
        console.log(this.state.apiResponse)
    }

    render () {

        return (
            <View>
                <>
                <View style={styles.button}>
                    <Button title="Find Emergency Vet" onPress={this.findAnimalHospital}></Button>    
                </View>

                <View style={styles.container}>
                <MapView
                  provider={PROVIDER_GOOGLE} 
                  ref={map => this._map = map}
                  style={styles.map}
                  showsUserLocation={true}
                  zoomEnabled={true}
                  scrollEnabled={true}
                  initialRegion={this.state.initialPosition}
                  zoom
                  >
                {this.state.hospitalFound && 
                <>
               
                  <Marker
                  coordinate={{ latitude: this.state.apiResponse.geometry.location.lat, longitude: this.state.apiResponse.geometry.location.lng }}>
                      <Callout>
                        <Text>{this.state.apiResponse.name}</Text>
                      </Callout>
                </Marker>

              
                </>
                }
                </MapView>
              </View>
                </>
    
            </View>
        )

    }



}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    //   justifyContent: 'space-evenly',
      marginTop: 30,
      padding: 5
    },
    map: {
      // ...StyleSheet.absoluteFillObject,
      height: 350,
      width: 350,
    },
    button: {
        marginTop: 30
    }
   });


export default Emergency