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
} from 'react-native';
import { WebBrowser, Notifications, Permissions } from 'expo'
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { MonoText, RegularText, BoldText } from '../components/StyledText'
import { BreakTimer } from '../components/BreakTimer'

async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

let notificationID

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
    this.listenForNotifications()
  }

  listenForNotifications () {
    Notifications.addListener(notification => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        // Alert.alert('Notification was triggered')
        // console.log(notification)
      }
    })
  }

  startPause () {
    this.setState({ pauseActive: true })
    this.createNotification(this.state.pauseDuration)
  }

  cancelPause () {
    this.setState({ pauseActive: false })
    this.cancelNotification()
  }

  completedPause () {
    this.setState({ pauseActive: false })
    // this.props.navigation.push('Links')
    this.props.navigation.navigate('Links')
  }

  updateDuration (value) {
    this.setState({ pauseDuration: value })
  }

  onTimerUpdate (value) {
    this.setState({ timerValue: value })
  }

  createNotification (minutes) {
    const localNotification = {
      title: 'Pauseground',
      body: 'Time for little break?',
      data: {
        somekey: 'some value'
      },
      android: {
        sound: true
      },
      ios: {
        sound: true
      }
    }
    let sendAfter = Date.now()
    sendAfter += minutes * 1000 * 60

    const schedulingOptions = { time: sendAfter }
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions
    ).then((response) => {
      notificationID = response
    })
  }

  cancelNotification () {
    Notifications.cancelScheduledNotificationAsync(notificationID)
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/background.jpg')} style={{width: '100%', height: '100%'}}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View styles={styles.timerView}>
              <Text style={styles.timeLeft}>{this.state.timerValue}</Text>
            </View>
            <View style={styles.welcomeContainer}>
              {/*<TouchableOpacity onPress={this._handlePressLogo}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.welcomeImage}
                />
              </TouchableOpacity>*/}
              <BoldText style={styles.titleText}>Pause</BoldText>
              <RegularText style={styles.duration}>{this.state.pauseDuration} minutes</RegularText>
              <Slider
                style={styles.slider}
                disabled={this.state.pauseActive}
                minimumValue={1}
                maximumValue={5}
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
