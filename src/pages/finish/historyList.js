import React, { useContext, useRef, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemeContext from 'src/themeContext'
import { observer } from 'mobx-react';
import store from './store'
import moment from 'moment';
import FinishCard from './finishCard'
import { Transitioning, Transition } from 'react-native-reanimated'

function HistoryList({ monthTime }) {

  const theme = useContext(ThemeContext)

  const monthKey = moment(new Date(monthTime)).format('YYYY-MM')

  // 获取当月的完成/删除事项
  let hisListMap = store.historyList[monthKey] || {}
  const hisList = []
  for(let i in hisListMap) {
    hisList.push(hisListMap[i])
  }
  hisList.reverse()

  const ref = useRef()
  useMemo(() => {
    if (ref.current) {
      ref.current.animateNextTransition()
    }
  })

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  )
  return (
    <Transitioning.View
      ref={ ref }
      style={ styles.container }
      transition={ transition }
    >
      {
        hisList.map((item, index) => (
          <FinishCard
            info={ item }
            key={ item.id }
            level={ index }
          />
        ))
      }
    </Transitioning.View>
  )
}

export default observer(HistoryList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center'
    // justifyContent: 'center'
    // alignItems: 'center'
  }
})