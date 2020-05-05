import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import ColorPicker from 'src/components/colorPicker'

export default function TestModule() {
  const [ showSelect, setShowSelect ] = useState(false)
  const handlePress = () => {
    setShowSelect(true)
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
      <ColorPicker visible={ showSelect } />
    </View>
  )
}