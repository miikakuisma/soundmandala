import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { WebBrowser, Notifications, Permissions } from 'expo'
import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import { MonoText, BoldText } from '../components/StyledText'
import { BreakTimer } from '../components/BreakTimer'

async function getiOSNotificationPermission () {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount () {
    getiOSNotificationPermission()
    this.listenForNotifications()
  }

  listenForNotifications () {
    Notifications.addListener(notification => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        Alert.alert('Notification was triggered')
        console.log(notification)
      }
    })
  }

  createNotification (seconds) {
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
    sendAfter += seconds * 1000

    const schedulingOptions = { time: sendAfter }
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions
    )

    // Notifications.presentLocalNotificationAsync(localnotification)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <BoldText style={styles.logoText}>Pauseground</BoldText>
            <TouchableOpacity onPress={this._handlePressLogo}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.welcomeImage}
              />
            </TouchableOpacity>
            <BreakTimer
              duration={10}
              autorun={false}
              onStart={this.createNotification}
              onCompleted={this._handlePressLogo}
            />
          </View>

          <View>
          </View>

        </ScrollView>
      </View>
    );
  }

  _handlePressLogo = () => {
    // this.props.navigation.push('Links')
    this.props.navigation.navigate('Links')
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
    backgroundColor: Colors.blue
  },
  logoText: {
    color: Colors.white,
    fontSize: 32,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    position: 'absolute',
    top: Layout.window.height / 3,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
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
