import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

  class Walk extends React.Component {

    state = {
      walkOn: false,
      walkInfo: {
        dog_id: this.props.currentDog.id,
        start_time: '7:00',
        finish_time: '7:25',
        pee: 0,
        poop: 0,
        datapoints: []
      },
      recentWalks: [],
      initialPosition: null,
      lastGeoPosition: null
    }

    componentDidMount() {
      this.requestLocationPermission()
      this.getRecentWalks()
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
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.setState({
        ...this.state, 
        walkInfo: {
          ...this.state.walkInfo,
          datapoints: [...this.state.walkInfo.datapoints, lastPosition]
        }
      })
      this.setState({
        lastGeoPosition: lastPosition
      })
    },
    error => Alert.alert(error.message),
    {enableHighAccuracy: true, distanceFilter: 50}
    )
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  toggleWalkStatus = () => {
    if (this.state.walkOn === false) {
      this.setState({
        walkOn: true
      })
      this.startWalk()
      this.handleCenter()
    } 
    else {
      this.setState({
      walkOn: false
    })
    this.finishWalk()
  }}

  startWalk = () => {
    let currentDate = new Date()
    this.setState({
      walkInfo: {
        ...this.state.walkInfo,
        start_time: currentDate.toString()
      }
    })
  }

  finishWalk = () => {
    let currentDate = new Date()
    this.setState({
      ...this.state, 
      walkInfo: {
        ...this.state.walkInfo,
        finish_time: currentDate.toString()
      }
    }, () => this.saveWalkToDb())
  }

  recordPee = () => {
    this.setState({
      ...this.state, 
      walkInfo: {
        ...this.state.walkInfo,
        pee: this.state.walkInfo.pee + 1
      }
    })
  }

  recordPoop = () => {
    this.setState({
      ...this.state, 
      walkInfo: {
        ...this.state.walkInfo,
        poop: this.state.walkInfo.poop + 1
      }
    })
  }

  saveWalkToDb = () => {
    fetch(`${BASE_URL}/walks`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(this.state.walkInfo) 
    })
    .then(response => response.json())
    .then(walkData => {
      this.state.walkInfo.datapoints.forEach(datapoint => this.saveDatapointsToDb(walkData.id, datapoint.latitude, datapoint.longitude))
    })
    this.props.navigation.navigate('Dashboard')
  }

  saveDatapointsToDb = (id, latitude, longitude) => {
    fetch(`${BASE_URL}/datapoints`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          walk_id: id,
          latitude: latitude,
          longitude: longitude
        })
      })
  }


  getRecentWalks = () => {
    fetch(`${BASE_URL}/walks`)
    .then(response => response.json())
    .then(recentWalkData => {
      let currentDogWalks = recentWalkData.filter(walk => walk.dog_id === this.props.currentDog.id)
      this.setState({
          recentWalks: currentDogWalks.reverse()
        })
    })
  }
  

  turnStringIntoDate = (stringDate) => {
    let dateObj = new Date(Date.parse(stringDate))
    return dateObj.toLocaleDateString()
  }

  turnStringIntoTime = (stringDate) => {
    let dateTimeObj = new Date(Date.parse(stringDate))
    return dateTimeObj.toLocaleTimeString()
  }

  getWalkDuration = (startTimeString, finishTimeString) => {
    let startTime = new Date(Date.parse(startTimeString))
    let finishTime = new Date(Date.parse(finishTimeString))
    let walkDuration = (parseInt(finishTime.getTime()) - parseInt(startTime.getTime())) / 60000
    return Math.round(walkDuration)
  }

  handleCenter = () => {
    this._map.animateToRegion({
        latitude: this.state.lastGeoPosition.latitude, 
        longitude: this.state.lastGeoPosition.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    })
}

    render () {

      // console.log(this.state.walkInf1o)

      new Polyline

      return(
        <>
          <View style={styles.top}>
            {/* <Text>{this.props.currentDog.name}'s Walks</Text> */}
            {this.state.walkOn === true ? <Button title="Finish Walk" onPress={this.toggleWalkStatus}></Button> :
            <Button title="Start Walk" onPress={this.toggleWalkStatus}></Button> }
            {this.state.walkOn && <View>
                <Button title="Record Pee" onPress={this.recordPee}></Button>
                <Button title="Record Poop" onPress={this.recordPoop}></Button>
              </View>}
          </View>

          <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} 
                ref={map => this._map = map}
                style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
                zoomEnabled={true}
                scrollEnabled={true}
                initialRegion={this.state.initialPosition}
                >
                {this.state.walkOn && 
                  <Polyline 
                  coordinates={this.state.walkInfo.datapoints}
                  geodesic={true}
                  strokeColor={'rgb(52, 137, 148)'}
                  strokeWidth={7}
                  />}
            </MapView>
          </View>

          {this.state.recentWalks.length !== 0 ? 
          <View style={styles.walk}>
            <Text>Last Walk</Text>
            {this.state.recentWalks.slice(0,1).map(walk => 
                <Text key={walk.id}> 
                  Start Time: {this.turnStringIntoTime(walk.start_time)}{"\n"}
                  Finish Time: {this.turnStringIntoTime(walk.finish_time)}{"\n"}
                  Walk Duration: {this.getWalkDuration(walk.start_time, walk.finish_time)} min {"\n"}
                  No of pees: {walk.pee}{"\n"}
                  No of poops: {walk.poop}
                </Text> 
                )
            }
          </View> : <View style={styles.container}><Text>No Recent Walk History</Text></View>
          }
        </>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      backgroundColor: '#4db6ac'
    },
    top: {
      justifyContent: 'flex-end',
      backgroundColor: '#4db6ac'
    },
    map: {
      // ...StyleSheet.absoluteFillObject,
      height: 350,
      width: 350,
    },
    walk: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 50,
      backgroundColor: '#4db6ac'
    }
   });

  export default Walk