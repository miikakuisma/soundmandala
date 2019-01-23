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

// 0, 3, 6, 9, 12, 15, 18, 21
let sequence = [0, 6, 9, 0, 6, 9, 12, 15, 12, 9, 6, 3, 0, 6, 9, 15, 9, 12, 6, 9, 6, 9, 3, 6, 3, 6, 0, 3, 0, 3, 6, 9, 12, 15, 18, 21, 18, 21, 18, 15, 18, 21, 15, 9, 6, 12, 9, 6, 3, 9, 6, 3, 6, 3, 0, 3, 6, 9]

export function playChimes () {
  if (getRandom(30, 100) < wind) {
    triplay(sequence[offset])
    offset++
    if (offset === sequence.length) {
      offset = 0
    }
  }
}

export function endChimes () {
  triggerSound(23)
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
