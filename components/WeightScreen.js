import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LineChart } from "react-native-chart-kit";


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
          recentWeight: currentDogWeights.slice(-6)
        })
      })
    }

    
    componentDidMount () {
      this.getRecentWeight()
    }

    turnStringIntoDate = (stringDate) => {
      let dateObj = new Date(Date.parse(stringDate))
      let dstring = dateObj.toLocaleDateString()
      return dstring.substring(0, dstring.length - 5)
    }

    
    render () {
      
      let displayWeights = this.state.recentWeight.filter(weight => weight.amount > 0)

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

          {displayWeights.length !== 0 ?
          <View style={styles.weightChart}>
          <Text style={styles.titleText}>Weight History</Text>
          <LineChart
    data={{
      labels: displayWeights.map(weight => this.turnStringIntoDate(weight.date)),
      datasets: [
        {
          data:
            displayWeights.map(weight => weight.amount)

        }
      ]
    }}
    width={380} // from react-native
    height={250}
    yAxisSuffix=" lbs"
    fromZero={true}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#ffaaff",
      backgroundGradientFrom: "#b64d87",
      backgroundGradientTo: "#e67da7",
      decimalPlaces: 1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#993399"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />

          </View> : <View style={styles.container}><Text style={styles.titleText}>No Recent Weight History</Text></View>
          }
        </>  
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      backgroundColor: '#4db6ac'
    },
    weightChart: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4db6ac'
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 20,
      marginBottom: 20
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