import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class AddDog extends React.Component {

    state = {
        user_id: this.props.currentUser.id,
        name: ''
    }


    updateNameInState = (input) => {
        this.setState({
            name: input
        })
    }

    persistDogInDb = () => {
        fetch(`${BASE_URL}/dogs`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
         body: JSON.stringify(this.state) 
        })
        this.props.getUserDogs()
        this.props.navigation.navigate('UserProfile')
      }

    render () {

        return (
            <>
            
            <View style={styles.container}>
                <Text style={styles.titleText}>Add New Dog</Text>
                <View>
                    <TextInput style={styles.inputStyle}
                    value={this.state.name} placeholder="Dog Name"
                    onChangeText={(input) => this.updateNameInState(input)}/>
                </View>
                <TouchableOpacity onPress={this.persistDogInDb} style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>Create</Text>
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
    backgroundColor: '#4db6ac'
  },
  titleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    alignContent: 'center',
    marginTop: 30
  },
  inputStyle: {
    height: 40, 
    width: 120, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5,
    backgroundColor: 'white', 
    padding: 10,
    justifyContent: 'center',
    marginTop: 30
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
      margin: 12,
      marginTop: 30
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    }
  })

export default AddDog

