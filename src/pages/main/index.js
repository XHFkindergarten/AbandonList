import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, SafeAreaView, StatusBar, AppState } from 'react-native';
import TodoList from './todoList'
import store from 'src/store'
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'src/components'
import themeContext from 'src/themeContext'
import TestModule from './testModule'
import Notification from 'src/utils/Notification'
import mainStore from './store'
import { isFirstOpen } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'

const { width } = Dimensions.get('window')

const Main = ({ navigation }) => {

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
      }
    }, [])
  )

  // 用户是否已经授权
  const [ authorized, setAuthorized ] = useState(true)

  // 将路由存储到mobx store中方便外部调用
  store.setNav(navigation)
  const [ moveX ] = useState(new Animated.Value(0))
  // 页面左右边缘滑动时切换页面
  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gesture) => {
      if (store.preventOtherHandler || mainStore.isScrollCard) return false
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

  const theme = useContext(themeContext)



  return (
    <SafeAreaView style={ { flex: 1, paddingBottom: 60, backgroundColor: theme.mainColor } }>
      <TestModule />
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
            { ..._panResponder.panHandlers }
            style={ [ styles.container, {
              backgroundColor: theme.subColor
            } ] }
          >
            <TodoList
              authorized={ authorized }
              navigation={ navigation }
            />
          </View>
        </Animated.View>
      </View>
      <StatusBar hidden></StatusBar>
    </SafeAreaView>

  )
}
export default (Main)

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30,
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