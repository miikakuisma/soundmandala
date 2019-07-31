import React from 'react'
import { Text } from 'react-native'
import { Audio } from 'expo-av';

export class MonoText extends React.Component {
  render () {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />
  }
}

export class LightText extends React.Component {
  render () {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'nunito-light' }]} />
  }
}

export class RegularText extends React.Component {
  render () {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'nunito-regular' }]} />
  }
}

export class SemiboldText extends React.Component {
  render () {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'nunito-semibold' }]} />
  }
}

export class BoldText extends React.Component {
  render () {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'nunito-bold' }]} />
  }
}

export function getRandom (min, max, rounded) {
  if (rounded) {
    return Math.round(min + Math.random() * (max - min))
  } else {
    return min + Math.random() * (max - min)
  }
}

export async function setupAudio (audioConfig) {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
  })
  audioConfig.map(async sample => {
    sample.audioObject = new Audio.Sound()
    try {
      await sample.audioObject.loadAsync(sample.sound)
    } catch (error) {
      console.error('Error while loading audio objects')
    }
  })
}

export function fadeIn (audioObject) {
  let volume = 0
  this.fader = setInterval(() => {
    if (volume.toFixed(1) < 1.0) {
      volume = volume + 0.01
      audioObject.setVolumeAsync(volume)
    } else {
      audioObject.setVolumeAsync(1)
      clearInterval(this.fader)
    }
  }, 50)
}
