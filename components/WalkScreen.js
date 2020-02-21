import React from 'react';
import { StyleSheet, View, Text, TextInput, Button} from 'react-native';

  class Walk extends React.Component {

    state = {

    }

    render () {

      return(
          <View>
            <Text>Binky's Walks</Text>
            <Button title="Start Walk" onPress={() => {}}></Button>
            <Button title="Finish Walk" onPress={() => {}}></Button>
          </View>
      )
    }

  }

  export default Walk