import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import srcStore from 'src/store'
import dailyStore from 'src/pages/daily/dailyStore'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { star, typeBg, smallArrow } from 'src/assets/image'
import { observer } from 'mobx-react';
import Board from './board'
import finishStore from './store'
import SetModal from './setModal'
import { elipsis } from 'src/utils'
// import moment from 'moment';
import Chart from './chart'
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

  return (
    <ScrollView
      showsHorizontalScrollIndicator={ false }
      showsVerticalScrollIndicator={ false }
      style={ styles.container }
    >
      <View style={ {
        paddingBottom: 120
      } }
      >
        <View>
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
                  <View style={ styles.circle }>
                    <Image source={ index === 0 ? typeBg : star }
                      style={ styles.bigStar }
                    />
                  </View>
                  <Text style={ styles.scrollItemName }>{ elipsis(item.name) }</Text>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <Board item={ curItem }
          monthTime={ curMonthTime }
        />

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
          <View style={ styles.month }>
            <Text style={ styles.monthLabel }>{ `${curMonthTime.getFullYear()} ${MonthNameMap[curMonthTime.getMonth()]}` }</Text>
          </View>
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
        <Chart monthTime={ curMonthTime } />
        <SetModal visible={ showSetting } />
      </View>
    </ScrollView>
  )
}
export default observer(Finish)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40
  },
  scrollItem: {
    width: width - 40,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30
  },
  scrollItemName: {
    color: '#4192D9',
    fontSize: 24,
    marginTop: 20,
    fontWeight: '900',
    textAlign: 'center'
  },

  bigStar: {
    height: 60,
    width: 60,
    resizeMode: 'contain'
  },

  circle: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: '#4192D9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  monthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  month: {
    backgroundColor: '#4192D9',
    height: 50,
    width: 140,
    borderRadius: 14
  },
  monthLabel: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'Century Gothic'
  },
  smallArrow: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  }
})