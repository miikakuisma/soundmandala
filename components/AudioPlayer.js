import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

let audioConfig
let playerMode

export async function setupAudio () {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  audioConfig.map(async chime => {
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

let playing = false

export function playNext () {
  if (playerMode === 'loop') {
    if (!playing) {
      triggerSound(0)
      playing = true
    }
  }
}

export async function playLast () {
  await audioConfig[1].audioObject.stopAsync()
  await audioConfig[1].audioObject.playAsync()
  await audioConfig[0].audioObject.stopAsync()
  playing = false
}

async function triggerSound (sound) {
  await audioConfig[sound].audioObject.stopAsync()
  await audioConfig[sound].audioObject.setIsLoopingAsync(true)
  await audioConfig[sound].audioObject.playAsync()
}

export class AudioPlayer extends React.Component {
  componentDidMount () {
    console.log(this.props.config)
    audioConfig = this.props.config
    playerMode = this.props.type
    setupAudio()
  }

  render () {
    return <View style={styles.audioView} />
  }
}

const styles = StyleSheet.create({
  audioView: {
    // flex: 1,
    // width: '60%',
    // left: '15%',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // color: Colors.white,
    // height: Layout.window.height / 2,
    // paddingTop: '50%',
    // fontSize: 84,
    // alignItems: 'center'
  }
})
