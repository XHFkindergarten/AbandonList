import React, { useEffect } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
import AppView from './src';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen'

export default function App() {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <View style={ { backgroundColor: '#212121', flex: 1 } }>
      <AppView />
    </View>
  );
}
