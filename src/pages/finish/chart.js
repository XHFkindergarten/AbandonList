/**
 * 类似Github的表格
 */
import React, { useContext, useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import dailyStore from '../daily/dailyStore';
import { getMonthDay } from 'src/utils'
import moment from 'moment/min/moment-with-locales'
import ThemeContext from 'src/themeContext'
import { Transitioning, Transition } from 'react-native-reanimated';
moment.locale()
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

// 计算当月提交最大值
const useMax = () => {
  const [ max, setMax ] = useState(0)
  const updateMax = count => {
    if (count > max) {
      setMax(count)
    }
  }
  return [ max, updateMax ]
}



export default function Chart({ monthTime, curItem }) {

  const [ maxFinish, setMaxFinish ] = useMax(0)

  const dailyLog = dailyStore.dailyLog

  // 单个模块组件
  const BlockItem = ({ colWidth, item }) => {

    const theme = useContext(ThemeContext)

    const gapWidth = 100 / flatList.length
    if (item.date) {
      const temp = moment(item.date)
      const dayKey = temp.format('YYYY-MM-DD')
      const showDate = temp.format('MMMDo')
      // 完成次数
      let finishTimes = 0
      if (curItem.id === '@data_over_view') {
        const dayLog = dailyLog[dayKey] || {}
        finishTimes = dayLog.finishItems || 0
      } else {
        finishTimes = curItem.finishLog[dayKey] || 0
      }

      setMaxFinish(finishTimes)

      // 应该展示的透明度
      const showOpacity = useMemo(() => {
        return maxFinish ? (finishTimes / maxFinish) * 0.9 + 0.1 : 0.1
      }, [ maxFinish ])

      const [ showPop, setPop ] = useState(false)

      const onPressIn = () => {
        setPop(true)
      }

      const onPressOut = () => {
        setPop(false)
      }


      return (
        <View>
          <TouchableWithoutFeedback
            onPressIn={ onPressIn }
            onPressOut={ onPressOut }
          >
            <Animated.View style={ [ {
              borderRadius: 6,
              height: colWidth,
              width: colWidth,
              backgroundColor: theme.themeColor,
              opacity: showOpacity,
              marginBottom: gapWidth,
              zIndex: 60
            } ] }
            />
          </TouchableWithoutFeedback>
          {
            showPop && (
              <View style={ [ {
                backgroundColor: theme.subColor,
                borderRadius: 6,
                position: 'absolute',
                top: -90,
                left: '50%',
                marginLeft: -40,
                width: 80,
                padding: 10,
                zIndex: 90
              } ] }
              >
                <Text style={ {
                  color: '#DBDBDB',
                  fontSize: 12,
                  textAlign: 'center'
                } }
                >{ showDate }</Text>
                <Text style={ {
                  color: '#FFF',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginBottom: 10
                } }
                >{ finishTimes }</Text>
                <View style={ {
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  marginLeft: 2,
                  height: 0,
                  width: 0,
                  borderTopColor: theme.subColor,
                  borderTopWidth: 8,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderLeftWidth: 8,
                  borderRightWidth: 8
                } }
                />
              </View>
            )
          }
        </View>

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


  const ref = useRef()
  const transition = (
    <Transition.Together>
      <Transition.Out
        type="fade"
      />
      <Transition.Change interpolation="linear" />
      <Transition.In type="fade" />
    </Transition.Together>
  )
  useMemo(() => {
    if (ref.current) {
      ref.current.animateNextTransition()
    }
  })
  return (
    <Transitioning.View
      ref={ ref }
      transition={ transition }
    >
      <View style={ styles.container }>
        {
          flatList.map((item, index) => (
            <WeekCol
              colWidth={ colWidth }
              key={ index }
              list={ item }
            />
          ))
        }
      </View>
    </Transitioning.View>
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
