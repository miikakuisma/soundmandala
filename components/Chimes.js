import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const chimes = [
  {
    name: 'one',
    sound: require('../assets/audio/1_a.m4a')
  },
  {
    name: 'two',
    sound: require('../assets/audio/2_c.m4a')
  },
  {
    name: 'three',
    sound: require('../assets/audio/3_e.m4a')
  },
  {
    name: 'four',
    sound: require('../assets/audio/4_a.m4a')
  },
  {
    name: 'five',
    sound: require('../assets/audio/5_b.m4a')
  },
  {
    name: 'six',
    sound: require('../assets/audio/6_c.m4a')
  },
  {
    name: 'seven',
    sound: require('../assets/audio/7_e.m4a')
  },
  {
    name: 'eight',
    sound: require('../assets/audio/8_b.m4a')
  }
]

let audio = {}

export async function setupAudio () {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })

  chimes.map(async chime => {
    const { sound } = await Audio.Sound.createAsync(chime.sound)
    await sound.setStatusAsync({
      volume: getRandom(0.5, 1)
    })
    audio[chime.name] = async () => {
      try {
        await sound.setPositionAsync(0)
        await sound.playAsync()
      } catch (error) {
        console.warn('sound error', { error })
        // An error occurred!
      }
    }
  })
}

export function play (name) {
  audio[name]()
}

function getRandom (min, max, rounded) {
  if (rounded) {
    return Math.round(min + Math.random() * (max - min))
  } else {
    return min + Math.random() * (max - min)
  }
}

let current = 0
let last = 0

export function playRandom () {
  const skip = getRandom(0, 1) === 1
  current = current + getRandom(1, 3, true)
  const randomDelay = getRandom(50, 950, true)
  setTimeout(() => {
    if (current <= 6 && current !== last && !skip) {
      audio[chimes[current].name]()
      last = current
    } else {
      current = 0
    }
  }, randomDelay)
}

export class Chimes extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    setupAudio()
  }

  render () {
    return <View style={styles.chimesView}>
      <View style={styles.side}>
        <Button onPress={play.bind(this, 'one')} title='1' />
        <Button onPress={play.bind(this, 'eight')} title='8' />
      </View>
      <View style={styles.middle}>
        <Button onPress={play.bind(this, 'two')} title='2' />
        <Button onPress={play.bind(this, 'seven')} title='7' />
      </View>
      <View style={styles.middle}>
        <Button onPress={play.bind(this, 'three')} title='3' />
        <Button onPress={play.bind(this, 'six')} title='6' />
      </View>
      <View style={styles.side}>
        <Button onPress={play.bind(this, 'four')} title='4' />
        <Button onPress={play.bind(this, 'five')} title='5' />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  chimesView: {
    flex: 1,
    width: '60%',
    left: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.white,
    height: Layout.window.height / 2,
    paddingTop: '50%',
    fontSize: 84,
    alignItems: 'center'
    // textAlign: 'center'
  },
  side: {
    height: 120,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  middle: {
    height: 330,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
})
