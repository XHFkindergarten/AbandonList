import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import store from 'src/store'
import TodoItem from './todoItem'
import { observer, inject } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated'
import mainStore from './store'
import { ScrollView } from 'react-native-gesture-handler'

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
    <Transition.Sequence>
      <Transition.Out
        durationMs={ 300 }
        type="fade"
      />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In
        durationMs={ 300 }
        type="fade"
      />
    </Transition.Sequence>
  )
  useMemo(() => {
    if (listRef.current) {
      listRef.current.animateNextTransition()
    }
  })

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
            scrollEnabled
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
