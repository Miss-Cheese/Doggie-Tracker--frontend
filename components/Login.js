import React from 'react';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';

class Login extends React.Component {

    state = {
        email: '',
        password: '',
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

    handleSubmit = () => {
        fetch("http://localhost:3000/users")
          .then(response => response.json())
          .then(data => {
            let loggedInUser = data.find(user => user.email === this.state.email )
            this.setState({
              loggedIn: true,
              user_id: loggedInUser.id
            })
        })
    }



    render () {

        console.log(this.state)

        return(
            <>
            <View style={styles.container}>
                <Text>Welcome hooman!</Text>
                <Text>Please log in ;)</Text>
            </View>
            <View style={styles.container}>
                <TextInput style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
                value={this.state.email} placeholder="Email"
                onChangeText={(input) => this.updateEmailInState(input)}/>
                <TextInput style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
                value={this.state.password} placeholder="Password"
                onChangeText={(input) => this.updatePasswordInState(input)}/>
                <Button title="Log In" onPress={this.handleSubmit} onPress={() => this.props.navigation.navigate('Dashboard')}></Button>
            </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30
    }
  })



export default Login