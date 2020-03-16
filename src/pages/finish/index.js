import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
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
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Transitioning, Transition } from 'react-native-reanimated'
const Stack = createStackNavigator()



const { width } = Dimensions.get('window')


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
  const [ _isMount, _setIsMount ] = useState(false)
  useEffect(() => {
    _setIsMount(true)
    return () => {
      _setIsMount(false)
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
  // 第一项设置为数据总览
  dailyList.unshift({
    id: '@data_over_view',
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
    ref.current.animateNextTransition()
    setToggle(!toggleCards)
  }

  const ref = useRef()
  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  )

  return (
    <View style={ { flex: 1, backgroundColor: theme.themeColor } }>
      <ImageBackground source={ wallpaper }
        style={ {
          width: width,
          height: 160,
          paddingTop: newIPhone ? 44 : 0
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
                <Text style={ [ styles.scrollItemName, {
                  backgroundColor: theme.themeColor,
                  color: theme.mainText
                } ] }
                >{ elipsis(item.name) }</Text>
              </View>
            ))
          }
        </ScrollView>
      </ImageBackground>
      <ScrollView
        contentContainerStyle={ {
          paddingTop: 30
        } }
        scrollEventThrottle={ 200 }
        showsHorizontalScrollIndicator={ false }
        showsVerticalScrollIndicator={ false }
        style={ {
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: theme.mainColor
        } }
      >
        <View style={ {
          paddingBottom: 120
        } }
        >

          <View style={ {
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1
          } }
          >
            { /* 月份选择器 */ }
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
                toggleCards ? <HistoryList monthTime={ curMonthTime } /> : <Chart monthTime={ curMonthTime } />
              }
            </Transitioning.View>


          </View>
          <SetModal visible={ showSetting } />
        </View>
      </ScrollView>

    </View>


  )
}
export default observer(Finish)

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // paddingTop: 20,
  //   // paddingLeft: 20,
  //   // paddingRight: 20,
  //   paddingBottom: 40
  // },
  scrollItem: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollItemName: {
    fontSize: 28,
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