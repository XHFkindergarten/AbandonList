import React from 'react';
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import SwipeableRow from './swipeable'

export default function Test() {
  return (
    <SafeAreaView style={ {
      flex: 1,
      backgroundColor: '#dbdbdb'
    } }
    >
      <ScrollView style={ {
        flex: 1
      } }
      >
        <Text style={ {
          fontWeight: '900',
          fontSize: 30
        } }
        >测试页面</Text>
        <SwipeableRow />
      </ScrollView>
    </SafeAreaView>
  )
}