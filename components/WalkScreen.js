import React from 'react';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';

  class Walk extends React.Component {

    state = {
      walkOn: false,
      walkInfo: {
        dog_id: 1,
        start_time: '7:00',
        finish_time: '7:25',
        pee: 0,
        poop: 0
      }
    }


    toggleWalkStatus = () => {
      this.setState({
        walkOn: !this.state.walkOn
      })
    }

    render () {

      // console.log(this.state.walkOn)

      return(
          <View>
            <Text>Binky's Walks</Text>
            {this.state.walkOn === true ? <Button title="Finish Walk" onPress={this.toggleWalkStatus}></Button> :
            <Button title="Start Walk" onPress={this.toggleWalkStatus}></Button> }
            <Button title="Record Pee"></Button>
            <Button title="Record Poop"></Button>
          </View>
      )
    }

  }

  export default Walk