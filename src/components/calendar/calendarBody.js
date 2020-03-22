/**
 * 日历组件
 */
import React, { useState, useRef, Fragment, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, Animated } from 'react-native'
import WeekTitle from './weekTitle'
import WeekList from './weekList'
import store from './store'
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import { down1 } from 'src/assets/image'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { vibrate } from 'src/utils'
// 获取当前手机视窗宽度
const { width } = Dimensions.get('window')

const itemHeight = (width - 180) / 7 + 16
const maxHeight = itemHeight * 6
// let store.isExpanded = false

function CalendarBody ({ AnimatedExpand }){
  // 控制切换动画ref
  const scrollViewRef = useRef()
  const rePosition = () => {
    Promise.resolve(scrollViewRef.current.scrollTo({ x: width - 60, animated: false }))
  }

  const toggleExpand = useCallback(() => {
    // 展开状态时点击无效
    if (store.shift) {
      return
    }
    vibrate(0)
    store.shift = true
    if (store.isExpanded) {
      miniAnimation.start(() => {
        store.isExpanded = false
        // 展开时上划收起
        store.updateIsExpand(false)
        store.shift = false
      })
    } else {
      expandAnimation.start(() => {
        store.isExpanded = true
        store.updateIsExpand(true)
        store.shift = false
      })
      store.clearMonthHeader()
    }
  })
  const scrollEndHandler = (event) => {
    if (event.nativeEvent.targetContentOffset.x === 0) {
      // 左划滑到顶部
      store.scrollBackward()
      rePosition()
    } else if (event.nativeEvent.targetContentOffset.x === event.nativeEvent.layoutMeasurement.width * 2) {
      // 右划滑到底部
      store.scrollForward()
      rePosition()
    }
  }

  const expandAnimation = Animated.timing(AnimatedExpand, {
    toValue: 1,
    durationMs: 1000
  })
  const miniAnimation = Animated.timing(AnimatedExpand, {
    toValue: 0,
    durationMs: 1000
  })

  const animatedHeight = AnimatedExpand.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ itemHeight, maxHeight ]
  })

  const animatedScaleY = AnimatedExpand.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 1, -1 ]
  })

  return (
    <View style={ styles.container }>
      <WeekTitle width={ width } />
      <ScrollView
        contentOffset={ { x: width - 60, y: 0 } }
        horizontal // 因为初始化前面有6页
        onScrollBeginDrag={ () => srcStore.updateTargetDate(null) }
        onScrollEndDrag={ scrollEndHandler }
        pagingEnabled
        ref={ scrollViewRef }
        scrollEnabled
        showsHorizontalScrollIndicator={ false }
        showsVerticalScrollIndicator={ false }
      >
        { store.flatWeekList.map((item, index) => {
          const prevRows = store.beginMonthListData[index].length
          const needGap = prevRows + store.endMonthListData[index].length < 5
          const translateAnimation = AnimatedExpand.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ -itemHeight * prevRows, 0 ]
          })
          return (
            <Animated.View
              key={ item[0] ? item[0].getTime() : item[6].getTime() }
              style={ {
                width: width - 60,
                height: animatedHeight,
                transform: [ { translateY: translateAnimation } ]
              } }
            >
              <Animated.View
                style={ {
                  opacity: AnimatedExpand
                } }
              >
                {
                  store.beginMonthListData[index].map(list => (
                    <WeekList
                      index={ index }
                      key={ list[6] }
                      weekArray={ list }
                    ></WeekList>
                  ))
                }
              </Animated.View>
              <WeekList
                index={ index }
                weekArray={ item }
              ></WeekList>
              <Animated.View
                style={ {
                  opacity: AnimatedExpand
                } }
              >
                {
                  store.endMonthListData[index].map(list => (
                    <WeekList
                      index={ index }
                      key={ list[6] }
                      weekArray={ list }
                    ></WeekList>
                  )) }
                {
                  needGap && (
                    <View style={ { height: itemHeight } } />
                  )
                }
              </Animated.View>
            </Animated.View>
          )
        }) }
      </ScrollView>
      <TouchableOpacity onPress={ toggleExpand }>
        <View style={ styles.touchBarContainer }>
          <Animated.Image source={ down1 }
            style={ {
              height: 20,
              resizeMode: 'contain',
              transform: [ { scaleX: 2 },{ scaleY: animatedScaleY } ]
            } }
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default observer(CalendarBody)

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20
    // paddingBottom: 20
  },
  touchBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  touchBar: {
    backgroundColor: '#2c2c2c',
    height: 6,
    width: 120,
    borderRadius: 3
  }
})




