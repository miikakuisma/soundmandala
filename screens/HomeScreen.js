import React from 'react'
import { ScrollView, Slider, StyleSheet, Text, View, WebView } from 'react-native'
import { LinearGradient, Haptic, WebBrowser, KeepAwake } from 'expo'

import { getiOSNotificationPermission, listenForNotifications, createNotification, cancelNotification } from '../components/Notifications'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText, BoldText } from '../components/StyledText'

import { BreakTimer } from '../components/BreakTimer'
import { Chimes, playSequence } from '../components/Chimes'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      pauseDuration: 1,
      pauseActive: false,
      timerValue: null
    }
  }

  componentDidMount () {
    getiOSNotificationPermission()
    listenForNotifications()
  }

  startPause () {
    this.setState({ pauseActive: true })
    KeepAwake.activate()
    createNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    KeepAwake.deactivate()
    cancelNotification()
  }

  completedPause () {
    this.setState({ pauseActive: false })
    KeepAwake.deactivate()
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
    Haptic.selection()
  }

  onTimerUpdate (value) {
    this.setState({ timerValue: value })
    playSequence()
  }

  render() {
    var date = new Date(null)
    date.setSeconds(this.state.timerValue)
    const timeLeft = date.toISOString().substr(11, 8)
    // const percentLeft = 100 - Math.floor(100/(this.state.pauseDuration * 60) * this.state.timerValue)
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.blue, Colors.beige, Colors.orangeLight]} style={{width: '100%', height: '100%'}}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View styles={styles.timerView}>
              <Chimes />
            </View>
            <View style={styles.timerContainer}>
              <RegularText style={styles.duration}>
                {this.state.pauseActive ? 'Time left' : 'Pause Duration'}
              </RegularText>
              <BoldText style={styles.titleText}>
                 {this.state.pauseActive ? timeLeft : this.state.pauseDuration + ' minutes'}
              </BoldText>
              <Slider
                style={styles.slider}
                disabled={this.state.pauseActive}
                minimumValue={1}
                maximumValue={20}
                step={1}
                onValueChange={this.updateDuration.bind(this)}
              />
              <BreakTimer
                duration={this.state.pauseDuration}
                autorun={false}
                onStart={this.startPause.bind(this)}
                onUpdate={this.onTimerUpdate.bind(this)}
                onCancel={this.cancelPause.bind(this)}
                onCompleted={this.completedPause.bind(this)}
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    color: Colors.black,
    fontSize: 32,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
  },
  timerView: {
    flex: 1
  },
  timerContainer: {
    height: (Layout.window.height / 2) - 80,
    paddingTop: '20%',
    alignItems: 'center'
  },
  duration: {
    color: Colors.black
  },
  slider: {
    width: '80%'
  }
})
