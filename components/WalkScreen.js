import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps'
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
// import { Marker } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      peePoos: [],
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
    this.locatePeePoos(true)
  }

  recordPoop = () => {
    this.setState({
      ...this.state, 
      walkInfo: {
        ...this.state.walkInfo,
        poop: this.state.walkInfo.poop + 1
      }
    })
    this.locatePeePoos(false)
  }

  locatePeePoos = (pee) => {
    Geolocation.getCurrentPosition(
      position => {

          let initialPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              pee: pee
          }
          this.setState({
            peePoos: [...this.state.peePoos, initialPosition]
           })
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

      return(
        <>
          <View style={styles.container}>

          <View>
            <Text style={styles.titleText}>{this.props.currentDog.name}'s Walks</Text>
            {this.state.walkOn === true ? <TouchableOpacity onPress={this.toggleWalkStatus} style={styles.walkButton}>
               <Text style={styles.buttonText}>Finish Walk</Text>
            </TouchableOpacity> :
            <TouchableOpacity onPress={this.toggleWalkStatus} style={styles.walkButton}>
              <Text style={styles.buttonText}>Start Walk</Text>
            </TouchableOpacity> }
            {this.state.walkOn && <View>
                <TouchableOpacity onPress={this.recordPee} style={styles.walkButton}>
                  <Text style={styles.buttonText}>Record Pee 🌧️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.recordPoop} style={styles.walkButton}>
                  <Text style={styles.buttonText}>Record Poop 💩</Text>
                </TouchableOpacity>
              </View>}
          </View> 

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
                {this.state.walkOn && <>
                  <Polyline 
                  coordinates={this.state.walkInfo.datapoints}
                  geodesic={true}
                  strokeColor={'rgb(52, 137, 148)'}
                  strokeWidth={7} />
                 
                  {this.state.peePoos.map(peePoo =>  
                  <Marker coordinate={{latitude: peePoo.latitude, longitude: peePoo.longitude} }>
                    {peePoo.pee ? <Image source={require('./assets/pee.png')} style={styles.peeImage}/> :
                    <Image source={require('./assets/poop.png')} style={styles.peeImage}/>}
                  </Marker>)}
                
                  </>}
            </MapView>

            {this.state.recentWalks.length !== 0 ? 
          <View>
            <Text style={styles.titleText}>Last Walk</Text>
            {this.state.recentWalks.slice(0,1).map(walk => 
                <Text key={walk.id} style={styles.regularText}> 
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
          </View>

        
        </>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 5,
      backgroundColor: '#4db6ac'
    },
    titleText: {
      fontSize: 22,
      alignSelf: 'center',
      fontWeight: 'bold',
      color: 'white',
      marginTop: 20,
      marginBottom: 10
    },
    walkButton: {
      height: 40,
      width: 200,
      alignSelf: "center",
      justifyContent: 'center',
      borderRadius: 10,
      borderColor: '#e0f2f1',
      borderWidth: 3,
      borderStyle: 'dotted',
      marginTop: 10,
      marginBottom: 15,
      borderColor: 'green',
      borderRadius: 70
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    },
    map: {
      height: 350,
      width: 350,
    },
    walk: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#4db6ac'
    },
    regularText: {
      color: 'white',
      fontWeight: 'bold'
    },
    peeImage: {
      height: 50,
      width: 50
    }
   });

  export default Walk