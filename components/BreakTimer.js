import React from 'react'
import { AppState, StyleSheet, View, Text, Button } from 'react-native'
import Colors from '../constants/Colors'

let leftAppTimestamp
let leftAppTimerValue

export class BreakTimer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timerValue: null,
      running: null,
      completed: false,
      appState: AppState.currentState
    }
    this.timer = null
  }

  componentDidMount () {
    this.setState({
      running: this.props.autorun,
      timerValue: this.props.duration * 60
    })

    if (this.props.autorun) {
      this.startSession()
    }
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const timeAway = Date.now() - leftAppTimestamp
      const updatedTimerValue = leftAppTimerValue - Math.round(timeAway/1000)
      this.setState({ timerValue: updatedTimerValue })
    }
    if (nextAppState === 'inactive') {
      leftAppTimestamp = Date.now()
      leftAppTimerValue = this.state.timerValue
    }
    this.setState({appState: nextAppState})
  }

  handleStart () {
    this.setState({
      timerValue: this.props.duration * 60
    })
    this.startSession()
  }

  handleCancel () {
    this.setState({
      timerValue: this.props.duration * 60,
      running: false
    })
    clearInterval(this.timer)
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  startSession () {
    this.setState({ running: true })
    this.timer = setInterval(() => {
      if (this.state.timerValue > 1) {
        this.setState({ timerValue: this.state.timerValue = this.state.timerValue - 1 })
      } else {
        this.sessionCompeleted()
      }
      if (this.props.onUpdate) {
        this.props.onUpdate(this.state.timerValue)
      }
    }, 1000)
    if (this.props.onStart) {
      this.props.onStart()
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
      return <View>
        <Button onPress={this.handleCancel.bind(this)} title='Cancel' />
      </View>
    }
    if (this.state.completed) {
      return <Button onPress={this.handleStart.bind(this)} title='Start Over' />
    }
    if (!this.state.running && !this.state.completed) {
      return <Button onPress={this.handleStart.bind(this)} title='Start' />
    }
  }
}

const styles = StyleSheet.create({
  // timeLeft: {
  //   color: Colors.white,
  //   fontSize: 64,
  //   textAlign: 'center'
  // }
})
