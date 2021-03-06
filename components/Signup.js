import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Signup extends React.Component {

    state = {
        email: '',
        password: '',
        passwordConfirmation: '',
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


    updatePasswordConfirmationInState = (input) => {
        this.setState({
            passwordConfirmation: input
        })
    }


    persistUserInDb = () => {

        if (this.state.password === this.state.passwordConfirmation) {
            if (this.state.email === '' || this.state.name === '' || this.state.password === '') {
                Alert.alert(
                    'Alert',
                    'Please enter all information to sign up',
                    [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
                    {cancelable: true},
                  );
            } else {
                fetch(`${BASE_URL}/signup`, {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                 body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name
                 }) 
                })
                .then(response => response.json())
                .then(response => {
                    if (response.errors) {
                        Alert.alert('Error', response.errors[0])
                    } else {
                        this.props.navigation.navigate('Login')
                    }
                })
              }
        } else {
            Alert.alert(
                'Alert',
                "Passwords don't match",
                [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: true},
            );
        }
    }





    render () {

        return (
            <>
            <View style={styles.container}>
                <Text style={styles.titleText}>Sign up for DoggieTracker</Text>
                <View>
                    <TextInput style={styles.inputStyle}
                    value={this.state.email} placeholder="Email"
                    textContentType="emailAddress"
                    autoCompleteType="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(input) => this.updateEmailInState(input)}/>

                    <TextInput style={styles.inputStyle}
                    value={this.state.name} placeholder="Name"
                    onChangeText={(input) => this.updateNameInState(input)}/>

                    <TextInput style={styles.inputStyle}
                    value={this.state.password} placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(input) => this.updatePasswordInState(input)}/>

                    <TextInput style={styles.inputStyle}
                    value={this.state.passwordConfirmation} placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(input) => this.updatePasswordConfirmationInState(input)}/>
                </View>
                <TouchableOpacity onPress={this.persistUserInDb} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Sign Up!</Text>
                </TouchableOpacity>
            </View>
            </>
        ) // should be redirect / message after user successfully signed up.
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#4db6ac',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)',
        // marginTop: 30,
      },
      inputStyle: {
        height: 40, 
        width: 200, 
        borderColor: 'gray', 
        borderWidth: 1, 
        borderRadius: 5,
        backgroundColor: 'white', 
        padding: 10,
        justifyContent: 'center',
        marginBottom: 10
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
        margin: 10
      },
      buttonText: {
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
  })

export default Signup

