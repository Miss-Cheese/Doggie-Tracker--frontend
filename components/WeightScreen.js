import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableWithoutFeedbackBase} from 'react-native';

  class Weight extends React.Component {

    state = {
      weightInfo: {
        dog_id: 1,
        amount: 0,
        date: ''
        },
      recentWeight: []
    }


    updateStateWeight = (input) => {

      let currentDate = new Date()
      this.setState({
        weightInfo: {
          ...this.state.weightInfo,
          amount: input, 
          date: currentDate.toString()
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
        recentWeight: recentWeightData.reverse()
      }))
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

          {this.state.recentWeight.length !== 0 ? 
          <View style={styles.container}>
            <Text>Weight History</Text>
            {this.state.recentWeight.slice(0,5).map(weight => 
                <Text key={weight.id}> 
                  Date: {this.turnStringIntoDate(weight.date)}{"\n"}
                  Weight: {weight.amount}
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
      marginTop: 30
    }
  })

  export default Weight