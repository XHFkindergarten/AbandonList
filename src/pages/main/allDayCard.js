/**
 * 待办项卡片item
 */
import React, { useState, useEffect, useContext } from 'react';
import CardExpandModal from './cardExpandModal'
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, Animated } from 'react-native';
import { observer } from 'mobx-react';
import srcStore from 'src/store'
import { elipsis } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'
import themeContext from 'src/themeContext'

const { width } = Dimensions.get('window')

function AllDayCard({ info, navigation }) {
  const [ expand, setExpand ] = useState(false)

  const [ animateOpacity ] = useState(new Animated.Value(1))
  const [ animateHeight ] = useState(new Animated.Value(60))

  // 点击展开卡片的完成按钮
  const handleExpandFinish = () => {
    setExpand(false)
    nativeCalendar.removeEvent(info, false).then(() => {
      setTimeout(() => {
        // srcStore.refreshTodoList(srcStore.startDay)
        Animated.spring(animateOpacity, { toValue: 0 }).start(() => {
          Animated.spring(animateHeight, { toValue: 0 }).start()
        })
      }, 600)
    })
  }
  // 点击展开卡片的删除按钮
  const handleExpandAbandon = () => {
    setExpand(false)
    nativeCalendar.removeEvent(info, true).then(() => {
      setTimeout(() => {
        // srcStore.refreshTodoList(srcStore.startDay)
        Animated.spring(animateOpacity, { toValue: 0 }).start(() => {
          Animated.spring(animateHeight, { toValue: 0 }).start()
        })
      }, 600)
    })
  }

  // 点击展开卡片的编辑功能
  const handleExpandSetting = () => {
    setExpand(false)
    navigation.navigate('Add', {
      info
    })
  }

  const theme = useContext(themeContext)

  const onPress = () => {
    setExpand(true)
  }

  return (
    <TouchableOpacity onPress={ onPress }>
      <Animated.View style={ [ styles.container, {
        opacity: animateOpacity,
        maxHeight: animateHeight
      } ] }
      >
        <View style={ [ styles.circle, {
          backgroundColor: info.calendar.color
        } ] }
        />
        <Text style={ [
          styles.cardTitle, {
            maxWidth: width - 20,
            color: theme.pureText
          }
        ] }
        >{ elipsis(info.title, 50) + '  全天' }</Text>
      </Animated.View>
      { expand &&
      <CardExpandModal
        handleAbandon={ handleExpandAbandon }
        handleFinish={ handleExpandFinish }
        handleSetting={ handleExpandSetting }
        info={ info }
        setVisible={ setExpand }
      /> }
    </TouchableOpacity>
  )

}

export default observer(AllDayCard)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 15
  },
  circle: {
    marginTop: 3,
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 6
  }
})
