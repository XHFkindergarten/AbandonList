import React, { useState, Fragment, useRef, useContext, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, PanResponder } from 'react-native';
import store from 'src/store'
import TodoCard from './todoCard'
import { vibrate } from 'src/utils'
import themeContext from 'src/themeContext'
import AllDayCard from './allDayCard'
import nativeCalendar from 'src/utils/nativeCalendar'


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
    if (nativeCalendar.visibleGroupIds.length === 0 ) {
      store.globalNotify({
        title: 'Warn',
        content: '暂无可用的日历分组,请在[数据总览]->[设置]中创建一个日历分组'
      })
    } else {
      vibrate(0)
      store.nav.navigate('Add', {
        date
      })
    }
  }
  const today = new Date()
  // 是否是今天
  const isToday = today.setHours(0,0,0,0) === date.setHours(0,0,0,0)
  const theme = useContext(themeContext)
  return (
    <TouchableOpacity onPress={ pressHandler }>
      <View style={ {
        marginBottom: 10
      } }
      >
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
    if (nativeCalendar.visibleGroupIds.length === 0 ) {
      store.globalNotify({
        title: 'Warn',
        content: '暂无可用的日历分组,请在[数据总览]->[设置]中创建一个日历分组'
      })
    } else {
      vibrate(0)
      store.nav.navigate('Add', {
        date
      })
    }
  }

  // useEffect(() => {
  //   setRemovedList([])
  // }, todo)

  const EmptyItem = () => (
    <TouchableWithoutFeedback onPress={ addItem }>
      <View style={ {
        height: 80
      } }
      />
    </TouchableWithoutFeedback>
  )

  // const [ removedList, setRemovedList ] = useState([])
  // const handleRemoveMe = id => {
  //   setRemovedList([
  //     ...removedList,
  //     id
  //   ])
  // }

  if (todoList.length === 0) {
    return (
      <EmptyItem />
    )
  } else {
    return (
      <View style={ {
        minHeight: 80
      } }
      >
        { todoList.map((item) => {
          if (item.allDay) {
            return (
              <AllDayCard
                info={ item }
                key={ item.id }
                navigation={ navigation }
                // remove={ handleRemoveMe }
              />
            )
          } else {
            return (
              <TodoCard
                info={ item }
                key={ item.id }
                navigation={ navigation }
                // remove={ handleRemoveMe }
              />
            )
          }
        }) }
      </View>
    )
  }
}

const TodoItem = ({ item, navigation }) => {
  // const [ todo, setTodo ] = useState([ {} ])
  return (
    <View style={ {
      marginTop: 10
    } }
    >
      <ItemHeader date={ item.date } />
      <ItemContent
        date={ item.date }
        navigation={ navigation }
        todo={ item.data }
      />
    </View>
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