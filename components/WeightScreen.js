import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    StatusBar,
    Button,
  } from 'react-native';

  class Weight extends React.Component {

    state = {
      weightInfo: {
        dog_id: 1,
        amount: 0,
        date: '2020-02-20'
        },
      recentWeight: []
    }

    updateStateWeight = (input) => {
      this.setState({
        weightInfo: {
          ...this.state.weightInfo,
          amount: input
        }
      })
    }


    updateDbWeight = () => {
      fetch('http://localhost:3000/weights', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
       body: JSON.stringify(this.state.weightInfo) 
      })
    }

    getRecentWeight = () => {
      fetch('http://localhost:3000/weights')
      .then(response => response.json())
      .then(recentWeightData => this.setState({
        recentWeight: recentWeightData
      }))
    }

    render () {
  
      return(
        <>
          <View style={styles.container}>
            <Text>Binky's Weight</Text>
            <Text>Today's Weight</Text>
            <TextInput
              style={{ height: 40, width: 50, borderColor: 'gray', borderWidth: 1 }}
              keyboardType='numeric'
              value={this.state.amount}
              maxLength={3}
              onChangeText={(input) => this.updateStateWeight(input)}/>
            <Button title="Update Weight" onPress={() => this.updateDbWeight()}></Button>
          </View>
          <View style={styles.container}>
            <Text>Weight History</Text>
            <Text>Date</Text> 
            <Text>Weight</Text>
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

  export default Weight