import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Picker} from 'react-native';

  class Meal extends React.Component {

    state = {
      mealInfo: {
        dog_id: 1,
        food: '',
        meal_type: 'breakfast',
        date: '2020-02-21',
        time: '13:37'
      },
      recentMeals: ['', '', '']
    }

    updateFoodInState = (userInput) => {
      this.setState({
        mealInfo: {
          ...this.state.mealInfo,
          food: userInput
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

          <Button title="Add Meal" onPress={() => this.updateMealInDb()}></Button>
        </View>
        <View style={styles.container}>
            <Text>Meal History</Text>
            <Text> 
              Date: {this.state.recentMeals[0].date}
              Meal Type: {this.state.recentMeals[0].meal_type}
              Food: {this.state.recentMeals[0].food}
            </Text> 
            <Text> 
              Date: {this.state.recentMeals[1].date}
              Meal Type: {this.state.recentMeals[1].meal_type} 
              Food: {this.state.recentMeals[1].food} 
            </Text> 
            <Text>  
              Date: {this.state.recentMeals[2].date}
              Meal Type: {this.state.recentMeals[2].meal_type}
              Food: {this.state.recentMeals[2].food}
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

  export default Meal