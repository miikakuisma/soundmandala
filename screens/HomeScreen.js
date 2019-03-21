import React from 'react'
import { ScrollView, Image, Slider, StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { LinearGradient, Haptic, WebBrowser, KeepAwake, Video } from 'expo'
import Swiper from 'react-native-swiper'
import {
  getiOSNotificationPermission,
  listenForNotifications,
  createTimerEndNotification,
  cancelTimerEndNotification
} from '../components/Notifications'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText, BoldText } from '../components/StyledText'
import { MaterialIcons } from '@expo/vector-icons'

import { BreakTimer } from '../components/BreakTimer'
import { Chimes, playChimes, endChimes } from '../components/Chimes'
import { Shaman, playShaman, endShaman } from '../components/Shaman'
import { Coffee, playCoffee, endCoffee } from '../components/Coffee'
import { Cosmic, playCosmic, endCosmic} from '../components/Cosmic'
import { Withyou, playWithyou, endWithyou } from '../components/Withyou'
import { Beatless, playBeatless, endBeatless } from '../components/Beatless'
import { OneTwoEight, play128, end128 } from '../components/OneTwoEight'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      pauseDuration: 3,
      pauseActive: false,
      timerValue: null,
      mode: 0 // 0 = chimes | 1 = shaman etc
    }
  }

  async componentDidMount () {
    getiOSNotificationPermission()
    listenForNotifications()
    // AsyncStorage.clear()
    this.setState({
      storedIndex: parseInt(await AsyncStorage.getItem('mode')),
      pauseDuration: parseInt(await AsyncStorage.getItem('pauseDuration')) || 3
    })
  }

  startPause () {
    this.setState({ pauseActive: true })
    KeepAwake.activate()
    createTimerEndNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    this.endSequence()
    KeepAwake.deactivate()
    cancelTimerEndNotification()
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
        playShaman()
        break
      case 1:
        playChimes()
        break
      case 2:
        playCoffee()
        break
      case 3:
        play128()
        break
      case 4:
        playWithyou()
        break
      case 5:
        playCosmic()
        break
      case 6:
        playBeatless()
        break
    }
  }

  endSequence () {
    switch (this.state.mode) {
      case 0:
        endShaman()
        break
      case 1:
        endChimes()
        break
      case 2:
        endCoffee()
        break
      case 3:
        end128()
        break
      case 4:
        endWithyou()
        break
      case 5:
        endCosmic()
        break
      case 6:
        endBeatless()
        break
    }
  }

  async onModeChange (index) {
    this.setState({ mode: index })
    try {
      await AsyncStorage.setItem('mode', index.toString())
    } catch (error) {
      // Error saving data
    } 
  }

  getText (index) {
    switch (index) {
      case 0:
        return 'Shaman Drumming'
      case 1:
        return 'Wind Chimes'
      case 2:
        return '"Dripping Arpeggio"' // coffee
      case 3:
        return '"Dissolving Sadness"' // 128
      case 4:
        return '"Healing Loneliness"' // with you
      case 5:
        return '"Cosmic Broadcast"' // peruvian
      case 6:
        return '"Distant Shores"' // beatless
    }
  }

  render() {
    console.log(this.state.storedIndex)
    var date = new Date(null)
    date.setSeconds(this.state.timerValue)
    const timeLeft = date.toISOString().substr(11, 8)
    const minutesLeft = parseInt(date.toISOString().substr(14, 2))
    // const percentLeft = 100 - Math.floor(100/(this.state.pauseDuration * 60) * this.state.timerValue)
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.blue, Colors.beige, Colors.orangeLight]} style={{width: '100%', height: '100%'}}>
          <View style={styles.container} contentContainerStyle={styles.contentContainer}>
            { this.state.storedIndex && <Swiper
              style={styles.swiper}
              loop={false}
              index={this.state.storedIndex}
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
                  // Shaman
                  // Photo by Paul Zoetemeijer
                  style={styles.modeImage}
                  source={require('../assets/images/shaman.jpg')}
                />
                <Shaman />
              </View>
              <View style={styles.modeView}>
                <Image
                  // Chimes
                  // Photo by Suresh Kumar
                  style={styles.modeImage}
                  source={require('../assets/images/chimes.jpg')}
                />
                <Chimes />
              </View>
              <View style={styles.modeView}>
                <Image
                  // Coffee
                  // Photo by Nathan Dumlao
                  style={styles.modeImage}
                  source={require('../assets/images/coffee.jpg')}
                />
                <Coffee />
              </View>
              <View style={styles.modeView}>
                <Image
                  // 128
                  // Photo by 
                  style={styles.modeImage}
                  source={require('../assets/images/128.jpg')}
                />
                <OneTwoEight />
              </View>
              <View style={styles.modeView}>
                <Image
                  // Withyou
                  // Photo by Tylex Nix
                  style={styles.modeImage}
                  source={require('../assets/images/withyou.jpg')}
                />
                <Withyou />
              </View>
              <View style={styles.modeView}>
                <Image
                  // Cosmic
                  // Photo by James Kresser
                  style={styles.modeImage}
                  source={require('../assets/images/cosmic.jpg')}
                />
                <Cosmic />
              </View>
              <View style={styles.modeView}>
                <Image
                  // Beatless
                  // Photo by 
                  style={styles.modeImage}
                  source={require('../assets/images/beatless.jpg')}
                />
                <Beatless />
              </View>
            </Swiper> }
            <View style={styles.timerContainer}>
              <RegularText style={styles.duration}>
                {this.state.pauseActive ? 'Close Your Eyes?' : this.getText(this.state.mode)}
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
                  try {
                    await AsyncStorage.setItem('pauseDuration', this.state.pauseDuration.toString());
                  } catch (error) {
                    // Error saving data
                  }
                }}
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
