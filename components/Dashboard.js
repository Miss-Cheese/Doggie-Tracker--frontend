import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button } from 'react-native';


function Dashboard (props) {

  // console.log(props)

    return (
        <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.container}>
                    {/* <Text>Binky's Dashboard</Text> */}
                    {!props.loggedIn &&
                    <>
                    <Button title="Log In" onPress={() => props.navigation.navigate('Login')} />
                    <Button title="Sign Up" onPress={() => props.navigation.navigate('Signup')} />
                    </>}

                    {props.loggedIn &&
                    <>
                    <Button title="Add Weight" onPress={() => props.navigation.navigate('Weight')}/>
                    <Button title="Add Meal" onPress={() => props.navigation.navigate('Meals')} />
                    <Button title="Walk!" onPress={() => props.navigation.navigate('Walk')} />
                    <Button title="Profile" onPress={() => props.navigation.navigate('UserProfile')} />
                    </>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30
    }
  })


export default Dashboard