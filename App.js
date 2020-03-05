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

global.BASE_URL = `https://doggie-tracker.herokuapp.com`
const Stack = createStackNavigator();
console.disableYellowBox = true

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
    }, () => this.getUserDogs())
  }

  logoutUser = () => {
    this.setState({
      loggedIn: false
    })
  }

  getUserDogs = () => {
    fetch(`${BASE_URL}/dogs`)
    .then(response => response.json())
    .then(data => {
      let dogs = data.filter(dog => 
        dog.user !== null && dog.user.id === this.state.currentUser.id)
      this.setState({
          userDogs: dogs
      }, () => this.setCurrentDog())
    })
  }

  setCurrentDog = (dog = null) => {
    if (!dog) {
      if (this.state.userDogs.length !== 0)
       {
        this.setState({
          currentDog: this.state.userDogs[0]
        })
       }
    }
    else {
      this.setState({
        currentDog: dog
      })
      // this.props.navigation.navigate('Dashboard')
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
            {props => <Dashboard {...props} loggedIn={this.state.loggedIn} currentDog={this.state.currentDog} userDogs={this.state.userDogs}/> }
            </Stack.Screen>

          <Stack.Screen name="Weight" options={{headerTitle: props => <Text {...props}>Weight</Text>}}>
            {props => <WeightScreen {...props} currentDog={this.state.currentDog}/>}
            </Stack.Screen>

          <Stack.Screen name="Meals" options={{headerTitle: props => <Text {...props}>Meals</Text>}}>
            {props => <MealScreen {...props} currentDog={this.state.currentDog}/>}
            </Stack.Screen>

          <Stack.Screen name="Walk" options={{headerTitle: props => <Text {...props}>Walk</Text>}}>
            {props => <WalkScreen {...props} currentDog={this.state.currentDog}/>}
            </Stack.Screen>

          <Stack.Screen name="Emergency" component={Emergency}/>

          <Stack.Screen name="UserProfile" options={{headerTitle: props => <Text {...props}>Profile</Text>}}>
            {props => <UserProfile {...props} currentUser={this.state.currentUser} 
            userDogs={this.state.userDogs}
            updateUserInfoAfterEdit={this.updateUserInfoAfterEdit}
            logoutUser={this.logoutUser}
            />}
            </Stack.Screen>

          <Stack.Screen name="SwitchDogs" options={{headerTitle: props => <Text {...props}>Select Dog</Text>}}>
          {props => <SwitchDogs {...props} currentUser={this.state.currentUser} 
          userDogs={this.state.userDogs} setCurrentDog={this.setCurrentDog}
          currentDog={this.state.currentDog}/>}
          </Stack.Screen>

          <Stack.Screen name="AddDog" options={{headerTitle: props => <Text {...props}>Add Dog</Text>}}>
            {props => <AddDog {...props} currentUser={this.state.currentUser} getUserDogs={this.getUserDogs}/>}
            </Stack.Screen>
      </Stack.Navigator>
      </NavigationContainer>
    );

  }
}



export default App;