import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { coffee } from '../assets/audio/coffee'

export async function setupAudio () {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  coffee.map(async chime => {
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

let playing = false

export function playCoffee () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function endCoffee () {
  playing = false
  await coffee[0].audioObject.stopAsync()
  await coffee[1].audioObject.playAsync()
}

async function triggerSound (sound) {
  await coffee[sound].audioObject.stopAsync()
  await coffee[sound].audioObject.setIsLoopingAsync(true)
  await coffee[sound].audioObject.playAsync()
}

export class Coffee extends React.Component {
  componentDidMount () {
    setupAudio()
  }

  render () {
    return <View style={styles.coffeeView} />
  }
}

const styles = StyleSheet.create({
  coffeeView: {
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
