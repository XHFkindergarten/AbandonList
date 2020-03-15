/**
 * Finish页面 -> 数据面板
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, PixelRatio, View, Text } from 'react-native';
import moment from 'moment';
let timer1, timer2, timer3
export default function Board({ item, monthTime }) {
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
    monthFinishTimes = item.finishLog[monthKey] || 0
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
      if (target > temp) {
        temp++
      } else {
        temp--
      }
      setCur(temp)
      if (temp === target) {
        clearInterval(timer)
      }
    }, gapTime)
  }
  return (
    <View style={ styles.dataSummary }>
      <View style={ styles.dataItem }>
        <Text style={ styles.dataNum }>{ showMonth }</Text>
        <Text style={ styles.dataExplain }>{ '本月完成次数' }</Text>
      </View>
      <View style={ styles.dataItem }>
        <Text style={ styles.dataNum }>{ showContinue }</Text>
        <Text style={ styles.dataExplain }>{ isOverView ? '本月处理天数' : '连续完成天数' }</Text>
      </View>
      <View style={ styles.dataItem }>
        <Text style={ styles.dataNum }>{ showAll }</Text>
        <Text style={ styles.dataExplain }>累计完成次数</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  dataSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 80,
    borderTopColor: '#999',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#999',
    borderBottomWidth: 1 / PixelRatio.get(),
    paddingTop: 30,
    paddingBottom: 30
  },
  dataItem: {
    alignItems: 'center'
  },
  dataNum: {
    color: '#DBDBDB',
    fontSize: 40,
    fontFamily: 'ADAM.CG PRO',
    // fontFamily: 'Century Gothic',
    fontWeight: '900'
  },
  dataExplain: {
    marginTop: 6,
    fontSize: 12,
    color: '#FFF'
  }
})