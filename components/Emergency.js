import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'

function Emergency (props) {

    showWelcomeMessage = () => {
        Alert.alert('Welcome to AMC')
    }

    return (
        <View>
            <>
            <View style={styles.button}>
                <Button title="Find Emergency Vet"></Button>    
            </View>
            <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE} 
              style={styles.map}
              region={{
                latitude: 40.7602676,
                longitude: -73.9590816,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              >
              <Marker
            //   draggable
              coordinate={{ latitude: 40.7602676, longitude: -73.9590816 }}>
                  <Callout onPress={showWelcomeMessage}>
                      <Text>AMC</Text>
                  </Callout>

            </Marker>
            </MapView>
          </View>
            </>

        </View>
    )
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