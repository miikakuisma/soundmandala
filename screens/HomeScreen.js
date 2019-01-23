import React from 'react'
import { ScrollView, Image, Slider, StyleSheet, Text, View, WebView } from 'react-native'
import { LinearGradient, Haptic, WebBrowser, KeepAwake } from 'expo'
import Swiper from 'react-native-swiper'

import { getiOSNotificationPermission, listenForNotifications, createNotification, cancelNotification } from '../components/Notifications'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText, BoldText } from '../components/StyledText'

import { BreakTimer } from '../components/BreakTimer'
import { Chimes, playChimes, endChimes } from '../components/Chimes'
import { Shaman, playShaman, endShaman } from '../components/Shaman'
import { Eggs, playEggs, endEggs } from '../components/Eggs'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      pauseDuration: 1,
      pauseActive: false,
      timerValue: null,
      mode: 0 // 0 = chimes | 1 = shaman | 2 = eggs
    }
  }

  componentDidMount () {
    getiOSNotificationPermission()
    listenForNotifications()
  }

  startPause () {
    this.props.navigation.pop('Settings')
    this.setState({ pauseActive: true })
    KeepAwake.activate()
    createNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    this.endSequence()
    KeepAwake.deactivate()
    cancelNotification()
  }

  completedPause () {
    this.setState({ pauseActive: false })
    this.endSequence()
    KeepAwake.deactivate()
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
    Haptic.selection()
  }

  onTimerUpdate (value) {
    this.setState({ timerValue: value })
    this.playSequence()
  }

  playSequence () {
    switch (this.state.mode) {
      case 0:
        playChimes()
        break
      case 1:
        playShaman()
        break
      case 2:
        playEggs()
        break
    }
  }

  endSequence () {
    switch (this.state.mode) {
      case 0:
        endChimes()
        break
      case 1:
        endShaman()
        break
      case 2:
        endEggs()
        break
    }
  }

  onModeChange (index) {
    this.setState({ mode: index })
  }

  render() {
    var date = new Date(null)
    date.setSeconds(this.state.timerValue)
    const timeLeft = date.toISOString().substr(11, 8)
    // const percentLeft = 100 - Math.floor(100/(this.state.pauseDuration * 60) * this.state.timerValue)
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.blue, Colors.beige, Colors.orangeLight]} style={{width: '100%', height: '100%'}}>
          <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Swiper
              style={styles.swiper}
              loop={false}
              scrollEnabled={!this.state.pauseActive}
              showsPagination={!this.state.pauseActive}
              activeDotColor='#fff'
              paginationStyle={styles.dots}
              onIndexChanged={(index) => this.onModeChange(index)}
            >
              <View style={styles.modeView}>
                <Image
                  style={styles.modeImage}
                  // Photo by Suresh Kumar
                  source={require('../assets/images/suresh-kumar-155029-unsplash.jpg')}
                />
                <Chimes />
              </View>
              <View style={styles.modeView}> 
                <Image
                  style={styles.modeImage}
                  // Photo by Paul Zoetemeijer
                  source={require('../assets/images/paul-zoetemeijer-728643-unsplash.jpg')}
                />
                <Shaman />
              </View>
              <View style={styles.modeView}> 
                <Image
                  style={styles.modeImage}
                  // Photo by Photo by Joseph Gonzalez
                  source={require('../assets/images/joseph-gonzalez-176749-unsplash.jpg')}
                />
                <Eggs />
              </View>
            </Swiper>
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
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  swiper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dots: {
    position: 'absolute',
    bottom: 230
  },
  pageContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 30
  },
  modeView: {
    alignItems: 'center'
  },
  modeImage: {
    width: Layout.window.width,
    height: Layout.window.height,
    resizeMode: 'cover'
  },
  timerContainer: {
    position: 'absolute',
    width: Layout.window.width,
    height: 200,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    paddingTop: 20
  },
  duration: {
    color: Colors.white
  },
  titleText: {
    color: Colors.white,
    fontSize: 32,
    textAlign: 'center'
  },
  slider: {
    width: '80%'
  },
})
