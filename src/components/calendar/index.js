import React, { createRef, Component, useState, useRef } from 'react';
import CalendarBody from './calendarBody'
import MonthName from './monthName'
import { View, StyleSheet, Animated } from 'react-native';
import store from './store'
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import { Transitioning, Transition } from 'react-native-reanimated';
function Calendar() {
  const [ showCanlendar, setShowCalendar ] = useState(false)
  const ref = useRef()
  // calendarRef = createRef()

  const handlePressMonthName = () => {
    // 清空选中日期
    srcStore.updateTargetDate(null)
    ref.current.animateNextTransition()
    // if (showCanlendar) {
    // } else {

    // }
    setShowCalendar(!showCanlendar)
  }

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="scale" />
      <Transition.Change interpolation="linear" />
      <Transition.In delayMs={ 300 }
        type="scale"
      />
    </Transition.Sequence>
  )

  return (
    <View style={ styles.container }>
      <MonthName
        currentMonth={ store.currentMonth }
        onPress={ handlePressMonthName }
        showCanlendar={ showCanlendar }
      />
      <Transitioning.View
        ref={ ref }
        transition={ transition }
      >
        { showCanlendar && <CalendarBody /> }
      </Transitioning.View>
    </View>
  )
}
export default observer(Calendar)

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#111',
    // paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start'
  }
})
