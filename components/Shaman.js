import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const shaman = [
  {
    name: '1',
    sound: require('../assets/audio/shaman/1.m4a')
  },
  {
    name: '2',
    sound: require('../assets/audio/shaman/2.m4a')
  },
  {
    name: '3',
    sound: require('../assets/audio/shaman/3.m4a')
  },
  {
    name: '4',
    sound: require('../assets/audio/shaman/4.m4a')
  },
  {
    name: '5',
    sound: require('../assets/audio/shaman/5.m4a')
  },
  {
    name: '6',
    sound: require('../assets/audio/shaman/6.m4a')
  },
  {
    name: '7',
    sound: require('../assets/audio/shaman/7.m4a')
  },
  {
    name: '8',
    sound: require('../assets/audio/shaman/8.m4a')
  },
  {
    name: '9',
    sound: require('../assets/audio/shaman/9.m4a')
  },
  {
    name: '10',
    sound: require('../assets/audio/shaman/10.m4a')
  },
  {
    name: '11',
    sound: require('../assets/audio/shaman/11.m4a')
  },
  {
    name: '12',
    sound: require('../assets/audio/shaman/12.m4a')
  },
  {
    name: '13',
    sound: require('../assets/audio/shaman/13.m4a')
  },
  {
    name: '14',
    sound: require('../assets/audio/shaman/14.m4a')
  },
  {
    name: '15',
    sound: require('../assets/audio/shaman/15.m4a')
  },
  {
    name: '16',
    sound: require('../assets/audio/shaman/16.m4a')
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
  shaman.map(async chime => {
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

let offset = 0
const sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

export function playSequence () {
  triggerSound(sequence[offset])
  progress()
  setTimeout(() => {
    triggerSound(sequence[offset])
    progress()
  }, 300)
  setTimeout(() => {
    triggerSound(sequence[offset])
    progress()
  }, 600)
  setTimeout(() => {
    triggerSound(sequence[offset])
    progress()
  }, 900)
}

function progress () {
  if (offset >= sequence.length - 1) {
    offset = 0
  } else {
    offset++
  }
}

async function triggerSound (sound) {
  await shaman[sound].audioObject.stopAsync()
  await shaman[sound].audioObject.setVolumeAsync(getRandom(0.8, 1))
  await shaman[sound].audioObject.playAsync()
}

export class Shaman extends React.Component {
  componentDidMount () {
    // setupAudio()
  }

  render () {
    return <View style={styles.shamanView}>
      <View style={styles.side}>
        <Button onPress={play.bind(this, 0)} title='1' />
        <Button onPress={play.bind(this, 21)} title='8' />
      </View>
      <View style={styles.middle}>
        <Button onPress={play.bind(this, 3)} title='2' />
        <Button onPress={play.bind(this, 18)} title='7' />
      </View>
      <View style={styles.middle}>
        <Button onPress={play.bind(this, 6)} title='3' />
        <Button onPress={play.bind(this, 15)} title='6' />
      </View>
      <View style={styles.side}>
        <Button onPress={play.bind(this, 9)} title='4' />
        <Button onPress={play.bind(this, 12)} title='5' />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  shamanView: {
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
  }
})
