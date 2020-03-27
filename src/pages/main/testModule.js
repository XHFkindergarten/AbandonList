import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AsyncStorage from '@react-native-community/async-storage'
const historyKey = '@h1story_list_key'
import finishStore from 'src/pages/finish/store'
import { toJS } from 'mobx';
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import mainStore from './store'


export default observer(function TestModule() {
  const onPress = () => {
    mainStore.updatePreventScroll(!mainStore.preventScroll)
    // mainStore.updatePreventScroll(!m)
  }
  return (
    <View>
      <Text style={ {
        color: '#FFF'
      } }
      >{ mainStore.preventScroll.toString() }</Text>
      <TouchableOpacity onPress={ onPress }>
        <View style={ {
          height: 100
        } }
        >
          <Text style={ {
            color: '#FFF'
          } }
          >
          test
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
})