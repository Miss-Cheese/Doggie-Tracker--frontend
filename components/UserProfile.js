import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

class UserProfile extends React.Component { 

    state = {
    //    userDogs: [],
       editingProfile: false,
       userInfo: {
           name: this.props.currentUser.name,
           email: this.props.currentUser.email,
           password: this.props.currentUser.password
       }
    }

    // componentDidMount() {
    //     fetch("http://localhost:3000/dogs")
    //     .then(response => response.json())
    //     .then(data => {
    //       dogs = data.filter(dog => dog.user.id === this.props.currentUser.id)
    //       this.setState({
    //           userDogs: dogs
    //       })
    //   })
    // }

    toggleEditForm = () => {
        this.setState({
            editingProfile: !this.state.editingProfile
        })
    }
    
    updateNameInState = (input) => {
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                name: input
            }
        })
    }
    
    updateEmailInState = (input) => {
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                email: input
            }
        })
    }

    updatePasswordInState = (input) => {
        this.setState({
            userInfo: {
                ...this.state.userInfo,
                password: input
            }
        })
    }

    updateUserInDb = () => {
        if (this.state.userInfo.email === '' || this.state.userInfo.name === '' || this.state.userInfo.password === '') {
            Alert.alert(
                'Alert',
                'Please enter all information to sign up',
                [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: true},
              );
        } else {
            fetch(`http://localhost:3000/users/${this.props.currentUser.id}`, {
              method: "PATCH",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
             body: JSON.stringify(this.state.userInfo) 
            })
          }
        this.props.updateUserInfoAfterEdit(this.state.userInfo)
        this.setState({
            editingProfile: false
        })
        }

    deleteUser = () => {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete this user?',
            [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: true},
          );
          fetch(`http://localhost:3000/users/${this.props.currentUser.id}`, {
            method: "DELETE"
        })    
    }


    render () {

        return(
            <>
            <View style={styles.container}>
                <Text>Name: {this.props.currentUser.name}</Text>
                <Text>Email: {this.props.currentUser.email}</Text>
                <Button title="Edit Your Profile" onPress={this.toggleEditForm}></Button>
                
                { this.state.editingProfile && 
                    <>
                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.userInfo.name} placeholder="Enter new name"
                    onChangeText={(input) => this.updateNameInState(input)}/>

                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.userInfo.email} placeholder="Enter new email"
                    onChangeText={(input) => this.updateEmailInState(input)}/>

                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.userInfo.password} placeholder="Enter new password"
                    onChangeText={(input) => this.updatePasswordInState(input)}/>

                    <Button title="Update Profile" onPress={this.updateUserInDb}></Button>
                    </>
                }
                <Button title="Delete Your Profile" onPress={this.deleteUser}></Button>
            </View>
            <View style={styles.container}>
                <Text>Your Dogs: </Text>
                    { 
                        this.state.userDogs.map(dog => 
                            <Text key={dog.id}>{dog.name}</Text>
                            )
                    }
                
                <Button title="Add new dog" onPress={() => this.props.navigation.navigate('AddDog')} />
            </View>
            </>

        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 30,
      padding: 5
    }
  })

export default UserProfile




