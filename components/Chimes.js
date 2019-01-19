import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { chimes } from '../assets/audio/chimes'
import { getRandom } from '../components/utils'

async function setupAudio () {
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
      console.log('Error while loading audio objects (Chimes)')
    }
  })
}

let wind = 60 // 10 - 100
let offset = 0

// 0 = empty, 4, 7, 10, 13, 16, 19, 22
let sequence = [1, 7, 10, 1, 7, 10, 13, 16, 13, 10, 7, 3, 1, 7, 10, 16, 10, 13, 7, 10, 7, 10, 3, 7, 3, 7, 1, 3, 1, 3, 7, 10, 13, 16, 19, 22, 19, 22, 19, 16, 19, 22, 16, 10, 7, 13, 10, 7, 3, 10, 7, 3, 7, 3, 1, 3, 7, 10]

export function playSequence () {
  if (getRandom(30, 100) < wind) {
    triplay(sequence[offset])
    offset++
    if (offset === sequence.length) {
      offset = 0
    }
  }
}

export function endSequence () {
  triggerSound(24)
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
    setupAudio()
  }

  render () {
    return <View style={styles.chimesView} />
  }
}

const styles = StyleSheet.create({
  chimesView: {
    flex: 1,
    width: '60%',
    left: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.white,
    height: Layout.window.height / 2,
    paddingTop: '50%',
    fontSize: 84,
    alignItems: 'center'
  }
})
