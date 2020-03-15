/**
 * 图表组件
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native'
import { observer } from 'mobx-react';
import dailyStore from '../daily/dailyStore';
import { getMonthDay } from 'src/utils'
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
// 生成柱状数据
const RenderItem = ({ item, max }) => {
  const [ _isMount, _setIsMount ] = useState(false)
  useEffect(() => {
    _setIsMount(true)
    return () => {
      _setIsMount(false)
    }
  })
  const [ showHeight ] = useState(new Animated.Value(0))
  useEffect(() => {
    Animated.spring(showHeight, {
      toValue: height
    }).start()
  }, [ item, max ])
  let height
  if (max === 0) {
    height = 0
  } else {
    height = item.number * 180 / max
  }
  return (
    <View style={ styles.itemContainer }>

      <Text style={ styles.chartTopLabel }>{ item.number ? item.number : '' }</Text>

      <Animated.View style={ [ styles.chartItem, {
        height: showHeight
      } ] }
      />
      <Text style={ styles.chartLabel }>{ item.date.slice(5, 10) }</Text>
    </View>
  )
}

function Chart({ monthTime }) {
  const dailyLog = dailyStore.dailyLog
  const data = []
  const date = monthTime ? new Date(monthTime) : new Date()
  // 获取当月的天数
  const monthDays = getMonthDay(date)
  // 获取月份数字
  // const monthNum = date.getMonth() + 1
  let maxNumber = -1
  for(let i = 1;i <= monthDays;i++) {
    date.setDate(i)
    const key = moment(date).format('YYYY-MM-DD')
    const number = dailyLog[key] ? dailyLog[key].finishItems : 0
    // 获取数值最大的一个数据
    if (number > maxNumber) {
      maxNumber = number
    }
    data.push({
      date: key,
      number
    })
  }

  return (
    <ScrollView
      horizontal
      scrollEnabled
      showsHorizontalScrollIndicator={ false }
      showsVerticalScrollIndicator={ false }
      style={ styles.container }
    >
      {
        data.map((item, index) => (
          <RenderItem
            item={ item }
            // key={ item.date }
            key={ index }
            max={ maxNumber }
          />
        ))
      }
    </ScrollView>
  )
}

export default observer(Chart)

const styles = StyleSheet.create({
  container: {
    height: 260
    // flex: 1
  },
  itemContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  chartItem: {
    backgroundColor: '#4192D9',
    width: 30,
    marginLeft: 16,
    marginRight: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  chartLabel: {
    marginTop: 5,
    color: '#FFF',
    fontSize: 12
  },
  chartTopLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5
  }
})