import React from 'react'
import { AppState, StyleSheet, View, Text, Button } from 'react-native'
import Colors from '../constants/Colors'

let leftAppTimestamp
let leftAppTimerValue

export class BreakTimer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      running: null,
      appState: AppState.currentState
    }
    this.timer = null
  }

  componentDidMount () {
    this.setState({
      running: this.props.autorun,
    })

    if (this.props.autorun) {
      this.startSession()
    }
  }

  handleStart () {
    this.startSession()
  }

  handleCancel () {
    this.setState({
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
    this.setState({
      running: false,
    })
  }

  render () {
    if (this.state.running) {
      return <View style={styles.cancelButton}>
        <Button
          onPress={this.handleCancel.bind(this)}
          title='STOP'
          color='#fff'
        />
      </View>
    }
    if (!this.state.running) {
      return <View style={styles.startButton}>
        <Button
          onPress={this.handleStart.bind(this)}
          title='START'
          color='#fff'
        />
      </View>
    }
  }
}

const styles = StyleSheet.create({
  startButton: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    margin: 15,
    color: '#000',
    borderRadius: 9,
    backgroundColor: Colors.logoBlue
  },
  cancelButton: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    margin: 15,
    color: '#000',
    borderRadius: 9,
    backgroundColor: Colors.red
  }
})
