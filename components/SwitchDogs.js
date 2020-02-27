import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

function SwitchDogs (props) {

    return (
        <View style={styles.container}>
            <Text>Your Dogs: </Text>
            {props.userDogs.map(dog => <Text key={dog.id}>{dog.name}</Text> )}
        </View>
    )
}

export default SwitchDogs


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30
    }
  })
