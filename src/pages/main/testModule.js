import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AsyncStorage from '@react-native-community/async-storage'
const historyKey = '@h1story_list_key'
import finishStore from 'src/pages/finish/store'
import { toJS } from 'mobx';
import srcStore from 'src/store'

export default function TestModule() {
  const onPress = () => {
    PushNotificationIOS.getScheduledLocalNotifications(res => {
      console.log(res)
    })
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