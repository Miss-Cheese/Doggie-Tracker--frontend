import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker, Alert } from 'react-native';

  class Meal extends React.Component {

    state = {
      mealInfo: {
        dog_id: 1,
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
      .then(recentMealData => this.setState({
        recentMeals: recentMealData.reverse()
      }))
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
        <>
        <View style={styles.container}>
          <Text>Binky's Meals</Text>
          <TextInput
            style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
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
          <Button title="Add Meal" onPress={() => this.updateMealInDb()}></Button>
        </View>
        {this.state.recentMeals.length !== 0 ? 
        <View style={styles.container}>
            <Text>Meal History</Text>

            {this.state.recentMeals.slice(0,3).map(meal => 
                <Text key={meal.id}> 
                  Date: {this.turnStringIntoDate(meal.datetime)}{"\n"}
                  Time: {this.turnStringIntoTime(meal.datetime)}{"\n"}
                  Meal Type: {meal.meal_type}{"\n"}
                  Food: {meal.food}
                </Text> 
              )
            }
          </View> : <View style={styles.container}><Text> No Meal History</Text></View>
        }
      </>  
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: 'center',
      marginTop: 30,
      padding: 10
    }
  })

  export default Meal