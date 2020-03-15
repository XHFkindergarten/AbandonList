/**
 * 测试页面
 */
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function Other({ navigation }) {
  return (
    <SafeAreaView style={ { backgroundColor: '#000', flex: 1 } }>
      <View style={ {
        padding: 40
      } }
      >
        <TouchableOpacity onPress={ () => {
          navigation.navigate('Main')
        } }
        >
          <Text style={ { color: '#FFF', fontSize: 30, fontWeight: '900' } }>Other</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}