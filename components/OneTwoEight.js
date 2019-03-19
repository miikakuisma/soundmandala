import React from 'react'
import { View } from 'react-native'
import { setupAudio } from './utils'
import { audioConfig } from '../assets/audio/128'

// Audio loop player
// Miika Kuisma
// Moreyes Oy

let playing = false

export function play128 () {
  if (!playing) {
    triggerSound(0)
    playing = true
  }
}

export async function end128 () {
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

export class OneTwoEight extends React.Component {
  componentDidMount () {
    setupAudio(audioConfig)
  }

  render () {
    return <View />
  }
}
