import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';
import Dashboard from './components/Dashboard'
import WeightScreen from './components/WeightScreen'
import MealScreen from './components/MealScreen'
import WalkScreen from './components/WalkScreen'
import Login from './components/Login';
import Signup from './components/Signup';
import AddDog from './components/AddDog';
import UserProfile from './components/UserProfile';
import SwitchDogs from './components/SwitchDogs'
import { log } from 'react-native-reanimated';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Emergency from './components/Emergency';

const Stack = createStackNavigator();

class App extends React.Component {

  state = {
    loggedIn: false,
    currentUser: {},
    currentDog: {},
    userDogs: []
  }

  loginUser = (loggedInUser) => {
    this.setState({
      loggedIn: true,
      currentUser: loggedInUser
    })
    this.getUserDogs()
  }

  getUserDogs = () => {
    fetch("http://localhost:3000/dogs")
    .then(response => response.json())
    .then(data => {
      dogs = data.filter(dog => dog.user.id === this.state.currentUser.id)
      this.setState({
          userDogs: dogs
      }, () => this.setCurrentDog())
    })
    
  }

  setCurrentDog = () => {
    if (this.state.userDogs.length !== 0)
     {
      this.setState({
        currentDog: this.state.userDogs[0]
      })
     }
  }

  updateUserInfoAfterEdit = (userInfo) => {
    this.setState({
      currentUser: {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password
      }
    })
  }

  render () {

    return (
      <NavigationContainer>
      
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Login" options={{headerTitle: props => <Text {...props}>Log In</Text>}}>
            {props => <Login {...props} loginUser={this.loginUser}/>}
            </Stack.Screen>
          <Stack.Screen name="Signup" component={Signup}/>

          <Stack.Screen name="Dashboard" options={{headerTitle: props => <Text {...props}>Dashboard</Text>}}>
            {props => <Dashboard {...props} loggedIn={this.state.loggedIn}/>}
            </Stack.Screen>

          <Stack.Screen name="Weight" options={{headerTitle: props => <Text {...props}>Weight</Text>}}>
            {props => <WeightScreen {...props} currentDog={this.state.currentDog}/>}
            </Stack.Screen>

          <Stack.Screen name="Meals" component={MealScreen}/>
          <Stack.Screen name="Walk" component={WalkScreen}/>

          <Stack.Screen name="Emergency" component={Emergency}/>

          <Stack.Screen name="UserProfile" options={{headerTitle: props => <Text {...props}>Profile</Text>}}>
            {props => <UserProfile {...props} currentUser={this.state.currentUser} 
            userDogs={this.state.userDogs}
            updateUserInfoAfterEdit={this.updateUserInfoAfterEdit}/>}
            </Stack.Screen>

          <Stack.Screen name="SwitchDogs" options={{headerTitle: props => <Text {...props}>Select Dog</Text>}}>
          {props => <SwitchDogs {...props} currentUser={this.state.currentUser} 
          userDogs={this.state.userDogs}
          currentDog={this.state.currentDog}/>}
          </Stack.Screen>

          <Stack.Screen name="AddDog" options={{headerTitle: props => <Text {...props}>Add Dog</Text>}}>
            {props => <AddDog {...props} currentUser={this.state.currentUser}/>}
            </Stack.Screen>
      </Stack.Navigator>
      </NavigationContainer>
    );

  }
}



export default App;