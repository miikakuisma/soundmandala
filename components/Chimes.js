import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const chimes = [
  {
    name: 'one_a',
    sound: require('../assets/audio/1_a.m4a')
  },
  {
    name: 'one_ab',
    sound: require('../assets/audio/1_ab.m4a')
  },
  {
    name: 'one_ac',
    sound: require('../assets/audio/1_ac.m4a')
  },
  {
    name: 'two_c',
    sound: require('../assets/audio/2_c.m4a')
  },
  {
    name: 'two_ca',
    sound: require('../assets/audio/2_ca.m4a')
  },
  {
    name: 'two_ce',
    sound: require('../assets/audio/2_ce.m4a')
  },
  {
    name: 'three_e',
    sound: require('../assets/audio/3_e.m4a')
  },
  {
    name: 'three_ea',
    sound: require('../assets/audio/3_ea.m4a')
  },
  {
    name: 'three_ec',
    sound: require('../assets/audio/3_ec.m4a')
  },
  {
    name: 'four_a',
    sound: require('../assets/audio/4_a.m4a')
  },
  {
    name: 'four_ab',
    sound: require('../assets/audio/4_ab.m4a')
  },
  {
    name: 'four_ae',
    sound: require('../assets/audio/4_ae.m4a')
  },
  {
    name: 'five_b',
    sound: require('../assets/audio/5_b.m4a')
  },
  {
    name: 'five_ba',
    sound: require('../assets/audio/5_ba.m4a')
  },
  {
    name: 'five_bc',
    sound: require('../assets/audio/5_bc.m4a')
  },
  {
    name: 'six_c',
    sound: require('../assets/audio/6_c.m4a')
  },
  {
    name: 'six_cb',
    sound: require('../assets/audio/6_cb.m4a')
  },
  {
    name: 'six_ce',
    sound: require('../assets/audio/6_ce.m4a')
  },
  {
    name: 'seven_e',
    sound: require('../assets/audio/7_e.m4a')
  },
  {
    name: 'seven_eb',
    sound: require('../assets/audio/7_eb.m4a')
  },
  {
    name: 'seven_ec',
    sound: require('../assets/audio/7_ec.m4a')
  },
  {
    name: 'eight_b',
    sound: require('../assets/audio/8_b.m4a')
  },
  {
    name: 'eight_ba',
    sound: require('../assets/audio/8_ba.m4a')
  },
  {
    name: 'eight_be',
    sound: require('../assets/audio/8_be.m4a')
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
let cycles = 0

let playStyle = 'ascending' // ascending | descending | random
let randomness = true
let howManyCycles = 2 // how many cycles until direction changes
let wind = 30 // 0 - 100 (0 = no skipping at all, 100 = skip all)
let speed = 7 // how much to ascend or descent at one step

export function playRandom () {
  const skip = getRandom(0, 100) < wind
  if (skip) {
    return
  }
  switch (playStyle) {
    case 'ascending':
      current = current + randomness ? getRandom(1, speed, true) : speed
      if (current > 23) {
        current = 0
        cycles++
        if (cycles === howManyCycles) {
          playStyle = 'descending'
          cycles = 0
        }
      }
      break
    case 'descending':
      current = current - randomness ? getRandom(1, speed, true) : speed
      if (current < 0) {
        current = 23
        cycles++
        if (cycles === howManyCycles) {
          playStyle = 'ascending'
          cycles = 0
        }
      }
      break
    case 'random':
      current = getRandom(1, 23, true)
      break
  }
  if (!skip && current !== last) {
    // Play with style
    setTimeout(() => {
      audio[chimes[current].name]()
      last = current
    }, getRandom(10, 900, true))
    // and one random too
    if (getRandom(0, 100) < wind) {
      setTimeout(() => {
        let more = getRandom(0, 11, true)
        if (more !== last) {
          audio[chimes[more].name]()
        }
      }, getRandom(300, 600, true))
    }
    // third one!
    if (getRandom(0, 100) < wind) {
      setTimeout(() => {
        let more = getRandom(11, 20, true)
        if (more !== last) {
          audio[chimes[more].name]()
        }
      }, getRandom(600, 900, true))
    }
  }
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
