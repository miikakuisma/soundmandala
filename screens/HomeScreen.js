import React from 'react'
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView
} from 'react-native'
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import {
  getiOSNotificationPermission,
  listenForNotifications,
  createNotification,
  cancelNotification
} from '../components/Notifications'
// import { setupAudio, play, playRandom, playSequence } from '../components/Chimes'
import { LinearGradient, Haptic, WebBrowser } from 'expo'
import { RegularText, BoldText } from '../components/StyledText'
import { BreakTimer } from '../components/BreakTimer'

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
    // setupAudio()
  }

  startPause () {
    this.setState({ pauseActive: true })
    createNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    cancelNotification()
  }

  completedPause () {
    play('eight_be')
    this.setState({ pauseActive: false })
    // this.props.navigation.push('Links')
    // this.props.navigation.navigate('Links')
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
    Haptic.selection()
  }

  onTimerUpdate (value) {
    this.setState({ timerValue: value })
    // Play with Expo
    // playSequence()
    // Play with Web Audio API
    this.webViewRef.postMessage('PLAY_SEQUENCE')
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
              <Text style={styles.timeLeft}></Text>
              <WebView
                ref={(ref) => { this.webViewRef = ref }}
                source={require('../assets/webaudio/chimes.html')}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}

              />
            </View>
            <View style={styles.timerContainer}>
              {/*<TouchableOpacity onPress={this._handlePressLogo}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.welcomeImage}
                />
              </TouchableOpacity>*/}
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

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    )
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
  timeLeft: {
    color: Colors.white,
    height: Layout.window.height / 2,
    paddingTop: '50%',
    fontSize: 84,
    alignItems: 'center',
    textAlign: 'center'
  },
  timerContainer: {
    height: (Layout.window.height / 2) - 80,
    paddingTop: '20%',
    alignItems: 'center'
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  duration: {
    color: Colors.black
  },
  slider: {
    width: '80%'
  }
})
