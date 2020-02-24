import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker} from 'react-native';

  class Meal extends React.Component {

    state = {
      mealInfo: {
        dog_id: 1,
        food: '',
        meal_type: 'breakfast',
        datetime: '2020-02-21'
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
      fetch('http://localhost:3000/meals', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
       body: JSON.stringify(this.state.mealInfo) 
      })
    }

    componentDidMount () {
      fetch('http://localhost:3000/meals')
      .then(response => response.json())
      .then(recentMealData => this.setState({
        recentMeals: recentMealData.reverse()
      }))
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
            value={this.state.food}
            onChangeText={(userInput) => this.updateFoodInState(userInput)}/>

          <Picker
            selectedValue={this.state.mealInfo.meal_type}
            style={{height: 50, width: 100}}
            onValueChange={(userInput) => this.updateMealTypeInState(userInput)}>
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