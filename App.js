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

    console.log(this.state)

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

          <Stack.Screen name="Weight" component={WeightScreen}/>
          <Stack.Screen name="Meals" component={MealScreen}/>
          <Stack.Screen name="Walk" component={WalkScreen}/>

          <Stack.Screen name="UserProfile" options={{headerTitle: props => <Text {...props}>Profile</Text>}}>
            {props => <UserProfile {...props} currentUser={this.state.currentUser} 
            userDogs={this.state.userDogs}
            updateUserInfoAfterEdit={this.updateUserInfoAfterEdit}/>}
            </Stack.Screen>

          <Stack.Screen name="SwitchDogs" options={{headerTitle: props => <Text {...props}>Select Dog</Text>}}>
          {props => <SwitchDogs {...props} currentUser={this.state.currentUser} userDogs={this.state.userDogs}/>}
          </Stack.Screen>

          <Stack.Screen name="AddDog" options={{headerTitle: props => <Text {...props}>Add Dog</Text>}}>
            {props => <AddDog {...props} currentUser={this.state.currentUser}/>}
            </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    );

  }
}

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

export default App;

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step Hello!!!</Text>
//               <Button title="Hello Button"/>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };
