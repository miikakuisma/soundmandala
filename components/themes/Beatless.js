import React from 'react'
import { View } from 'react-native'
import { setupAudio, fadeIn } from '../utils'
import { audioConfig } from '../../assets/audio/beatless'

// Audio loop player
// Miika Kuisma
// Moreyes Oy

let playing = false

export function playBeatless () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function endBeatless () {
  await audioConfig[1].audioObject.stopAsync()
  await audioConfig[1].audioObject.playAsync()
  await audioConfig[0].audioObject.stopAsync()
  playing = false
}

async function triggerSound (sound) {
  await audioConfig[sound].audioObject.stopAsync()
  await audioConfig[sound].audioObject.setIsLoopingAsync(true)
  await audioConfig[sound].audioObject.setVolumeAsync(0)
  await audioConfig[sound].audioObject.playAsync()
  fadeIn(audioConfig[sound].audioObject)
}

export class Beatless extends React.Component {
  componentDidMount () {
    setupAudio(audioConfig)
  }

  render () {
    return <View />
  }
}
