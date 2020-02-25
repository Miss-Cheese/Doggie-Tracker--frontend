import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
  } from 'react-native';


function Dashboard ({navigation}) {

    return (
        <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.container}>
                    <Text>Binky's Dashboard</Text>
                    <Button title="Add Weight" onPress={() => navigation.navigate('Weight')}/>
                    <Button title="Add Meal" onPress={() => navigation.navigate('Meals')} />
                    <Button title="Walk!" onPress={() => navigation.navigate('Walk')} />
                    <Button title="Log In" onPress={() => navigation.navigate('Login')} />
                    <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
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