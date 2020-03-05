import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class UserProfile extends React.Component { 

    state = {
       editingProfile: false,
       userInfo: {
           name: this.props.currentUser.name,
           email: this.props.currentUser.email,
           password: this.props.currentUser.password
       }
    }

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
            fetch(`${BASE_URL}/users/${this.props.currentUser.id}`, {
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
            [ {text: 'OK', onPress: () => this.deleteUserFromDBandLogOut}],
            {cancelable: true},
          );
          
    }

    deleteUserFromDBandLogOut = () => {
        fetch(`${BASE_URL}/users/${this.props.currentUser.id}`, {
            method: "DELETE"
        })    
        this.props.logoutUser()
    }


    render () {

        return(
            <>
            <View style={styles.container}>
                <Text style={styles.regularText}>Name: {this.props.currentUser.name}</Text>
                <Text style={styles.regularText}>Email: {this.props.currentUser.email}</Text>
                <TouchableOpacity onPress={this.toggleEditForm} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Edit Your Profile</Text>
                </TouchableOpacity>
                
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

                    <TouchableOpacity onPress={this.updateUserInDb} style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                    </>
                }
                <TouchableOpacity onPress={this.deleteUser} style={styles.buttonStyle}>
                <Text style={styles.buttonText}>Delete Your Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
             { this.props.userDogs.length > 1 ?
                    <>
                    <Text style={styles.profileText}>Your Dogs: </Text>
                    { 
                        this.props.userDogs.map(dog => 
                            <Text key={dog.id} style={styles.regularText}>{dog.name}</Text>
                            )
                    }
                    </> : <Text>You don't have any dogs yet.</Text>
             }
                
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddDog')} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Add new dog</Text>
                </TouchableOpacity>
            </View>
            </>

        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    //   justifyContent: 'space-around',
      backgroundColor: '#4db6ac'
    },
    profileText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)'
    },
    regularText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)',
        marginTop: 20
    },
    buttonStyle: {
        height: 40,
        width: 200,
        alignContent: "center",
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#e0f2f1',
        borderWidth: 3,
        borderStyle: 'dotted',
        // margin: 15,
        marginTop: 20
      },
      buttonText: {
        color: 'white',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }
  })

export default UserProfile




