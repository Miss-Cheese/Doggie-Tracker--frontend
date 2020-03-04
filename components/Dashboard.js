import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, TouchableOpacity, Image } from 'react-native';

function Dashboard (props) {

  // console.log(props)

    return (
      <>
      <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View style={styles.container}>
                  
                  {/* {!props.loggedIn && } */}
                  <>
                  <Button title="Log In" onPress={() => props.navigation.navigate('Login')} />
                  <Button title="Sign Up" onPress={() => props.navigation.navigate('Signup')} />
                  </>
                  

                  {/* {
                    props.loggedIn && props.userDogs.length === 0 ?
                    <>
                    <Text>You don't have any dogs yet!</Text>
                    <Button title="Add a dog" onPress={() => props.navigation.navigate('AddDog')}/>
                    </> : null
                  } */}

                  {/* {props.loggedIn && props.userDogs.length > 0 ? : null } */}
                  <>
                  <Text style={styles.titleText}>{props.currentDog.name}'s Dashboard</Text>
                  <Button title="Add Weight" onPress={() => props.navigation.navigate('Weight')}/>
                  <Button title="Add Meal" onPress={() => props.navigation.navigate('Meals')} />

                  <Button title="Walk!" onPress={() => props.navigation.navigate('Walk')} />

                  <Button title="Emergency" onPress={() => props.navigation.navigate('Emergency')} />

                  <Button title="Profile" onPress={() => props.navigation.navigate('UserProfile')} />
                  </> 
                  { props.userDogs.length > 1 ? 
                  <>
                  <Button title="Switch Dogs" onPress={() => props.navigation.navigate('SwitchDogs')} /> 
                  </> : null }
                  
                  
                     
              </View>
          </ScrollView>
      </SafeAreaView>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    button: {
      height: 100,
      width: 100,
      alignContent: "center"
    }
  })


export default Dashboard