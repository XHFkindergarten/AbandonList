/**
 * 日期圆点
 */
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import PropTypes from 'prop-types'
import nativeCalendar from 'src/utils/nativeCalendar'
// import store from './store'
// import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import srcStore from 'src/store';
import { observer } from 'mobx-react';
import moment from 'moment'
import store from './store'
import { TouchableOpacity } from 'react-native-gesture-handler';
import themeContext from 'src/themeContext'


const { width } = Dimensions.get('window')
// 左右间距40, 120为空隙距离
const itemSize = (width - 60 - 120) / 7

function CircleItem({ time, withColor }) {
  const monthNotChange = store.controlMonth === new Date(time).getMonth()
  const [ AnimatedOpacity ] = useState(new Animated.Value(monthNotChange ? 1 : 0))
  // 因为存在组件卸载后setState, 设置一个flag变量防止内存泄露
  const [ _isMount, _setIsMount ] = useState(true)
  useEffect(() => {
    _setIsMount(true)
    return () => {
      _setIsMount(false)
    }
  })
  useEffect(() => {
    if (withColor) {
      Animated.timing(AnimatedOpacity, {
        toValue: 1,
        duration: 1000
      }).start()
    }
  }, [ withColor ])
  // 如果是占位符直接返回空白元素
  // if (!time) {
  //   return (
  //     <View style={ {
  //       width: itemSize + 6,
  //       height: itemSize + 6
  //     } }
  //     />
  //   )
  // }
  // 判断是否是今天
  const date = time.getDate()
  const now = new Date()
  const isToday = now.setHours(0,0,0,0) === time.setHours(0,0,0,0)
  const [ selected, setSelect ] = useState(false)

  const targetDate = srcStore.targetDate

  useEffect(() => {
    if (!selected && new Date(time).setHours(0,0,0,0) === new Date(targetDate).setHours(0,0,0,0)) {
      setSelect(true)
    }
  }, [])

  useEffect(() => {
    if (selected && new Date(time).setHours(0,0,0,0) !== new Date(targetDate).setHours(0,0,0,0)) {
      setSelect(false)
    }
  }, [ targetDate ])

  const [ hasEvent, setHasEvent ] = useState(false)
  useEffect(() => {
    const key = moment(time).format('YYYY-MM-DD')
    if (!(key in nativeCalendar.eventStorage)) {
      setHasEvent(false)
    } else {
      for(let i of Object.keys(nativeCalendar.eventStorage[key])) {
        const item = nativeCalendar.eventStorage[key][i]
        setHasEvent(item.calendar.color)
        return
      }
      setHasEvent(false)
    }
  }, [ nativeCalendar.eventStorage ])


  const handleClick = () => {
    if (store.shift) {
      return
    }
    setSelect(true)
    const lastTarget = srcStore.targetDate
    srcStore.updateTargetDate(time)
    // 更新被选中的圆点
    const date = new Date(time)

    store.controlMonth = date.getMonth()
    date.setDate(date.getDate() - date.getDay())
    // 日历为展开状态时,更新中心轴
    if (store.isExpanded) {
      // 更新日历
      store.updateCenterSunday(date)
    }
    // 更新待办下方待办列表
    if (!lastTarget || new Date(time).setHours(0,0,0,0) !== lastTarget.setHours(0,0,0,0)) {
      srcStore.redirectCenterWeek(time)
    }
  }

  const theme = useContext(themeContext)

  return (
    <TouchableOpacity onPress={ handleClick }>
      <Animated.View style={ [ styles.container, selected && {
        borderColor: theme.themeColor,
        borderWidth: 2,
        borderRadius: (itemSize + 6) / 2
      } ] }
      >
        <View style={ [ {
          width: itemSize,
          height: itemSize,
          borderRadius: itemSize / 2
        }, styles.circle, {
          backgroundColor: isToday ? theme.themeColor : 'transparent'
        } ] }
        >
        </View>
        <View style={ {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          justifyContent: 'center',
          alignItems: 'center'
        } }
        >
          <Text style={ [ styles.text, {
            color: theme.mainText
          } ] }
          >{ date }</Text>
        </View>
        {
          (hasEvent && withColor) && (
            <Animated.View style={ [ styles.eventDot, {
              transform: [ { scale: AnimatedOpacity } ],
              backgroundColor: hasEvent
            } ] }
            />
          )
        }
        <View />
      </Animated.View>
    </TouchableOpacity>
  )
}

export default observer(CircleItem)

export function EmptyItem () {
  return (
    <View style={ {
      width: itemSize + 6,
      height: itemSize + 6
    } }
    />
  )
}

CircleItem.propTypes = {
  width: PropTypes.number,
  num: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    width: itemSize + 6,
    height: itemSize + 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  circleWrapper: {
    borderColor: '#FFF',
    borderWidth: 2,
    borderRadius: (itemSize + 6) / 2
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#FFF',
    fontSize: 12
  },
  eventDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    position: 'absolute',
    right: 5,
    top: 5
  }
})

