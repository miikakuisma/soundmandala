import React from 'react'
import { ScrollView, Image, TouchableOpacity, ImageBackground, Slider, Switch, StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { LinearGradient, Haptic, WebBrowser, KeepAwake, Video } from 'expo'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import {
  getiOSNotificationPermission,
  listenForNotifications,
  createTimerEndNotification,
  cancelTimerEndNotification
} from '../components/Notifications'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText, BoldText } from '../components/utils'
import Settings from '../components/Settings'
import { MaterialIcons } from '@expo/vector-icons'
import { themes, playSequence, endSequence } from '../themes' // Array of theme config
import { BreakTimer } from '../components/BreakTimer'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      onboarded: null,
      settingsVisible: false,
      reminderEnabled: true,
      reminderAfter: 45,
      storedIndex: null, // the first slide to show on carousel
      pauseDuration: 3, // minutes
      pauseActive: false, // is timer running
      timerValue: null, // value in the timer right now
      mode: 0 // 0 = chimes | 1 = shaman etc
    }
  }

  async componentDidMount () {
    getiOSNotificationPermission()
    listenForNotifications()
    this.handleVersionChange()
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      mode: parseInt(await AsyncStorage.getItem('mode')) || 0,
      storedIndex: parseInt(await AsyncStorage.getItem('mode')) || 0,
      pauseDuration: parseInt(await AsyncStorage.getItem('pauseDuration')) || 3,
      reminderEnabled: await AsyncStorage.getItem('reminderEnabled') === 'true',
      reminderAfter: parseInt(await AsyncStorage.getItem('reminderAfter')) || 45,
    })
  }

  handleVersionChange () {
    let pkg = require('../app.json')
    console.log('App version: ', pkg.expo.version)
    // if (pkg.expo.version <= '1.0.5') {
    //   AsyncStorage.clear()
    // }
  }

  startPause () {
    this.setState({ pauseActive: true })
    KeepAwake.activate()
    createTimerEndNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    endSequence(this.state.mode)
    KeepAwake.deactivate()
    cancelTimerEndNotification()
  }

  completedPause () {
    this.setState({ pauseActive: false })
    endSequence(this.state.mode)
    KeepAwake.deactivate()
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
    Haptic.selection()
  }

  onTimerUpdate (value) {
    this.setState({ timerValue: value })
    playSequence(this.state.mode)
  }

  async onModeChange (index) {
    this.setState({ mode: index })
    // Store the value to be recalled next time
    try {
      await AsyncStorage.setItem('mode', index.toString())
    } catch (error) {
      // Error saving data
    } 
  }

  renderItem ({item, index}) {
    return <View style={styles.modeView}>
      <Image style={styles.modeImage} source={item.image} />
      {item.player}
    </View>
  }

  async onboardingDone () {
    this.setState({ onboarded: 'done' })
    try {
      await AsyncStorage.setItem('onboarded', 'done')
    } catch (error) {
      // Error saving data
    }
  }

  toggleSettings () {
    this.setState({ settingsVisible: !this.state.settingsVisible })
  }

  async toggleReminders () {
    try {
      if (!this.state.reminderEnabled) {
        // console.log('setting reminder to: true')
        this.setState({ reminderEnabled: true })
        await AsyncStorage.setItem('reminderEnabled', 'true')
      } else {
        // console.log('setting reminder to: false')
        this.setState({ reminderEnabled: false })
        await AsyncStorage.setItem('reminderEnabled', 'false')
      }
    } catch (error) {
      // Error saving data
    }
  }

  async updateReminderValue (value) {
    console.log(value)
    try {
      if (!this.state.reminderEnabled) {
        await AsyncStorage.setItem('reminderAfter', value.toString())
      } else {
        await AsyncStorage.setItem('reminderAfter', value.toString())
      }
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    const { reminderEnabled } = this.state
    var date = new Date(null)
    date.setSeconds(this.state.timerValue)
    const timeLeft = date.toISOString().substr(11, 8)
    const minutesLeft = parseInt(date.toISOString().substr(14, 2))
    // const percentLeft = 100 - Math.floor(100/(this.state.pauseDuration * 60) * this.state.timerValue)
    if (this.state.storedIndex !== null) {
      return (
        <View style={styles.container}>
          { this.state.onboarded !== 'done' && <TouchableOpacity
            activeOpacity={0.9}
            style={styles.onboarding}
            onPress={this.onboardingDone.bind(this)}
          >
            <ImageBackground source={require('../assets/images/onboarding.png')} style={styles.onboardingImg} />
          </TouchableOpacity> }
          <TouchableOpacity
            onPress={this.toggleSettings.bind(this)}
            style={styles.settingsButton}
          >
            <MaterialIcons name='settings' size={32} color='#ccc' />
          </TouchableOpacity>
          { this.state.settingsVisible && <Settings
            reminderEnabled={reminderEnabled}
            reminderAfter={this.state.reminderAfter}
            onToggleReminders={this.toggleReminders.bind(this)}
            onUpdateReminderValue={this.updateReminderValue.bind(this)}
          /> }
          <ImageBackground source={require('../assets/images/background.jpg')} style={styles.container}>
            <View style={styles.container} contentContainerStyle={styles.contentContainer}>
              { this.state.pauseActive && <TouchableOpacity style={styles.carouselBlocker} /> }
              <Carousel
                ref={c => this._carousel = c}
                data={themes}
                renderItem={this.renderItem}
                windowSize={1}
                sliderWidth={Layout.window.width}
                itemWidth={Layout.window.width}
                inactiveSlideScale={0.8}
                enableSnap={true}
                useScrollView={true}
                contentContainerCustomStyle={styles.swiper}
                loop={true}
                autoplay={false}
                onSnapToItem={(index) => this.onModeChange(index)}
                firstItem={this.state.storedIndex}
              />
              <View style={styles.timerContainer}>
                <RegularText style={styles.duration}>
                  {this.state.pauseActive ? 'Close Your Eyes?' : themes[this.state.mode].title}
                </RegularText>
                <BoldText style={styles.titleText}>
                 {this.state.pauseActive ? timeLeft : this.state.pauseDuration + ' minutes'}
                </BoldText>
                <Slider
                  style={styles.slider}
                  disabled={this.state.pauseActive}
                  minimumValue={1}
                  maximumValue={30}
                  value={this.state.pauseDuration}
                  step={1}
                  onValueChange={this.updateDuration.bind(this)}
                  onSlidingComplete={async () => {
                    // Store the value to be recalled next time
                    try {
                      await AsyncStorage.setItem('pauseDuration', this.state.pauseDuration.toString())
                    } catch (error) {
                      // Error saving data
                    }
                  }}
                />
                <BreakTimer
                  duration={this.state.pauseDuration}
                  autorun={false}
                  reminderEnabled={this.state.reminderEnabled}
                  reminderAfter={this.state.reminderAfter}
                  onStart={this.startPause.bind(this)}
                  onUpdate={this.onTimerUpdate.bind(this)}
                  onCancel={this.cancelPause.bind(this)}
                  onCompleted={this.completedPause.bind(this)}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      )      
    } else {
      return <Image style={styles.modeImage} source={require('../assets/images/splash.png')} />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  onboarding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3
  },
  onboardingImg: {
    flex: 1
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 9
  },
  swiper: {
    alignItems: 'center'
  },
  carouselBlocker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 250,
    zIndex: 2,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  dots: {
    position: 'absolute',
    bottom: 30
  },
  pageContainer: {
    flex: 1,
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
  title: {
    position: 'absolute',
    width: 100,
    top: 50,
    left: (Layout.window.width / 2) - 50,
    zIndex: 1,
    color: Colors.white,
    padding: 5,
    backgroundColor: Colors.black,
    textAlign: 'center',
    borderRadius: 50
  },
  modeVideo: {
    width: Layout.window.width,
    height: Layout.window.height
  },
  timerContainer: {
    position: 'absolute',
    width: Layout.window.width,
    height: 280,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40
  },
  duration: {
    color: Colors.white,
    paddingTop: 10
  },
  titleText: {
    color: Colors.white,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10
  },
  slider: {
    width: '80%'
  }
})
