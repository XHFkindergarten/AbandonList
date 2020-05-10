import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, Animated, SafeAreaView, StatusBar, AppState } from 'react-native';
import TodoList from './todoList'
import store from 'src/store'
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'src/components'
import themeContext from 'src/themeContext'
// import TestModule from './testModule'
import Notification from 'src/utils/Notification'
import { isFirstOpen, setStorage } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'


const Main = ({ navigation }) => {
  // setStorage('@h1story_list_key', '')
  // setStorage('@future_list_key', '')
  useEffect(() => {
    // 允许左右滑动屏幕切换页面
    store.preventOtherHandler = false
    isFirstOpen().then(res => {
      if(res) {
        navigation.navigate('Guide')
      }
    })
  }, [])
  useFocusEffect(
    useCallback(() => {
      moveX.setValue(0)
      // 主页活跃时，清空角标
      if (AppState.currentState === 'active') {
        // 清空应用角标数
        Notification.clearBadgeNum()
      }
      // Do something when the screen is focused
      store.updateBottomNavName('Main')
      // 检查是否已经授权
      nativeCalendar.withAuth().then(() => {
      // 已授权
      }).catch(() => {
        setAuthorized(false)
      })
      return () => {
        // Do something when the screen is unfocused
        store.updateFocusCardId('')
        Animated.timing(moveX, {
          toValue: 0,
          duration: 400
        }).start()
      }
    }, [])
  )

  // 用户是否已经授权
  const [ authorized, setAuthorized ] = useState(true)

  // 将路由存储到mobx store中方便外部调用
  store.setNav(navigation)
  const [ moveX ] = useState(new Animated.Value(0))

  const AnimatedTranslateX = moveX.interpolate({
    inputRange: [ -41, -40, 0, 40, 41 ],
    outputRange: [ -60, -60, 0, 60, 60 ]
  })

  const theme = useContext(themeContext)

  return (
    <SafeAreaView style={ { flex: 1, paddingBottom: 60, backgroundColor: theme.mainColor } }>
      <StatusBar hidden></StatusBar>
      { /* <TestModule /> */ }
      <View style={ {
        flex: 1,
        backgroundColor: theme.subColor
      } }
      >
        <Animated.View
          style={  {
            flex: 1,
            backgroundColor: theme.subColor,
            transform: [ { translateX: AnimatedTranslateX } ]
          } }
        >
          <Calendar />
          <View
            style={ [ styles.container, {
              backgroundColor: theme.subColor
            } ] }
          >
            <TodoList
              authorized={ authorized }
              moveX={ moveX }
              navigation={ navigation }
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>

  )
}
export default (Main)

const styles = StyleSheet.create({
  container: {
    // paddingLeft: 30,
    // paddingRight: 30,
    paddingBottom: 40,
    // paddingTop: 20,
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