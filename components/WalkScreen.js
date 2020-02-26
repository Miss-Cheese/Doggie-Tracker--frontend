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
      },
      recentWalks: []
    }


    toggleWalkStatus = () => {
      if (this.state.walkOn === false) {
        this.setState({
          walkOn: true
        })
        this.startWalk()
      } 
      else {
        this.setState({
        walkOn: false
      })
      this.finishWalk()
    }}

    startWalk = () => {
      let currentDate = new Date()
      this.setState({
        walkInfo: {
          ...this.state.walkInfo,
          start_time: currentDate.toString()
        }
      })
    }

    finishWalk = () => {
      let currentDate = new Date()
      this.setState({
        walkInfo: {
          ...this.state.walkInfo,
          finish_time: currentDate.toString()
        }
      }, () => this.saveWalkToDb())
    }

    recordPee = () => {
      this.setState({
        walkInfo: {
          ...this.state.walkInfo,
          pee: this.state.walkInfo.pee + 1
        }
      })
    }

    recordPoop = () => {
      this.setState({
        walkInfo: {
          ...this.state.walkInfo,
          poop: this.state.walkInfo.poop + 1
        }
      })
    }

    saveWalkToDb = () => {
      fetch('http://localhost:3000/walks', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
       body: JSON.stringify(this.state.walkInfo) 
      })
      this.props.navigation.navigate('Dashboard')
    }

    getRecentWalks = () => {
      fetch('http://localhost:3000/walks')
      .then(response => response.json())
      .then(recentWalkData => this.setState({
        recentWalks: recentWalkData.reverse()
      }))
    }
    
    componentDidMount () {
      this.getRecentWalks()
    }

    turnStringIntoDate = (stringDate) => {
      let dateObj = new Date(Date.parse(stringDate))
      return dateObj.toLocaleDateString()
    }

    turnStringIntoTime = (stringDate) => {
      let dateTimeObj = new Date(Date.parse(stringDate))
      return dateTimeObj.toLocaleTimeString()
    }

    getWalkDuration = (startTimeString, finishTimeString) => {
      let startTime = new Date(Date.parse(startTimeString))
      let finishTime = new Date(Date.parse(finishTimeString))
      let walkDuration = (parseInt(finishTime.getTime()) - parseInt(startTime.getTime())) / 60000
      return Math.round(walkDuration)
    }

    render () {

      // let testDate = new Date()
      // let stringValue = testDate.toString()
      // console.log(new Date(Date.parse(stringValue)))
      return(
        <>
          <View style={styles.container}>
            <Text>Binky's Walks</Text>
            {this.state.walkOn === true ? <Button title="Finish Walk" onPress={this.toggleWalkStatus}></Button> :
            <Button title="Start Walk" onPress={this.toggleWalkStatus}></Button> }
            {this.state.walkOn && <View>
                <Button title="Record Pee" onPress={this.recordPee}></Button>
                <Button title="Record Poop" onPress={this.recordPoop}></Button>
              </View>}
          </View>

          {this.state.recentWalks.length !== 0 ? 
          <View style={styles.container}>
            <Text>Last Walk</Text>
            {this.state.recentWalks.slice(0,1).map(walk => 
                <Text key={walk.id}> 
                  Start Time: {this.turnStringIntoTime(walk.start_time)}{"\n"}
                  Finish Time: {this.turnStringIntoTime(walk.finish_time)}{"\n"}
                  Walk Duration: {this.getWalkDuration(walk.start_time, walk.finish_time)} min {"\n"}
                  No of pees: {walk.pee}{"\n"}
                  No of poops: {walk.poop}
                </Text> 
                )
            }
          </View> : <View style={styles.container}><Text>No Recent Walk History</Text></View>
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

  export default Walk