import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AsyncStorage from '@react-native-community/async-storage'
const historyKey = '@h1story_list_key'
import finishStore from 'src/pages/finish/store'
import { toJS } from 'mobx';
import srcStore from 'src/store'

const firstLaunchKey = '@first_launch_key'

export default function TestModule() {
  const onPress = () => {
    PushNotificationIOS.getScheduledLocalNotifications(res => {
      console.log('notification list', res)
    })
  }
  const onPress2 = () => {
    PushNotificationIOS.cancelAllLocalNotifications()
  }
  return (
    <View>
      <TouchableOpacity onPress={ onPress }>
        <View style={ {
          height: 100
        } }
        >
          <Text style={ {
            color: '#FFF'
          } }
          >
          查看所有通知
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={ onPress2 }>
        <View style={ {
          height: 100
        } }
        >
          <Text style={ {
            color: '#FFF'
          } }
          >
          清除所有通知
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}