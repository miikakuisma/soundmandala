import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { shaman } from '../assets/audio/shaman'

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

let playing = false

export function playShaman () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function endShaman () {
  shaman[0].audioObject.stopAsync()
  shaman[1].audioObject.playAsync()
  playing = false
}

async function triggerSound (sound) {
  await shaman[sound].audioObject.stopAsync()
  await shaman[sound].audioObject.setIsLoopingAsync(true)
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
