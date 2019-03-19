import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import HomeScreen from './screens/HomeScreen'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <HomeScreen />
          {/* <AppNavigator /> */}
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/logo.png'),
        require('./assets/images/miikakuisma-logo-symbol-white.png'),
        require('./assets/images/chimes.jpg'),
        require('./assets/images/shaman.jpg'),
        require('./assets/images/cosmic.jpg'),
        require('./assets/images/withyou.jpg'),
        require('./assets/images/beatless.jpg'),
        require('./assets/images/128.jpg'),
        require('./assets/timer-images/1.png'),
        require('./assets/timer-images/2.png'),
        require('./assets/timer-images/3.png'),
        require('./assets/timer-images/4.png'),
        require('./assets/timer-images/5.png'),
        require('./assets/timer-images/6.png'),
        require('./assets/timer-images/7.png'),
        require('./assets/timer-images/8.png'),
        require('./assets/timer-images/9.png'),
        require('./assets/timer-images/10.png'),
        require('./assets/timer-images/11.png'),
        require('./assets/timer-images/12.png'),
        require('./assets/timer-images/13.png'),
        require('./assets/timer-images/14.png'),
        require('./assets/timer-images/15.png'),
        require('./assets/timer-images/16.png'),
        require('./assets/timer-images/17.png'),
        require('./assets/timer-images/18.png'),
        require('./assets/timer-images/19.png'),
        require('./assets/timer-images/20.png'),
        require('./assets/timer-images/21.png'),
        require('./assets/timer-images/22.png'),
        require('./assets/timer-images/23.png'),
        require('./assets/timer-images/24.png'),
        require('./assets/timer-images/25.png'),
        require('./assets/timer-images/26.png'),
        require('./assets/timer-images/27.png'),
        require('./assets/timer-images/28.png'),
        require('./assets/timer-images/29.png'),
        require('./assets/timer-images/30.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'nunito-light': require('./assets/fonts/Nunito-Light.ttf'),
        'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
        'nunito-semibold': require('./assets/fonts/Nunito-SemiBold.ttf'),
        'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf')
      })
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
