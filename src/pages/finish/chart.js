/**
 * 类似Github的表格
 */
import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import dailyStore from '../daily/dailyStore';
import { getMonthDay } from 'src/utils'
import moment from 'moment';
import ThemeContext from 'src/themeContext'

const { width } = Dimensions.get('window')

const contentWidth = width - 40

const generateFlatList = date => {
  // 获取当月的天数
  const monthDays = getMonthDay(date)
  const data = [] // 扁平化数组
  const output = [] // 层次化数组
  // 计算这个月需要多少个占位符
  for(let i = 1;i <= monthDays;i++) {
    date.setDate(i)
    data.push({
      date: new Date(date)
    })
  }
  // 需要的前置占位符个数
  const prevEmptyNum = data[0].date.getDay()
  for(let i = 0;i < prevEmptyNum;i++) {
    data.unshift({
      date: null
    })
  }
  // 需要的后置占位符个数
  const nextEmptyNum = 6 - data[data.length - 1].date.getDay()
  for(let i = 0;i < nextEmptyNum;i++) {
    data.push({
      date: null
    })
  }
  while(data.length) {
    output.push(data.splice(0, 7))
  }
  return output
}




export default function Chart({ monthTime, curItem }) {

  const dailyLog = dailyStore.dailyLog

  // 单个模块组件
  const BlockItem = ({ colWidth, item }) => {
    const theme = useContext(ThemeContext)
    const gapWidth = 100 / flatList.length
    if (item.date) {
      const dayKey = moment(item.date).format('YYYY-MM-DD')
      const dayLog = dailyLog[dayKey] || {}
      const finishTimes = dayLog.finishItems || 0
      const opacity = finishTimes / 30 + 0.4
      return (
        <View style={ [ {
          borderRadius: 6,
          height: colWidth,
          width: colWidth,
          backgroundColor: theme.themeColor,
          marginBottom: gapWidth,
          opacity: opacity
        } ] }
        />
      )
    } else {
      return (
        <View
          style={ {
            height: colWidth,
            width: colWidth,
            marginBottom: gapWidth
          } }
        />
      )
    }
  }
  // 列组件
  const WeekCol = ({ list, colWidth }) => {
    console.log('list', list)
    return (
      <View style={ [ styles.weekCol, {
        width: colWidth
      // backgroundColor: theme.themeColor
      } ] }
      >
        {
          list.map((item, index) => (
            <BlockItem
              colWidth={ colWidth }
              item={ item }
              key={ Math.random() }
            />
          ))
        }
      </View>
    )
  }
  const date = monthTime ? new Date(monthTime) : new Date()
  // 当月的周历二维数组
  const flatList = generateFlatList(date)
  // 每一列的宽度
  const colWidth = (contentWidth - 100) / flatList.length
  return (
    <View style={ styles.container }>
      {
        flatList.map((item, index) => (
          <WeekCol
            colWidth={ colWidth }
            key={ Math.random() }
            list={ item }
          />
        ))
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  weekCol: {
    // height: 300
    alignItems: 'center'
  }
  // blockContainer: {
  //   borderRadius: 6
  // }
})
