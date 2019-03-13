import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { peruvian } from '../assets/audio/peruvian'

export async function setupAudio () {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  peruvian.map(async chime => {
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

let playing = false

export function playPeruvian () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function endPeruvian () {
  await peruvian[1].audioObject.stopAsync()
  await peruvian[1].audioObject.playAsync()
  await peruvian[0].audioObject.stopAsync()
  playing = false
}

async function triggerSound (sound) {
  await peruvian[sound].audioObject.stopAsync()
  await peruvian[sound].audioObject.setIsLoopingAsync(true)
  await peruvian[sound].audioObject.playAsync()
}

export class Peruvian extends React.Component {
  componentDidMount () {
    setupAudio()
  }

  render () {
    return <View style={styles.peruvianView} />
  }
}

const styles = StyleSheet.create({
  peruvianView: {
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
