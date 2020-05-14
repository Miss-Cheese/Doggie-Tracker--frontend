import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, TouchableOpacity, Image } from 'react-native';

function Dashboard (props) {

    return (
      <>
        <View style={styles.container}>
            
            {!props.loggedIn && 
            <>
            <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('Signup')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            </>
            }
            {
              props.loggedIn && props.userDogs.length === 0 ?
              <>
              <Text style={styles.titleText}>You don't have any dogs yet!</Text>
              <TouchableOpacity onPress={() => props.navigation.navigate('AddDog')} style={styles.buttonStyle}> 
                <Text style={styles.buttonText}>Add a dog</Text>
              </TouchableOpacity>
              </> : null
            }

            {props.loggedIn && props.userDogs.length > 0 ? 
            <>
            <Text style={styles.titleText}>{props.currentDog.name}'s Dashboard</Text>

            <TouchableOpacity onPress={() => props.navigation.navigate('Walk')} style={[styles.buttonStyle, styles.walkButton]}>
              <Text style={[styles.buttonText, styles.walkButtonText]}>Walk!</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('Weight')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Add Weight</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => props.navigation.navigate('Meals')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Add Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => props.navigation.navigate('UserProfile')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            </> 
            : null }
            { props.userDogs.length > 1 ? 
            <>
            <TouchableOpacity onPress={() => props.navigation.navigate('SwitchDogs')} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Switch Dogs</Text>
            </TouchableOpacity>
            </> : null }

            <TouchableOpacity onPress={() => props.navigation.navigate('Emergency')} style={[styles.buttonStyle, styles.emergencyButton]}>
              <Text style={styles.buttonText}>Emergency</Text>
            </TouchableOpacity>

            { props.loggedIn ? 
            <>
            <TouchableOpacity onPress={props.logoutUser} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            </> : null }
            
        </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#4db6ac',
      padding: 30
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'rgb(255, 255, 255)',
      marginTop: 15,
      marginBottom: 30
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
      margin: 12
    },
    walkButton: {
      borderColor: 'green',
      borderRadius: 70,
      height: 140,
      width: 140
    },
    walkButtonText: {
      fontSize: 40,
    },
    emergencyButton: {
      borderColor: 'red'
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    }
  })


export default Dashboard