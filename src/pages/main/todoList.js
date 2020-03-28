import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import store from 'src/store'
import TodoItem from './todoItem'
import { observer, inject } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated'
import mainStore from './store'
import { ScrollView, PanGestureHandler } from 'react-native-gesture-handler'
import { State } from 'react-native-gesture-handler/GestureHandler';

export default observer(function TodoList({ expandCard, navigation, authorized, moveX }) {

  const todoList = store.todoList
  todoList.filter((a, b) => {
    if (a.allDay) {
      return -1
    } else {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    }
  })
  const listRef = useRef()
  const transition = (
    <Transition.Together>
      <Transition.Out
        durationMs={ 300 }
        type="fade"
      />
      <Transition.Change interpolation="easeInOut" />
      { /* <Transition.In
        durationMs={ 300 }
        type="fade"
      /> */ }
    </Transition.Together>
  )
  useMemo(() => {
    if (listRef.current) {
      listRef.current.animateNextTransition()
    }
  })

  const handleLeftPanResponder = event => {
    const {
      nativeEvent: {
        translationX: dx
      }
    } = event
    if (!store.preventOtherHandler) {
      moveX.setValue(dx)
    }
    if (dx > 40) {
      store.nav.navigate('Daily')
    } else if (dx < -40) {
      store.nav.navigate('Finish')
    }
  }
  const handleRightPanResponder = event => {
    const {
      nativeEvent: {
        translationX: dx
      }
    } = event
    if (!store.preventOtherHandler) {
      moveX.setValue(dx)
    }
    if (dx > 40) {
      store.nav.navigate('Daily')
    } else if (dx < -40) {
      store.nav.navigate('Finish')
    }
  }

  // 手势结束的时候
  const _handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      Animated.spring(moveX, { toValue: 0 } ).start()
    }
  }

  return (
    <Transitioning.View
      ref={ listRef }
      style={ { flex: 1 } }
      transition={ transition }
    >
      {
        authorized ? (
          <ScrollView
            contentContainerStyle={ {
              paddingTop: 20,
              paddingBottom: 100,
              flexDirection: 'row'
            } }
            keyboardDismissMode="on-drag"
            scrollEnabled
            showsVerticalScrollIndicator={ false }
          >
            <PanGestureHandler
              maxPointers={ 1 }
              minDist={ 4 }
              minPointers={ 1 }
              onGestureEvent={ handleLeftPanResponder }
              onHandlerStateChange={ _handleStateChange }
            >
              <View style={ {
                width: 30
              } }
              />
            </PanGestureHandler>
            <View style={ {
              flex: 1
            } }
            >
              { todoList.map(item => (
                <TodoItem
                  expandCard={ expandCard }
                  item={ item }
                  key={ item.date }
                  navigation={ navigation }
                />
              )) }
            </View>
            <PanGestureHandler
              maxPointers={ 1 }
              minDist={ 4 }
              minPointers={ 1 }
              onGestureEvent={ handleRightPanResponder }
              onHandlerStateChange={ _handleStateChange }
            >
              <View style={ {
                width: 30
              } }
              />
            </PanGestureHandler>
          </ScrollView>

        ) : (
          <View style={ {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          } }
          >
            <Text style={ {
              color: '#FFF',
              lineHeight: 30,
              fontSize: 16,
              width: 300,
              fontWeight: '300',
              textAlign: 'center'
            } }
            >
            请在[设置] -> [AbandonList] -> [日历]   开启日历管理权限
            </Text>
          </View>
        )
      }
    </Transitioning.View>
  )
})
