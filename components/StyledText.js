import React from 'react'
import { Text } from 'react-native'

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
