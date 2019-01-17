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
} from 'react-native'
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import {
  getiOSNotificationPermission,
  listenForNotifications,
  createNotification,
  cancelNotification
} from '../components/Notifications'
import { setupAudio, play, playRandom } from '../components/Chimes'
import { Haptic, WebBrowser } from 'expo'
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
    setupAudio()
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
    playRandom()
  }

  render() {
    const percentLeft = Math.floor(100/(this.state.pauseDuration * 60) * this.state.timerValue)
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/background.jpg')} style={{width: '100%', height: '100%'}}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View styles={styles.timerView}>
              <Text style={styles.timeLeft}>{percentLeft}</Text>
            </View>
            <View style={styles.welcomeContainer}>
              {/*<TouchableOpacity onPress={this._handlePressLogo}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.welcomeImage}
                />
              </TouchableOpacity>*/}
              <RegularText style={styles.duration}>Pause Duration</RegularText>
              <BoldText style={styles.titleText}>{this.state.pauseDuration} minutes</BoldText>
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
        </ImageBackground>
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
  welcomeContainer: {
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
  },
  // codeHighlightContainer: {
  //   backgroundColor: 'rgba(0,0,0,0.05)',
  //   borderRadius: 3,
  //   paddingHorizontal: 4,
  // },
  // getStartedText: {
  //   fontSize: 17,
  //   color: 'rgba(96,100,109, 1)',
  //   lineHeight: 24,
  //   textAlign: 'center',
  // },
  // tabBarInfoContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: 'black',
  //       shadowOffset: { height: -3 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 3,
  //     },
  //     android: {
  //       elevation: 20,
  //     },
  //   }),
  //   alignItems: 'center',
  //   backgroundColor: '#fbfbfb',
  //   paddingVertical: 20,
  // },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  }
})
