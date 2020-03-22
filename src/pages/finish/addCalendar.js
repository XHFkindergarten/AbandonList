import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState, Fragment } from 'react';
import finishStore from './store'
// import { TouchableScale } from 'src/components'
import { View, StyleSheet, Text, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import { colorList } from 'src/common'
/**
 * 新增日历
 */

const { width } = Dimensions.get('window')


const colors = colorList

function AddCalendar({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      finishStore.toggleIsAddCalendar(true)
      return () => {
        // Do something when the screen is unfocused
        finishStore.toggleIsAddCalendar(false)
        finishStore.resetAddCalendarForm()
      }
    }, [])
  )



  const [ name, setName ] = useState('')

  const [ selectColor, setColor ] = useState('')


  const handleTextChange = value => {
    setName(value)
    finishStore.updateAddCalendarForm({
      name: value
    })
  }



  const ColorItem = ({ color }) => {
    const isSelect = color === selectColor
    const [ scale ] = useState(new Animated.Value(1))
    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.8
      }).start()
    }
    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1
      }).start()
    }
    const onPress = () => {
      setColor(color)
      finishStore.updateAddCalendarForm({
        color: color
      })
    }
    return (
      <TouchableWithoutFeedback
        onPress={ onPress }
        onPressIn={ onPressIn }
        onPressOut={ onPressOut }
      >
        <Animated.View
          style={ [ styles.colorBlock, {
            transform: [ { scale: scale } ],
            backgroundColor: color
          }, isSelect && {
            borderWidth: 2,
            borderColor: '#FFF'
          } ] }
        />
      </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={ styles.container }>
      <TextInput
        clearButtonMode="while-editing"
        keyboardAppearance="dark"
        maxLength={ 10 }
        onChangeText={ handleTextChange }
        placeholder="请输入新分组名称"
        placeholderTextColor="#444"
        returnKeyLabel="next"
        style={ styles.textInput }
        value={ name }
      />
      <View style={ styles.row }>
        <Text style={ styles.title }>颜色</Text>
      </View>
      {
        colors.map(item => (
          <View key={ item[0] }
            style={ styles.colorRow }
          >
            { item.map(color => (
              <ColorItem color={ color }
                key={ color }
              />
            )) }
          </View>
        ))
      }
      <View style={ { height: 80 } } />
    </View>
  )
}

export default observer(AddCalendar)

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  textInput: {
    fontSize: 16,
    color: '#FFF'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    color: '#999',
    fontSize: 18
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  colorBlock: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    borderRadius: 10
  }
})