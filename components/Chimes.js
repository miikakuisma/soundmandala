import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const chimes = [
  {
    name: 'one_a',
    sound: require('../assets/audio/chimes/1_a.m4a')
  },
  {
    name: 'one_ab',
    sound: require('../assets/audio/chimes/1_ab.m4a')
  },
  {
    name: 'one_ac',
    sound: require('../assets/audio/chimes/1_ac.m4a')
  },
  {
    name: 'two_c',
    sound: require('../assets/audio/chimes/2_c.m4a')
  },
  {
    name: 'two_ca',
    sound: require('../assets/audio/chimes/2_ca.m4a')
  },
  {
    name: 'two_ce',
    sound: require('../assets/audio/chimes/2_ce.m4a')
  },
  {
    name: 'three_e',
    sound: require('../assets/audio/chimes/3_e.m4a')
  },
  {
    name: 'three_ea',
    sound: require('../assets/audio/chimes/3_ea.m4a')
  },
  {
    name: 'three_ec',
    sound: require('../assets/audio/chimes/3_ec.m4a')
  },
  {
    name: 'four_a',
    sound: require('../assets/audio/chimes/4_a.m4a')
  },
  {
    name: 'four_ab',
    sound: require('../assets/audio/chimes/4_ab.m4a')
  },
  {
    name: 'four_ae',
    sound: require('../assets/audio/chimes/4_ae.m4a')
  },
  {
    name: 'five_b',
    sound: require('../assets/audio/chimes/5_b.m4a')
  },
  {
    name: 'five_ba',
    sound: require('../assets/audio/chimes/5_ba.m4a')
  },
  {
    name: 'five_bc',
    sound: require('../assets/audio/chimes/5_bc.m4a')
  },
  {
    name: 'six_c',
    sound: require('../assets/audio/chimes/6_c.m4a')
  },
  {
    name: 'six_cb',
    sound: require('../assets/audio/chimes/6_cb.m4a')
  },
  {
    name: 'six_ce',
    sound: require('../assets/audio/chimes/6_ce.m4a')
  },
  {
    name: 'seven_e',
    sound: require('../assets/audio/chimes/7_e.m4a')
  },
  {
    name: 'seven_eb',
    sound: require('../assets/audio/chimes/7_eb.m4a')
  },
  {
    name: 'seven_ec',
    sound: require('../assets/audio/chimes/7_ec.m4a')
  },
  {
    name: 'eight_b',
    sound: require('../assets/audio/chimes/8_b.m4a')
  },
  {
    name: 'eight_ba',
    sound: require('../assets/audio/chimes/8_ba.m4a')
  },
  {
    name: 'eight_be',
    sound: require('../assets/audio/chimes/8_be.m4a')
  }
]

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
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

export function play (number) {
  triggerSound(number)
}

function getRandom (min, max, rounded) {
  if (rounded) {
    return Math.round(min + Math.random() * (max - min))
  } else {
    return min + Math.random() * (max - min)
  }
}

let wind = 70 // 10 - 100
let offset = 0

// 0, 3, 6, 9, 12, 15, 18, 21
let sequence = [0, 6, 9, 0, 6, 9, 12, 15, 12, 9, 6, 3, 0, 6, 9, 15, 9, 12, 6, 9, 6, 9, 3, 6, 3, 6, 0, 3, 0, 3, 6, 9, 12, 15, 18, 21, 18, 21, 18, 15, 18, 21, 15, 9, 6, 12, 9, 6, 3, 9, 6, 3, 6, 3, 0, 3, 6, 9]

export function playSequence () {
  if (getRandom(30, 100) < wind) {
    triplay(sequence[offset])
    offset++
    if (offset === sequence.length) {
      offset = 0
    }
  }
}

export function playRandom () {
  if (getRandom(0, 100) < wind) {
    triplay(sequence[getRandom(0, sequence.length, true)])
  }
}

function triplay (number) {
  // Main string
  setTimeout(() => {
    triggerSound(number)
  }, getRandom(10, 500, true))
  if (getRandom(50, 100) < wind) {
    // Second
    setTimeout(() => {
      triggerSound(number + 1)
    }, getRandom(300, 900, true))
  }
  if (getRandom(30, 100) < wind) {
    // Third
    setTimeout(() => {
      triggerSound(number + 2)
    }, getRandom(600, 900, true))
  }
}

async function triggerSound (sound) {
  await chimes[sound].audioObject.setVolumeAsync(0)
  await chimes[sound].audioObject.stopAsync()
  await chimes[sound].audioObject.setVolumeAsync(getRandom(0.1, 1))
  await chimes[sound].audioObject.playAsync()
}

export class Chimes extends React.Component {
  componentDidMount () {
    // setupAudio()
  }

  render () {
    return <View style={styles.chimesView}>
      <View style={styles.side}>
        <Button onPress={triplay.bind(this, 0)} title='1' />
        <Button onPress={triplay.bind(this, 21)} title='8' />
      </View>
      <View style={styles.middle}>
        <Button onPress={triplay.bind(this, 3)} title='2' />
        <Button onPress={triplay.bind(this, 18)} title='7' />
      </View>
      <View style={styles.middle}>
        <Button onPress={triplay.bind(this, 6)} title='3' />
        <Button onPress={triplay.bind(this, 15)} title='6' />
      </View>
      <View style={styles.side}>
        <Button onPress={triplay.bind(this, 9)} title='4' />
        <Button onPress={triplay.bind(this, 12)} title='5' />
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
