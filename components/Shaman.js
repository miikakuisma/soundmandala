import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { shaman } from '../assets/audio/shaman'
import { getRandom } from '../components/utils'

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
    setupAudio()
  }

  render () {
    return <View style={styles.shamanView} />
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
