import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import Test from './test.svg'

export default function TestModule() {
  return (
    <View style={ {
      height: 100
    } }
    >
      <Test />
    </View>
  )
}