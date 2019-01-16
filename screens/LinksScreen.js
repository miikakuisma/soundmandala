import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ExpoLinksView } from '@expo/samples'
import { Chimes } from '../components/Chimes'

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links'
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Chimes />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  }
})
