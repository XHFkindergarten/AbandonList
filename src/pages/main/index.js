import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity, Text } from 'react-native';
import TodoList from './todoList'
import store from 'src/store'
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'src/components'
import Notification from 'src/utils/Notification'
import dailyStore from '../daily/dailyStore';

const { width } = Dimensions.get('window')

const Main = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      store.updateBottomNavName('Main')
      return () => {
        // Do something when the screen is unfocused

      }
    }, [])
  )
  // 将路由存储到mobx store中方便外部调用
  store.setNav(navigation)
  const [ moveX ] = useState(new Animated.Value(0))
  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (event, gesture) => {
      if (store.preventOtherHandler) return false
      return gesture.moveX < 20 || gesture.moveX > width - 20
    },
    onPanResponderMove: (event, gesture) => {
      moveX.setValue(gesture.dx)
      if (gesture.dx > 40) {
        store.nav.navigate('Daily')
      } else if (gesture.dx < -40) {
        store.nav.navigate('Finish')
      }
    },
    onPanResponderRelease: () => {
      Animated.spring(moveX, {
        toValue: 0
      }).start()
    }
  })
  const AnimatedTranslateX = moveX.interpolate({
    inputRange: [ -41, -40, 0, 40, 41 ],
    outputRange: [ -60, -60, 0, 60, 60 ]
  })
  /* <TouchableOpacity onPress={ () => {
    Notification.getScheduleList()
  } }
  >
    <Text style={ { color: '#FFF', height: 60 } }>所有schedule</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={ () => {
    Notification.removeAllSchedule()
  } }
  >
    <Text style={ { color: '#FFF', height: 60 } }>清除所有schedule</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={ () => {
    dailyStore.deleteDailyListItems(Object.keys(dailyStore.dailyList))
  } }
  >
    <Text style={ { color: '#FFF', height: 60 } }>清除所有dailyItem</Text>
  </TouchableOpacity> */
  return (
    <View style={ {
      flex: 1,
      backgroundColor: '#19191b'
    } }
    >
      <Animated.View
        style={  {
          flex: 1,
          backgroundColor: '#19191b',
          transform: [ { translateX: AnimatedTranslateX } ]
        } }
      >
        <Calendar />
        <View
          { ..._panResponder.panHandlers }
          style={ styles.container }
        >
          <TodoList navigation={ navigation }/>
        </View>
      </Animated.View>
    </View>
  )
}
export default (Main)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#19191b',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 40,
    paddingTop: 20,
    flex: 1
  },
  title: {
    color: '#FFF',
    textAlign: 'left',
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: '#616161',
    fontSize: 14,
    marginTop: 6
  }
})