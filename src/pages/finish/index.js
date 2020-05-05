import React, { useState, useCallback, useEffect, useContext, useRef, Fragment } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Animated, Dimensions, Image, SafeAreaView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import srcStore from 'src/store'
import dailyStore from 'src/pages/daily/dailyStore'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { wallpaper, smallArrow, cards, chart } from 'src/assets/image'
import { observer } from 'mobx-react';
import Board from './board'
import finishStore from './store'
import SetModal from './setModal'
import { elipsis, isNewIPhone } from 'src/utils'
import Chart from './chart'
import themeContext from 'src/themeContext'
import HistoryList from './historyList'
import { Transitioning, Transition } from 'react-native-reanimated'
import AsyncStorage from '@react-native-community/async-storage';


const { width, height } = Dimensions.get('window')

let notifyTimeout

const MonthNameMap = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May.',
  'Jun.',
  'Jul.',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.'
]


function Finish({ navigation }) {
  // 植入强制刷新
  // eslint-disable-next-line
  const needRefresh = srcStore.lzk

  // eslint-disable-next-line
  const [ _isMount, _setIsMount ] = useState(false)
  useEffect(() => {
    _setIsMount(true)
    AsyncStorage.getItem('@ever_finish_tip_show').then(res => {
      if (!res) {
        notifyTimeout = setTimeout(() => {
          srcStore.globalNotify('滑动上方蓝色区域可以查看不同事项每个月的完成情况^ ^.')
        }, 600)

        AsyncStorage.setItem('@ever_finish_tip_show', 'whatever')
      }
    })
    return () => {
      _setIsMount(false)
      clearTimeout(notifyTimeout)
    }
  }, [])
  // 控制底部路由
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      srcStore.updateBottomNavName('Finish')
      return () => {
        // Do something when the screen is unfocused
      }
    }, [])
  )

  const dataOverView = dailyStore.dataOverView
  const dailyMap = dailyStore.dailyList
  const dailyList = []
  for(let key of Object.keys(dailyMap)) {
    dailyList.push(dailyMap[key])
  }
  const overViewId = '@data_over_view'
  // 第一项设置为数据总览
  dailyList.unshift({
    id: overViewId,
    name: '数据总览',
    data: dataOverView
  })

  const [ curItem, setCurItem ] = useState(dailyList[0])

  // 横向scrollView滚动结束时控制数据面板改变
  const handleScrollEnd = event => {
    const itemWidth = event.nativeEvent.layoutMeasurement.width
    const offsetX =  event.nativeEvent.targetContentOffset.x
    const index = Math.ceil(offsetX / itemWidth)
    setCurItem(dailyList[index])

    if (index !== 0 && toggleCards) {
      ref.current.animateNextTransition()
      setToggle(false)
    }
  }

  // 控制当前显示的月份时间
  const now = new Date()
  // const defaultMonthKey = moment(now).format('YYYY-MM')
  const [ curMonthTime, setCurMonthTime ] = useState(now)

  const handlePrevMonth = () => {
    const prevMonth = new Date(curMonthTime)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurMonthTime(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(curMonthTime)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurMonthTime(nextMonth)
  }

  // 显示设置弹框
  const [ showSetting, setShowSetting ] = useState(false)
  const isSet = finishStore.isSet
  useEffect(() => {
    setShowSetting(isSet)
  }, [ isSet ])

  const theme = useContext(themeContext)

  const newIPhone = isNewIPhone()

  // 是否显示卡片数据
  const [ toggleCards, setToggle ] = useState(false)

  const handlePressMonthName = () => {
    if (curItem.id === overViewId) {
      ref.current.animateNextTransition()
      setToggle(!toggleCards)
    }
  }

  const ref = useRef()
  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  )

  const [ moveY ] = useState(new Animated.Value(0))

  const handleOnScroll = event => {
    const dy = event.nativeEvent.contentOffset.y
    moveY.setValue(dy)
  }

  const AnimatedScale = moveY.interpolate({
    inputRange: [ -41, -40, 0, 1 ],
    outputRange: [ 1.2, 1.2, 1, 1 ]
  })

  const titleHeight = moveY.interpolate({
    inputRange: [ -1, 0, 140, 141 ],
    outputRange: [ 160, 160, 20, 20 ]
  })

  const titleOpacity = moveY.interpolate({
    inputRange: [ 39, 40, 100, 101 ],
    outputRange: [ 1, 1, 0, 0 ]
  })

  const AnimatedPadding = moveY.interpolate({
    inputRange: [ -1, 0, 100, 101 ],
    outputRange: [ 30, 30, 100, 100 ]
  })

  const AnimatedOpacity = moveY.interpolate({
    inputRange: [ 99, 100, 140, 141 ],
    outputRange: [ 0, 0, 1, 1 ]
  })

  const scrollRef = useRef()
  // 松手时在40-140范围内自动收起
  const handleRelease = event => {
    const y = event.nativeEvent.contentOffset.y
    if (y >= 40 && y < 140) {
      Animated.spring(moveY, { toValue: 140 }).start()
      scrollRef.current.scrollTo({ y: 140 })
    }
  }

  return (
    <Fragment>
      <ImageBackground
        source={ wallpaper }
        style={ {
          paddingTop: newIPhone ? 44 : 0,
          width: width,
          height: height
        } }
      >
        <Animated.View style={ {
          marginTop: titleHeight,
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: theme.mainColor,
          paddingTop: AnimatedPadding
        } }
        >
          <Animated.Text style={ [ styles._title, {
            opacity: AnimatedOpacity,
            lineHeight: 100,
            color: theme.themeColor,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          } ] }
          >{ curItem.name }</Animated.Text>
          <ScrollView
            contentContainerStyle={ {
              paddingTop: 30,
              paddingBottom: 100,
              minHeight: height
            } }
            onScroll={ handleOnScroll }
            onScrollEndDrag={ handleRelease }
            ref={ scrollRef }
            scrollEventThrottle={ 1 }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            style={ {
              // paddingTop: 20
            } }
          >
            <View style={ styles.monthContainer }>
              <TouchableWithoutFeedback
                onPress={ handlePrevMonth }
                style={ {
                  padding: 20
                } }
              >
                <Image source={ smallArrow }
                  style={ [ styles.smallArrow, {
                    transform: [ { rotate: '180deg' } ]
                  } ] }
                />
              </TouchableWithoutFeedback>


              <TouchableOpacity onPress={ handlePressMonthName }>
                <View style={ [ styles.month, { backgroundColor: theme.themeColor } ] }>
                  <Text style={ [ styles.monthLabel, { color: theme.mainText } ] }>{ `${curMonthTime.getFullYear()} ${MonthNameMap[curMonthTime.getMonth()]}` }</Text>

                  <Image source={ !toggleCards ? chart : cards }
                    style={ styles.toggleIcon }
                  />
                </View>
              </TouchableOpacity>

              <TouchableWithoutFeedback
                onPress={ handleNextMonth }
                style={ {
                  padding: 20
                } }
              >
                <Image source={ smallArrow }
                  style={ styles.smallArrow }
                />
              </TouchableWithoutFeedback>
            </View>
            <Board item={ curItem }
              monthTime={ curMonthTime }
            />
            <Transitioning.View
              ref={ ref }
              transition={ transition }
            >
              {
                toggleCards ? (
                  <HistoryList monthTime={ curMonthTime } />
                ) : (
                  <Chart
                    curItem={ curItem }
                    monthTime={ curMonthTime }
                  />
                )
              }
            </Transitioning.View>
          </ScrollView>
        </Animated.View>
      </ImageBackground>
      <Animated.View style={ {
        position: 'absolute',
        top: newIPhone ? 44 : 0,
        left: 0,
        right: 0,
        height: titleHeight
      } }
      >
        <ScrollView
          horizontal
          onScrollEndDrag={ handleScrollEnd }
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={ false }
          showsVerticalScrollIndicator={ false }
        >
          {
            dailyList.map((item, index) => (
              <View key={ item.id }
                style={ styles.scrollItem }
              >
                <Animated.Text style={ [ styles.scrollItemName, {
                  opacity: titleOpacity,
                  backgroundColor: theme.themeColor,
                  color: theme.mainText,
                  transform: [ { scale: AnimatedScale } ]
                } ] }
                >{ elipsis(item.name) }</Animated.Text>
              </View>
            ))
          }
        </ScrollView>
      </Animated.View>
      <SetModal visible={ showSetting } />
    </Fragment>
  )
}
export default observer(Finish)

const styles = StyleSheet.create({
  scrollItem: {
    // height: '100%',
    flex: 1,
    // height: 160,
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  _title: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center'
  },
  scrollItemName: {
    fontSize: 24,
    // marginTop: 20,
    fontWeight: '900',
    textAlign: 'center'
  },

  monthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  },
  month: {
    height: 50,
    // width: 140,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  monthLabel: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'Century Gothic'
  },
  smallArrow: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  toggleIcon: {
    height: 22,
    width: 22,
    marginLeft: 5
  }
})