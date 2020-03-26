import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import store from 'src/store'
import TodoItem from './todoItem'
import { observer } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated'
export default observer(function TodoList({ expandCard, navigation, authorized }) {
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
      <Transition.In
        durationMs={ 300 }
        type="fade"
      />
      <Transition.Change interpolation="easeInOut" />
      <Transition.Out
        durationMs={ 300 }
        type="fade"
      />
    </Transition.Together>
  )
  useMemo(() => {
    if (listRef.current) {
      listRef.current.animateNextTransition()
    }
  })

  const preventScroll = store.preventScroll


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
              paddingBottom: 100
            } }
            keyboardDismissMode="on-drag"
            pagingEnabled={ false }
            removeClippedSubviews
            scrollEnabled={ !store.leftItemId && !preventScroll }
            showsVerticalScrollIndicator={ false }
          >
            { todoList.map(item => (
              <TodoItem
                expandCard={ expandCard }
                item={ item }
                key={ item.date }
                navigation={ navigation }
              />
            )) }
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
