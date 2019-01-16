import React from 'react'
import { StyleSheet, View, Button } from 'react-native'
import { Audio } from 'expo'
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const chimes = [
  {
    name: 'one',
    sound: require('../assets/audio/1_a.m4a')
  },
  {
    name: 'two',
    sound: require('../assets/audio/2_b.m4a')
  },
  {
    name: 'three',
    sound: require('../assets/audio/3_c.m4a')
  },
  {
    name: 'four',
    sound: require('../assets/audio/4_e.m4a')
  },
  {
    name: 'five',
    sound: require('../assets/audio/5_a.m4a')
  },
  {
    name: 'six',
    sound: require('../assets/audio/6_c.m4a')
  }
]

export class Chimes extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    this.setupAudio()
  }

  setupAudio = async () => {

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    })

    this.audio = {}
    chimes.map(async chime => {
      const { sound } = await Audio.Sound.createAsync(chime.sound)
      await sound.setStatusAsync({
        volume: 1
      })
      this.audio[chime.name] = async () => {
        try {
          await sound.setPositionAsync(0)
          await sound.playAsync()
        } catch (error) {
          console.warn("sound error", { error })
          // An error occurred!
        }
      }
    })
  }

  play (name) {
    this.audio[name]()
  }

  render () {
    console.log(chimes)
    const tapPads = chimes.map((chime, index) => <Button key={index} onPress={this.play.bind(this, chime)} title={chime.name} />)
    return <View style={styles.chimesView}>
      <View style={styles.side}>
        <Button onPress={this.play.bind(this, 'one')} title='1' />
        <Button onPress={this.play.bind(this, 'six')} title='6' />
      </View>
      <View style={styles.middle}>
        <Button onPress={this.play.bind(this, 'two')} title='2' />
        <Button onPress={this.play.bind(this, 'five')} title='5' />
      </View>
      <View style={styles.side}>
        <Button onPress={this.play.bind(this, 'three')} title='3' />
        <Button onPress={this.play.bind(this, 'four')} title='4' />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  chimesView: {
    flex: 1,
    width: '60%',
    left: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: Colors.white,
    height: Layout.window.height / 2,
    paddingTop: '50%',
    fontSize: 84,
    alignItems: 'center',
    // textAlign: 'center'
  },
  side: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  middle: {
    height: 200,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
})
