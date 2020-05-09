/**
 * Finish页面 -> 数据面板
 */
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, PixelRatio, View, Text } from 'react-native';
import moment from 'moment';
import themeContext from 'src/themeContext'
import { observer } from 'mobx-react';




let timer1, timer2, timer3
function Board({ item, monthTime }) {
  useEffect(() => {
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])
  // useEffect(() => {

  // }, [ monthTime ])
  useEffect(() => {
    AnimatedNum(monthFinishTimes, showMonth, setShowMonth, timer1)
    AnimatedNum(maxContinueTimes, showContinue, setShowContinue, timer2)
    AnimatedNum(finishTimes, showAll, setShowAll, timer3)
  }, [ item, monthTime ])
  const monthKey = moment(monthTime).format('YYYY-MM')
  const isOverView = item.id === '@data_over_view'
  let monthFinishTimes, maxContinueTimes, finishTimes
  if (isOverView) {
    monthFinishTimes = item.data.monthList[monthKey] ? item.data.monthList[monthKey].finishItems : 0
    maxContinueTimes = item.data.monthList[monthKey] ? item.data.monthList[monthKey].finishDays : 0
    finishTimes = item.data.allFinishTimes || 0
  } else {
    monthFinishTimes = 0
    for(let i of Object.keys(item.finishLog)) {
      if (i.startsWith(monthKey)) {
        monthFinishTimes += item.finishLog[i]
      }
    }
    maxContinueTimes = item.maxContinueTimes
    finishTimes = item.finishTimes
  }



  // 需要展示的三项数据
  const [ showMonth, setShowMonth ] = useState(0)
  const [ showContinue, setShowContinue ] = useState(0)
  const [ showAll, setShowAll ] = useState(0)
  /**
   * 数字变化的动画效果
   * target 目标值
   * cur state值
   * setCur setState方法
   * timer 计时器ID
   */
  const AnimatedNum = (target, cur, setCur, timer) => {
    let temp = cur
    if (target === cur) {
      return
    }
    const gapTime = 200 / Math.abs(target - cur)
    timer = setInterval(() => {
      const distance = target - temp
      if (distance > 0) {
        if (distance > 100) {
          temp += 10
        } else if (distance > 50) {
          temp += 6
        } else if (distance > 20) {
          temp += 2
        } else {
          temp++
        }
      } else if (distance < 0) {
        if (distance < -100) {
          temp -= 10
        } else if (distance < -50) {
          temp -= 6
        } else if (distance < -20) {
          temp -= 2
        } else {
          temp--
        }
      }
      setCur(temp)
      if (temp === target) {
        clearInterval(timer)
      }
    }, gapTime)
  }

  const theme = useContext(themeContext)

  return (
    <View style={ [ styles.dataSummary, {
      borderTopColor: theme.gapLine,
      borderBottomColor: theme.gapLine
    } ] }
    >
      <View style={ styles.dataItem }>
        <Text style={ [ styles.dataNum, { color: theme.mainText } ] }>{ showMonth }</Text>
        <Text style={ [ styles.dataExplain, { color: theme.mainText } ] }>{ '本月完成次数' }</Text>
      </View>
      <View style={ styles.dataItem }>
        <Text style={ [ styles.dataNum, { color: theme.mainText } ] }>{ showContinue }</Text>
        <Text style={ [ styles.dataExplain, { color: theme.mainText } ] }>{ isOverView ? '本月处理天数' : '连续完成天数' }</Text>
      </View>
      <View style={ styles.dataItem }>
        <Text style={ [ styles.dataNum, { color: theme.mainText } ] }>{ showAll }</Text>
        <Text style={ [ styles.dataExplain, { color: theme.mainText } ] }>累计完成次数</Text>
      </View>
    </View>
  )
}

export default observer(Board)

const styles = StyleSheet.create({

  dataSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 80,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    paddingTop: 30,
    paddingBottom: 30,
    marginLeft: 20,
    marginRight: 20
  },
  dataItem: {
    alignItems: 'center'
  },
  dataNum: {
    fontSize: 40,
    fontFamily: 'ADAM.CG PRO',
    fontWeight: '900'
  },
  dataExplain: {
    marginTop: 6,
    fontSize: 12
  }
})