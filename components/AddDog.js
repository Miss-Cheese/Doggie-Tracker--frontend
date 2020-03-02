import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker} from 'react-native';

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
        fetch('http://192.168.2.147:3000/dogs', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
         body: JSON.stringify(this.state) 
        })
        this.props.navigation.navigate('UserProfile')
      }

    render () {

        return (
            <>
            
            <View style={styles.container}>
                <Text>Add New Dog</Text>
                <View>
                    <TextInput style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
                    value={this.state.name} placeholder="Name"
                    onChangeText={(input) => this.updateNameInState(input)}/>
                </View>
                <Button title="Create" onPress={this.persistDogInDb}></Button>
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

export default AddDog

