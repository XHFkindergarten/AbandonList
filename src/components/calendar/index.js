import React, { createRef, Component, useState, useRef, useContext } from 'react';
import CalendarBody from './calendarBody'
import MonthName from './monthName'
import { View, StyleSheet, Animated } from 'react-native';
import store from './store'
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated';
import themeContext from 'src/themeContext'


function Calendar() {

  const centerSunday = store.centerSunday
  const calYear = new Date(centerSunday).getFullYear()
  const curYear = new Date().getFullYear()
  const showYear = calYear !== curYear ? calYear : ''

  const [ showCanlendar, setShowCalendar ] = useState(false)

  const handlePressMonthName = () => {
    // 清空选中日期
    setShowCalendar(!showCanlendar)
  }
  const theme = useContext(themeContext)

  // 控制高度展开动画
  const [ AnimatedExpand ] = useState(new Animated.Value(0))

  // eslint-disable-next-line
  const needRefresh = srcStore.lzk

  return (
    <View style={ [ styles.container, {
      backgroundColor: theme.mainColor
    } ] }
    >
      <MonthName
        AnimatedExpand={ AnimatedExpand }
        currentMonth={ store.currentMonth }
        onPress={ handlePressMonthName }
        showCanlendar={ showCanlendar }
        showYear={ showYear }
      />
      <View style={ {
        maxHeight: showCanlendar ? 500 : 0
      } }
      >
        <CalendarBody
          AnimatedExpand={ AnimatedExpand }
        />
      </View>
    </View>
  )
}
export default observer(Calendar)

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start'
  }
})
