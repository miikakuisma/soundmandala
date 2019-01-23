import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import { eggs } from '../assets/audio/eggs'
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
  eggs.map(async chime => {
    chime.audioObject = new Audio.Sound()
    try {
      await chime.audioObject.loadAsync(chime.sound)
    } catch (error) {
      // An error occurred!
    }
  })
}

export function playEggs () {
  triggerSound(0)
  setTimeout(() => {
    triggerSound(1)
  }, 500)
}

export function endEggs () {
  triggerSound(2)
}

async function triggerSound (sound) {
  await eggs[sound].audioObject.stopAsync()
  await eggs[sound].audioObject.playAsync()
}

export class Eggs extends React.Component {
  componentDidMount () {
    setupAudio()
  }

  render () {
    return <View style={styles.eggsView} />
  }
}

const styles = StyleSheet.create({
  eggsView: {
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
