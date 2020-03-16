import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AsyncStorage from '@react-native-community/async-storage'
const historyKey = '@h1story_list_key'

export default function TestModule() {
  const onPress = () => {
    AsyncStorage.removeItem(historyKey)
  }
  return (
    <TouchableOpacity onPress={ onPress }>
      <View style={ {
        height: 100
      } }
      >
        <Text style={ {
          color: '#FFF'
        } }
        >测试</Text>
      </View>
    </TouchableOpacity>
  )
}