import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import Colors from '../constants/Colors'

export class BreakTimer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timerValue: 60,
      running: null,
      completed: false
    }
    this.timer = null
  }

  componentDidMount () {
    this.setState({
      running: this.props.autorun,
      timerValue: this.props.duration || 60
    })

    if (this.props.autorun) {
      this.startSession()
    }
  }

  handleStart () {
    this.setState({
      timerValue: this.props.duration || 60
    })
    this.startSession()
  }

  startSession () {
    this.setState({ running: true })
    this.timer = setInterval(() => {
      if (this.state.timerValue > 1) {
        this.setState({ timerValue: this.state.timerValue = this.state.timerValue - 1 })
      } else {
        this.sessionCompeleted()
      }
    }, 1000)
    if (this.props.onStart) {
      this.props.onStart(this.props.duration || 60)
    }
  }

  sessionCompeleted () {
    clearInterval(this.timer)
    this.setState({ running: false, completed: true })
    if (this.props.onCompleted) {
      this.props.onCompleted()
    }
  }

  render () {
    if (this.state.running) {
      return <Text style={styles.timeLeft}>{this.state.timerValue}</Text>
    }
    if (this.state.completed) {
      return <View>
        <Text style={styles.finished}>Finished!</Text>
        <Button onPress={this.handleStart.bind(this)} title='Start Over' />
      </View>
    }
    if (!this.state.running && !this.state.completed) {
      return <Button onPress={this.handleStart.bind(this)} title='Start' />
    }
  }
}

const styles = StyleSheet.create({
  timeLeft: {
    color: Colors.white,
    fontSize: 64,
    textAlign: 'center'
  },
  finished: {
    color: Colors.white,
    fontSize: 32,
    textAlign: 'center'
  }
})
