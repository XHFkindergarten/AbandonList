/**
 * 日历组件
 */
import React, { useState, useRef, Fragment, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native'
import WeekTitle from './weekTitle'
import WeekList from './weekList'
import store from './store'
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import { down1 } from 'src/assets/image'
import { Transitioning, Transition } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler';
// 获取当前手机视窗宽度
const { width } = Dimensions.get('window')

function CalendarBody (){
  const [ isExpanded, setIsExpanded ] = useState(false)
  // const [ isScrolling, setIsScrolling ] = useState(false)
  const TransitionRef = useRef()
  // 控制切换动画ref
  const scrollViewRef = useRef()
  const rePosition = () => {
    Promise.resolve(scrollViewRef.current.scrollTo({ x: width - 60, animated: false }))
  }

  const toggleExpand = useCallback(() => {
    if (isExpanded) {
      // 展开时上划收起
      TransitionRef.current.animateNextTransition()
      setIsExpanded(false)
      store.updateIsExpand(false)
    } else {
      store.clearMonthHeader()
      TransitionRef.current.animateNextTransition()
      setIsExpanded(true)
      store.updateIsExpand(true)
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
  const transition = (
    <Transition.Sequence>
      <Transition.Out durationMs={ 300 }
        type="scale"
      />
      <Transition.Change interpolation="linear" />
      <Transition.In durationMs={ 300 }
        type="fade"
      />
    </Transition.Sequence>
  );
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
          const needGap = store.beginMonthListData[index].length + store.endMonthListData[index].length < 5
          // const _blackItem = 5 - store.beginMonthListData[index].length - store.endMonthListData[index].length
          return (
            <View
              key={ item[0] ? item[0].getTime() : item[6].getTime() }
              style={ { width: width - 60 } }
            >
              {
                index === 1 ? (
                  <Transitioning.View
                    ref={ TransitionRef }
                    transition={ transition }
                  >
                    {
                      isExpanded && store.beginMonthListData[index].map(list => (
                        <WeekList
                          index={ index }
                          key={ list[6] }
                          weekArray={ list }
                        ></WeekList>
                      ))
                    }
                    <WeekList
                      index={ index }
                      weekArray={ item }
                    ></WeekList>
                    { isExpanded && (
                      <Fragment>
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
                            <View style={ { height: 49 } } />
                          )
                        }
                      </Fragment>
                    ) }
                  </Transitioning.View>
                ) : (
                  <View>
                    {
                      isExpanded && store.beginMonthListData[index].map(list => (
                        <WeekList
                          index={ index }
                          key={ list[6] + Math.random() }
                          weekArray={ list }
                        ></WeekList>
                      ))
                    }
                    <WeekList
                      index={ index }
                      weekArray={ item }
                    ></WeekList>
                    { isExpanded && store.endMonthListData[index].map(list => (
                      <WeekList
                        index={ index }
                        key={ list[6] }
                        weekArray={ list }
                      ></WeekList>
                    )) }
                  </View>
                )
              }

            </View>
          )
        }) }
      </ScrollView>
      <TouchableOpacity onPress={ toggleExpand }>
        <View style={ styles.touchBarContainer }>
          <Image source={ down1 }
            style={ {
              height: 20,
              resizeMode: 'contain',
              transform: [ { scaleX: 2 },{ rotate: isExpanded ? '180deg' : '0deg' } ]
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





