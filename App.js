import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
import AppView from './src';
import { View } from 'react-native';

export default function App() {
  return (
    <View style={ { backgroundColor: '#212121', flex: 1 } }>
      <AppView />
    </View>
  );
}
