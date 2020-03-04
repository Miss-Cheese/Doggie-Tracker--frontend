import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

function SwitchDogs (props) {

    return (
        <View style={styles.container}>
            <Text>Your Dogs: </Text>
            {props.userDogs.map(dog => <View key={dog.id}>
                <Text style={styles.titleText}> {dog.name} </Text>
                    <Button title="Select" onPress={() => props.setCurrentDog(dog)}></Button>
                </View> )}
        </View>
    )
}

export default SwitchDogs


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30
    },
    titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center'
    },
  })
