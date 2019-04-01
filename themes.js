import React from 'react'

import { Chimes, playChimes, endChimes } from './components/themes/Chimes'
import { Shaman, playShaman, endShaman } from './components/themes/Shaman'
import { Coffee, playCoffee, endCoffee } from './components/themes/Coffee'
import { OneTwoEight, play128, end128 } from './components/themes/OneTwoEight'
import { Cosmic, playCosmic, endCosmic } from './components/themes/Cosmic'
import { Withyou, playWithyou, endWithyou } from './components/themes/Withyou'
import { Beatless, playBeatless, endBeatless } from './components/themes/Beatless'

export const themes = [
  {
    title: 'Shaman Drumming',
    slug: 'shaman',
    image: require('./assets/images/shaman.jpg'),
    player: <Shaman />
  },
  {
    title: 'Wind Chimes',
    slug: 'chimes',
    image: require('./assets/images/chimes.jpg'),
    player: <Chimes />
  },
  {
    title: '"Dripping Arpeggio"',
    slug: 'coffee',
    image: require('./assets/images/coffee.jpg'),
    player: <Coffee />
  },
  {
    title: '"Dissolving Sadness"',
    slug: '128',
    image: require('./assets/images/128.jpg'),
    player: <OneTwoEight />
  },
  {
    title: '"Healing Loneliness"',
    slug: 'withyou',
    image: require('./assets/images/withyou.jpg'),
    player: <Withyou />
  },
  {
    title: '"Cosmic Broadcast"',
    slug: 'cosmic',
    image: require('./assets/images/cosmic.jpg'),
    player: <Cosmic />
  },
  {
    title: '"Distant Shores"',
    slug: 'beatless',
    image: require('./assets/images/beatless.jpg'),
    player: <Beatless />
  }
]

export function playSequence (mode) {
  switch (mode) {
    case 0:
      playShaman()
      break
    case 1:
      playChimes()
      break
    case 2:
      playCoffee()
      break
    case 3:
      play128()
      break
    case 4:
      playWithyou()
      break
    case 5:
      playCosmic()
      break
    case 6:
      playBeatless()
      break
  }
}

export function endSequence (mode) {
  switch (mode) {
    case 0:
      endShaman()
      break
    case 1:
      endChimes()
      break
    case 2:
      endCoffee()
      break
    case 3:
      end128()
      break
    case 4:
      endWithyou()
      break
    case 5:
      endCosmic()
      break
    case 6:
      endBeatless()
      break
  }
}
