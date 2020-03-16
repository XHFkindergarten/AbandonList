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
  const [ showCanlendar, setShowCalendar ] = useState(false)
  const ref = useRef()
  // calendarRef = createRef()

  const handlePressMonthName = () => {
    // 清空选中日期
    srcStore.updateTargetDate(null)
    ref.current.animateNextTransition()
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

  const theme = useContext(themeContext)

  return (
    <View style={ [ styles.container, {
      backgroundColor: theme.mainColor
    } ] }
    >
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start'
  }
})
