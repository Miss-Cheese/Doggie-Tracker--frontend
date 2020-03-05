import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function SwitchDogs (props) {

    
    const handleDogSwitch = (dog) => {
        props.setCurrentDog(dog)
        props.navigation.navigate('Dashboard')
    }

    return (
        <View style={styles.container}>
            {props.userDogs.map(dog => <View key={dog.id}>
                    <TouchableOpacity onPress={() => handleDogSwitch(dog)} style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>{dog.name}</Text>
                    </TouchableOpacity>
                </View> )}
        </View>
    )
}

export default SwitchDogs


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#4db6ac'
    },
    titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center'
    },
    buttonStyle: {
        height: 40,
        width: 150,
        alignContent: "center",
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#e0f2f1',
        borderWidth: 3,
        borderStyle: 'dotted',
        margin: 12,
        marginTop: 30
      },
      buttonText: {
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
  })
