import React from 'react';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';

  class Weight extends React.Component {

    state = {
      weightInfo: {
        dog_id: 1,
        amount: 0,
        date: '2020-02-21'
        },
      recentWeight: ['', '', '']
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
        recentWeight: recentWeightData.reverse()
      }))
    }
    
    componentDidMount () {
      this.getRecentWeight()
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
            <Text> 
              Date: {this.state.recentWeight[0].date}
              Weight: {this.state.recentWeight[0].amount}
            </Text> 
            <Text> 
              Date: {this.state.recentWeight[1].date}
              Weight: {this.state.recentWeight[1].amount} 
            </Text> 
            <Text>  
              Date: {this.state.recentWeight[2].date}
              Weight: {this.state.recentWeight[2].amount}
            </Text> 
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