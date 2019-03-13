import React from 'react'
import { ScrollView, Image, Slider, StyleSheet, Text, View, WebView } from 'react-native'
import { LinearGradient, Haptic, WebBrowser, KeepAwake, Video } from 'expo'
import Swiper from 'react-native-swiper'

import { getiOSNotificationPermission, listenForNotifications, createNotification, cancelNotification } from '../components/Notifications'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText, BoldText } from '../components/StyledText'
import { MaterialIcons } from '@expo/vector-icons'

import { BreakTimer } from '../components/BreakTimer'
import { Chimes, playChimes, endChimes } from '../components/Chimes'
import { Shaman, playShaman, endShaman } from '../components/Shaman'
import { Coffee, playCoffee, endCoffee } from '../components/Coffee'
import { Peruvian, playPeruvian, endPeruvian} from '../components/Peruvian'
import { Golden, playGolden, endGolden} from '../components/Golden'

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
        playCoffee()
        break
      case 3:
        playCosmic()
        break
      case 4:
        playPeruvian()
        break
      case 5:
        playGolden()
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
        endCoffee()
        break
      case 3:
        endCosmic()
        break
      case 4:
        endPeruvian()
        break
      case 5:
        endGolden()
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
              showsButtons={!this.state.pauseActive}
              prevButton={<MaterialIcons name="chevron-left" size={32} color="white" />}
              nextButton={<MaterialIcons name="chevron-right" size={32} color="white" />}
              scrollEnabled={!this.state.pauseActive}
              showsPagination={!this.state.pauseActive}
              activeDotColor='#fff'
              paginationStyle={styles.dots}
              onIndexChanged={(index) => this.onModeChange(index)}
            >
              <View style={styles.modeView}>
                <Image
                  // Chimes
                  // Photo by Suresh Kumar
                  style={styles.modeImage}
                  source={require('../assets/images/suresh-kumar-155029-unsplash.jpg')}
                />
                <Chimes />
              </View>
              <View style={styles.modeView}> 
                <Image
                  // Shaman
                  // Photo by Paul Zoetemeijer
                  style={styles.modeImage}
                  source={require('../assets/images/paul-zoetemeijer-728643-unsplash.jpg')}
                />
                <Shaman />
              </View>
              <View style={styles.modeView}> 
                <Image
                  // Coffee
                  // Photo by Nathan Dumlao
                  style={styles.modeImage}
                  source={require('../assets/images/nathan-dumlao-287719-unsplash.jpg')}
                />
                <Coffee />
              </View>
              <View style={styles.modeView}> 
                <Image
                  // Cosmic
                  // Photo by James Kresser
                  style={styles.modeImage}
                  source={require('../assets/images/james-kresser-790158-unsplash.jpg')}
                />
              </View>
              <View style={styles.modeView}>
                <Video
                  // Electric Sun
                  source={require('../assets/video/ElectricSun.mp4')}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  shouldPlay={this.state.pauseActive}
                  isLooping
                  resizeMode='cover'
                  style={styles.modeVideo}
                />
                <Peruvian />
              </View>
              <View style={styles.modeView}>
                <Video
                  // Golden Era
                  source={require('../assets/video/GoldenEra.mp4')}
                  rate={1.0}
                  volume={1.0}
                  isMuted={true}
                  shouldPlay={this.state.pauseActive}
                  isLooping
                  resizeMode='cover'
                  style={styles.modeVideo}
                />
                <Golden />
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
    alignItems: 'center'
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
    color: Colors.white
  },
  titleText: {
    color: Colors.white,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10
  },
  slider: {
    width: '80%'
  },
})
