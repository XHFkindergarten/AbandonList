import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import ColorPicker from 'src/components/colorPicker'

export default function TestModule() {
  const [ showSelect, setShowSelect ] = useState(false)
  const handlePress = () => {
    setShowSelect(true)
  }
  const handleOk = color => {
    console.log(color)
    setShowSelect(false)
  }
  const handleCancel = () => {
    setShowSelect(false)
  }
  return (
    <View style={ {
      height: 100
    } }
    >
      <TouchableOpacity onPress={ handlePress }>
        <Text style={ {
          color: '#FFF',
          fontSize: 20
        } }
        >颜色选择器</Text>
      </TouchableOpacity>
      <ColorPicker
        color="#FF0000"
        onCancel={ handleCancel }
        onOk={ handleOk }
        visible={ showSelect }
      />
    </View>
  )
}