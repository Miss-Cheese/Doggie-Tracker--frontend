import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

  class Weight extends React.Component {

    state = {
      weightInfo: {
        dog_id: this.props.currentDog.id,
        amount: '',
        date: ''
        },
      recentWeight: []
    }


    updateStateWeight = (input) => {

      let currentDate = new Date()
      this.setState({
        ...this.state,
        weightInfo: {
          ...this.state.weightInfo,
          amount: input, 
          date: currentDate.toString()
        }
      })
    }


    updateDbWeight = () => {
      if (this.state.weightInfo.amount === '') {
        Alert.alert(
          'Alert',
          'Please enter weight',
          [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: true},
        );
      } else {
        fetch(`${BASE_URL}/weights`, { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
         body: JSON.stringify(this.state.weightInfo) 
        })
      }
      this.props.navigation.navigate('Dashboard')
    }

    getRecentWeight = () => {
      fetch(`${BASE_URL}/weights`)
      .then(response => response.json())
      .then(recentWeightData => {
        let currentDogWeights = recentWeightData.filter(weight => weight.dog_id === this.props.currentDog.id)
        this.setState({
          recentWeight: currentDogWeights.reverse()
        })
      })
    }

    
    componentDidMount () {
      this.getRecentWeight()
    }

    turnStringIntoDate = (stringDate) => {
      let dateObj = new Date(Date.parse(stringDate))
      return dateObj.toLocaleDateString()
    }

    
    render () {
      
      // console.log(stringValue) - this is to save in the database
      // console.log(new Date(Date.parse(stringValue))) - this is to get the date object back from the string
      
      return(
        <>
          <View style={styles.container}>
          <Text style={styles.titleText}>Add {this.props.currentDog.name}'s weight for today</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="lbs"
              keyboardType='numeric'
              value={this.state.amount}
              maxLength={3}
              onChangeText={(input) => this.updateStateWeight(input)}/>
            <TouchableOpacity onPress={() => this.updateDbWeight()} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Update Weight</Text>
            </TouchableOpacity>
          </View>

          {this.state.recentWeight.length !== 0 ? 
          <View style={styles.container}>
            <Text>Weight History</Text>
            {this.state.recentWeight.slice(0,5).map(weight => 
                <Text key={weight.id}> 
                  Date: {this.turnStringIntoDate(weight.date)}{"\n"}
                  Weight: {weight.amount} lbs
                </Text> 
                )
            }
          </View> : <View style={styles.container}><Text>No Recent Weight History</Text></View>
          }
        </>  
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: '#4db6ac'
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 30,
    },
    inputStyle: {
      height: 40, 
      width: 80, 
      borderColor: 'gray', 
      borderWidth: 1, 
      backgroundColor: '#d9bfc3', 
      padding: 10,
      justifyContent: 'center'
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
      margin: 9
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 18,
      fontWeight: 'bold'
    }
  })

  export default Weight