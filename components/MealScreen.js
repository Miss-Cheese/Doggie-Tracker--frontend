import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

  class Meal extends React.Component {

    state = {
      mealInfo: {
        dog_id: this.props.currentDog.id,
        food: '',
        meal_type: '',
        datetime: ''
      },
      recentMeals: []
    }

    updateFoodInState = (userInput) => {

      let currentDate = new Date()
      this.setState({
        mealInfo: {
          ...this.state.mealInfo,
          food: userInput,
          datetime: currentDate.toString()
        }
      })
    }

    updateMealTypeInState = (userInput) => {
      this.setState({
        mealInfo: {
          ...this.state.mealInfo,
          meal_type: userInput
        }
      })
    }


    updateMealInDb = () => {
      if (this.state.mealInfo.food === '') {
        Alert.alert(
          'Alert',
          'Please enter meal',
          [ {text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: true},
        );
      } else {
        fetch(`${BASE_URL}/meals`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
         body: JSON.stringify(this.state.mealInfo) 
        })
      }
      this.getRecentMeals()
      this.setState({
        ...this.state,
        mealInfo: {
          ...this.state.mealInfo,
          food: '',
          meal_type: ''
        }
      })
    }

    getRecentMeals = () => {
      fetch(`${BASE_URL}/meals`)
      .then(response => response.json())
      .then(recentMealData => {
        let currentDogMeals = recentMealData.filter(meal => meal.dog_id === this.props.currentDog.id)
        this.setState({
        recentMeals: currentDogMeals.reverse()})
      })
    }



    componentDidMount () {
      this.getRecentMeals()
    }

    turnStringIntoDate = (stringDate) => {
      let dateObj = new Date(Date.parse(stringDate))
      return dateObj.toLocaleDateString()
    }

    turnStringIntoTime = (stringDate) => {
      let dateTimeObj = new Date(Date.parse(stringDate))
      return dateTimeObj.toLocaleTimeString()
    }

    render () {

      return(
        <View style={styles.container}>
        <View >
        <Text style={styles.titleText}>{this.props.currentDog.name}'s Meals</Text>
          <TextInput style={styles.inputStyle}
            value={this.state.mealInfo.food}
            onChangeText={(userInput) => this.updateFoodInState(userInput)}/>

          <Picker
            selectedValue={this.state.mealInfo.meal_type}
            style={{height: 50, width: 200}}
            onValueChange={(userInput) => this.updateMealTypeInState(userInput)}>
            <Picker.Item label="Select Meal" value="" />
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Dinner" value="Dinner" />
            <Picker.Item label="Snack" value="Snack" />
          </Picker>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.updateMealInDb()} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
        {this.state.recentMeals.length !== 0 ? 
        <View >
            <Text style={styles.titleText}>Meal History</Text>

            {this.state.recentMeals.slice(0,3).map(meal => 
                <Text key={meal.id} style={styles.textBlock}> 
                  Date: {this.turnStringIntoDate(meal.datetime)}{"\n"} 
                  Time: {this.turnStringIntoTime(meal.datetime)}{"\n"} 
                  Meal Type: {meal.meal_type}{"\n"} 
                  Food: {meal.food} 
                </Text> 
              )
            }
          </View> : <View ><Text style={styles.titleText}> No Meal History</Text></View>
        }
      </View>  
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4db6ac'
    },
    container2: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#4db6ac',
      // paddingBottom: 50
    },
    textBlock: {
      marginBottom: 30,
      justifyContent: 'flex-start',
      alignSelf: 'center'
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 30,
      marginBottom: 30,
     justifyContent: 'center',
     alignSelf: 'center'
    },
    regularText: {
      color: 'white',
      fontWeight: 'bold'
    },
    inputStyle: {
      height: 40, 
      width: 120, 
      borderRadius: 5,
      borderColor: 'gray', 
      borderWidth: 1, 
      backgroundColor: 'white', 
      padding: 10,
      justifyContent: 'center',
      alignSelf: 'center'
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
      marginTop: 30
    },
    buttonText: {
      color: 'white',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 18,
      fontWeight: 'bold'
    }
  })

  export default Meal