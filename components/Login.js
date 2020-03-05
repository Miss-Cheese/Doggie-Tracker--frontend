import React from 'react';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Login extends React.Component {

    state = {
        email: '',
        password: ''
    }

    updateEmailInState = (input) => {
        this.setState({
            email: input
        })
    }

    updatePasswordInState = (input) => {
        this.setState({
            password: input
        })
    }

    handleLogIn = () => {
        let loggedInUser
        fetch(`${BASE_URL}/users`)
          .then(response => response.json())
          .then(data => {
            loggedInUser = data.find(user => user.email === this.state.email)
            this.props.loginUser(loggedInUser)
        })
        this.props.navigation.navigate('Dashboard')
    }



    render () {

        // console.log(this.state)

        return(
            <>
            <View style={styles.header}>
                <Text style={styles.titleText}>Welcome hooman!</Text>
                <Text style={styles.titleText}>Please log in ;)</Text>
            </View>
            <View style={styles.container}>
                <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }}
                value={this.state.email} placeholder="Email"
                textContentType="emailAddress"
                autoCompleteType="email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(input) => this.updateEmailInState(input)}/>
                <TextInput style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
                value={this.state.password} placeholder="Password"
                secureTextEntry={true}
                onChangeText={(input) => this.updatePasswordInState(input)}/>
                <TouchableOpacity onPress={() => this.handleLogIn()} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 4,
    //   justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4db6ac'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#4db6ac',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)',
        marginTop: 30,
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



export default Login