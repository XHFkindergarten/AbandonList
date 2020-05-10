import React, { useContext, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import ThemeContext from 'src/themeContext'
import { observer } from 'mobx-react';
import store from './store'
import moment from 'moment';
import Svgs from 'src/assets/svg'
import FinishCard from './finishCard'
import { Transitioning, Transition } from 'react-native-reanimated'
const { height } = Dimensions.get('window')
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

  const isCurrentMonth = new Date(monthTime).getMonth() === new Date().getMonth()

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
        hisList.length ? (hisList.map((item, index) => (
          <FinishCard
            info={ item }
            key={ item.id }
            level={ index }
            monthTime={ monthTime }
          />
        ))) : (
          isCurrentMonth && (
            <View style={ styles.emptyContainer }>
              <Svgs.Cookie height={ 100 }
                width={ 100 }
              />
              <Text style={ [ styles.emptyText, {
                color: theme.mainText
              } ] }
              >
                当月无卡片数据，请在主页创建一张卡片并结束卡片状态
              </Text>
            </View>
          )
        )
      }
    </Transitioning.View>
  )
}

export default observer(HistoryList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    minHeight: height - 160
  },
  emptyContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  emoji: {
    height: 100,
    width: 100,
    marginBottom: 60
  },
  handStop: {
    position: 'absolute',
    left: 40,
    top: 60,
    height: 80,
    width: 80
  },
  emptyText: {
    width: 300,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20
  }
})