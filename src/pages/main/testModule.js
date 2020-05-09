import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import ColorPicker from 'src/components/colorPicker'
import dailyStore from 'src/pages/daily/dailyStore'
import { toJS } from 'mobx';
export default function TestModule() {
  const [ showColorPicker, setColorPicker ] = useState(false)
  const handleOk = () => {
    setColorPicker(false)
  }
  const handleCancel = () => {
    setColorPicker(false)
  }
  const handlePress = () => {
    dailyStore.updateDailyList({})
    dailyStore.updateDailyLog({})
  }
  return (
    <View style={ {
      height: 100
    } }
    >
      <TouchableOpacity onPress={ handlePress }>
        <Text style={ {
          color: '#FFF'
        } }
        >
          press it
        </Text>
      </TouchableOpacity>
      <ColorPicker onCancel={ handleCancel }
        onOk={ handleOk }
        visible={ showColorPicker }
      />
    </View>
  )
}