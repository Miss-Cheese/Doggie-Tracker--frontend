import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

class Signup extends React.Component {

    state = {
        email: '',
        password: '',
        name: ''
    }


    updateEmailInState = (input) => {
        this.setState({
            email: input
        })
    }

    updateNameInState = (input) => {
        this.setState({
            name: input
        })
    }

    updatePasswordInState = (input) => {
        this.setState({
            password: input
        })
    }

    persistUserInDb = () => {
        if (this.state.email === '' || this.state.name === '' || this.state.password === '') {
            Alert.alert(
                'Alert',
                'Please enter all information to sign up',
                [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: true},
              );
        } else {
            fetch('http://localhost:3000/users', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
             body: JSON.stringify(this.state) 
            })
          }
          this.props.navigation.navigate('Login')
        }

    render () {

        console.log()

        return (
            <>
            <View style={styles.container}>
                <Text>Sign up for DoggieTracker</Text>
                <View>
                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.email} placeholder="Email"
                    onChangeText={(input) => this.updateEmailInState(input)}/>

                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.name} placeholder="Name"
                    onChangeText={(input) => this.updateNameInState(input)}/>

                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.password} placeholder="Password"
                    onChangeText={(input) => this.updatePasswordInState(input)}/>
                </View>
                <Button title="Sign Up" onPress={this.persistUserInDb}></Button>
            </View>
            </>
        ) // should be redirect / message after user successfully signed up.
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30
    }
  })

export default Signup

