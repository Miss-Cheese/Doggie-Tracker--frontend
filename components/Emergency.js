import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, CalloutSubview } from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import getApiKey from './apiKey'
import { TouchableOpacity } from 'react-native-gesture-handler';
import openMap from 'react-native-open-maps';


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
        }, () => this.handleCenter()))
    }

    openSystemMaps() {
        openMap({ 
            provider: "google",
            latitude: this.state.apiResponse.geometry.location.lat, 
            longitude: this.state.apiResponse.geometry.location.lng });
      }

    handleCenter = () => {
        this._map.animateToRegion({
            latitude: this.state.apiResponse.geometry.location.lat, 
            longitude: this.state.apiResponse.geometry.location.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121, 
        })
    }

    render () {

        return (
            <View>
                <>
                <View style={styles.button}>
                    <TouchableOpacity onPress={this.findAnimalHospital} style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>Find Emergency Vet</Text>
                        </TouchableOpacity>  
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
                  >
                {this.state.hospitalFound && 
                  <Marker onPress={() => this.openSystemMaps()}
                  coordinate={{ latitude: this.state.apiResponse.geometry.location.lat, longitude: this.state.apiResponse.geometry.location.lng }}
                  title={this.state.apiResponse.name}>
                    </Marker>
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
    //   ...StyleSheet.absoluteFillObject,
      height: 600,
      width: 400,
    },
    button: {
        marginTop: 30
    },
    buttonStyle: {
        height: 40,
        width: 250,
        alignContent: "center",
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'red',
        borderWidth: 3,
        borderStyle: 'dotted',
        margin: 10
      },
      buttonText: {
        color: 'red',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
   });


export default Emergency