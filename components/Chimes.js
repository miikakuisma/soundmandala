import React from 'react'
import { View } from 'react-native'
import { setupAudio } from './utils'
import { audioConfig } from '../assets/audio/chimes'
import { getRandom } from '../components/utils'

// Simple wind chime simulation
// Miika Kuisma
// Moreyes Oy

let wind = 60 // 10 - 100
let offset = 0

// 0, 3, 6, 9, 12, 15, 18, 21
let sequence = [0, 6, 9, 0, 6, 9, 12, 15, 12, 9, 6, 3, 0, 6, 9, 15, 9, 12, 6, 9, 6, 9, 3, 6, 3, 6, 0, 3, 0, 3, 6, 9, 12, 15, 18, 21, 18, 21, 18, 15, 18, 21, 15, 9, 6, 12, 9, 6, 3, 9, 6, 3, 6, 3, 0, 3, 6, 9]

export function playChimes () {
  if (getRandom(30, 100) < wind) {
    triplay(sequence[offset])
    offset++
    if (offset === sequence.length) {
      offset = 0
    }
  }
}

export function endChimes () {
  triggerSound(23)
}

function triplay (number) {
  // Main string
  setTimeout(() => {
    triggerSound(number)
  }, getRandom(10, 500, true))
  if (getRandom(50, 100) < wind) {
    // Second
    setTimeout(() => {
      triggerSound(number + 1)
    }, getRandom(300, 900, true))
  }
  if (getRandom(30, 100) < wind) {
    // Third
    setTimeout(() => {
      triggerSound(number + 2)
    }, getRandom(600, 900, true))
  }
}

async function triggerSound (sound) {
  await audioConfig[sound].audioObject.setVolumeAsync(0)
  await audioConfig[sound].audioObject.stopAsync()
  await audioConfig[sound].audioObject.setVolumeAsync(getRandom(0.1, 1))
  await audioConfig[sound].audioObject.playAsync()
}

export class Chimes extends React.Component {
  componentDidMount () {
    setupAudio(audioConfig)
  }

  render () {
    return <View />
  }
}
