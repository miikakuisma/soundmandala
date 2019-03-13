import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { golden } from '../assets/audio/golden'

export async function setupAudio () {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  golden.map(async chime => {
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

let playing = false

export function playGolden () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function endGolden () {
  await golden[1].audioObject.stopAsync()
  await golden[1].audioObject.playAsync()
  await golden[0].audioObject.stopAsync()
  playing = false
}

async function triggerSound (sound) {
  await golden[sound].audioObject.stopAsync()
  await golden[sound].audioObject.setIsLoopingAsync(true)
  await golden[sound].audioObject.playAsync()
}

export class Golden extends React.Component {
  componentDidMount () {
    setupAudio()
  }

  render () {
    return <View style={styles.goldenView} />
  }
}

const styles = StyleSheet.create({
  goldenView: {
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
