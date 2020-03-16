import React, { useState, Fragment, useRef, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, PanResponder } from 'react-native';
import store from 'src/store'
import TodoCard from './todoCard'
import { Transition, Transitioning } from 'react-native-reanimated';
import { vibrate } from 'src/utils'
import themeContext from 'src/themeContext'


const weekdayMap = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]

/**
 * 当日待办标题(日期+说明)
 */
const ItemHeader = ({ date }) => {
  const pressHandler = () => {
    vibrate(0)
    store.nav.navigate('Add', {
      date
    })
  }
  const today = new Date()
  // 是否是今天
  const isToday = today.setHours(0,0,0,0) === date.setHours(0,0,0,0)
  const theme = useContext(themeContext)
  return (
    <TouchableOpacity onPress={ pressHandler }>
      <View>
        <Text style={ [ styles.title, { color: theme.mainText } ] }>{ isToday ? '今天' : weekdayMap[date.getDay()] }</Text>
        <Text style={ [ styles.subtitle, { color: theme.subText } ] }>{ `${date.getMonth() + 1}月${date.getDate()}日` }</Text>
      </View>
    </TouchableOpacity>
  )
}




/**
 * 当日待办的内容
 * 为空时返回占位符
 * @params todo 当日的待办列表
 */
const ItemContent = ({ todo = {}, date = new Date(), navigation }) => {
  const todoList = []
  for(let i in todo) {
    todoList.push(todo[i])
  }
  const addItem = () => {
    vibrate(0)
    store.nav.navigate('Add', {
      date
    })
  }
  // 控制出现消失动画
  const ref = useRef()
  const transition = (
    <Transition.Sequence>
      <Transition.Out type="slide-top"/>
      <Transition.Change interpolation="linear"/>
      <Transition.In
        type="scale"
      />
    </Transition.Sequence>
  )
  const EmptyItem = () => (
    <TouchableWithoutFeedback onPress={ addItem }>
      <View style={ {
        height: 80
      } }
      />
    </TouchableWithoutFeedback>
  )
  if (todoList.length === 0) {
    return (
      <EmptyItem />
    )
  } else {
    return (
      <Transitioning.View
        ref={ ref }
        style={ styles.cardContainer }
        transition={ transition }
      >
        { todoList.map((item) => (
          <TodoCard
            info={ item }
            key={ item.id }
            navigation={ navigation }
          />
        )) }
      </Transitioning.View>
    )
  }
}

const TodoItem = ({ item, navigation }) => {
  const [ todo, setTodo ] = useState([ {} ])
  return (
    <Fragment>
      <ItemHeader date={ item.date } />
      <ItemContent
        date={ item.date }
        navigation={ navigation }
        todo={ item.data }
      />
    </Fragment>
  )
}

export default TodoItem

const styles = StyleSheet.create({
  // 主标题
  title: {
    fontSize: 16,
    fontWeight: '700'
  },
  // 副标题
  subtitle: {
    fontSize: 12,
    marginTop: 6
  },
  // 卡片容器
  cardContainer: {
    paddingBottom: 40,
    paddingTop: 10,
    minHeight: 80
  }
})