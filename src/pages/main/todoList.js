import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import store from 'src/store'
import TodoItem from './todoItem'
import { observer } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated'
export default observer(function TodoList({ expandCard, navigation }) {
  const todoList = store.todoList
  const listRef = useRef()
  const transition = (
    <Transition.Together>
      <Transition.In
        durationMs={ 300 }
        type="fade"
      />
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
  const storeShowTodoList = store.showTodoList
  return (
    <Transitioning.View
      ref={ listRef }
      style={ { flex: 1 } }
      transition={ transition }
    >
      <ScrollView
        contentContainerStyle={ {
          paddingTop: 20,
          paddingBottom: 100
        } }
        keyboardDismissMode="on-drag"
        pagingEnabled={ false }
        removeClippedSubviews
        scrollEnabled={ !store.leftItemId }
        showsVerticalScrollIndicator={ false }
      >
        { storeShowTodoList && todoList.map(item => (
          <TodoItem
            expandCard={ expandCard }
            item={ item }
            key={ item.date }
            navigation={ navigation }
          />
        )) }
      </ScrollView>
    </Transitioning.View>
  )
})