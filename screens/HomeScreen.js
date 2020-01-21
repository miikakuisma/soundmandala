import React from 'react'
import { Image, TouchableOpacity, ImageBackground, StyleSheet, View, AsyncStorage } from 'react-native'
import * as Haptic from 'expo-haptics';
import Carousel from 'react-native-snap-carousel'
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { RegularText } from '../components/utils'
import { themes, playSequence, endSequence } from '../themes' // Array of theme config
import { BreakTimer } from '../components/BreakTimer'


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      onboarded: null, // Has user seen instructions to swipe themes
      storedIndex: null, // the first slide to show on carousel
      pauseDuration: 3, // timer value in minutes
      pauseActive: false, // is timer running
      mode: 0 // 0 = chimes | 1 = shaman etc
    }
  }

  async componentDidMount () {
    this.setState({
      onboarded: await AsyncStorage.getItem('onboarded'),
      mode: parseInt(await AsyncStorage.getItem('mode')) || 0,
      storedIndex: parseInt(await AsyncStorage.getItem('mode')) || 0,
      pauseDuration: parseInt(await AsyncStorage.getItem('pauseDuration')) || 3,
    })
  }

  startPause () {
    this.setState({ pauseActive: true })
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    endSequence(this.state.mode)
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
    Haptic.selection()
  }

  onTimerUpdate (value) {
    playSequence(this.state.mode)
  }

  async onModeChange (index) {
    this.setState({ mode: index })
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

  render() {
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
                  {themes[this.state.mode].title}
                </RegularText>
                <BreakTimer
                  autorun={false}
                  onStart={this.startPause.bind(this)}
                  onUpdate={this.onTimerUpdate.bind(this)}
                  onCancel={this.cancelPause.bind(this)}
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
    height: 180,
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
