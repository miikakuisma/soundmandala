import React from 'react'
import { StyleSheet, View, Image, Animated } from 'react-native'
import Layout from '../constants/Layout'

const timerImages = [
  require('../assets/timer-images/1.png'),
  require('../assets/timer-images/2.png'),
  require('../assets/timer-images/3.png'),
  require('../assets/timer-images/4.png'),
  require('../assets/timer-images/5.png'),
  require('../assets/timer-images/6.png'),
  require('../assets/timer-images/7.png'),
  require('../assets/timer-images/8.png'),
  require('../assets/timer-images/9.png'),
  require('../assets/timer-images/10.png'),
  require('../assets/timer-images/11.png'),
  require('../assets/timer-images/12.png'),
  require('../assets/timer-images/13.png'),
  require('../assets/timer-images/14.png'),
  require('../assets/timer-images/15.png'),
  require('../assets/timer-images/16.png'),
  require('../assets/timer-images/17.png'),
  require('../assets/timer-images/18.png'),
  require('../assets/timer-images/19.png'),
  require('../assets/timer-images/20.png'),
  require('../assets/timer-images/21.png'),
  require('../assets/timer-images/22.png'),
  require('../assets/timer-images/23.png'),
  require('../assets/timer-images/24.png'),
  require('../assets/timer-images/25.png'),
  require('../assets/timer-images/26.png'),
  require('../assets/timer-images/27.png'),
  require('../assets/timer-images/28.png'),
  require('../assets/timer-images/29.png'),
  require('../assets/timer-images/30.png')
]

export class TimerDisplay extends React.Component {
  state = {
    rotateAnim: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.loop(
      Animated.timing(
        this.state.rotateAnim, {
          toValue: 1,
          duration: 60 * 1000,
        }
      ),
      {
        iterations: -1 // this.props.duration
      }
    ).start()
  }

  getTimerImage (value) {
    return timerImages[value - 1]
  }

  render () {
    const clockwise = this.state.rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const countercw = this.state.rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg']
    })
    return (
      <View style={styles.view}>
        <Animated.Image
          style={{...styles.timerImage, transform: [{ rotate: clockwise }] }}
          source={this.getTimerImage(this.props.value)}
        />
        <Animated.Image
          style={{...styles.timerImage, transform: [{ rotate: countercw }] }}
          source={this.getTimerImage(this.props.value)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    bottom: 280,
    flex: 1,
    width: Layout.window.width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  timerImage: {
    position: 'absolute',
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
