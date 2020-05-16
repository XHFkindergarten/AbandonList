import React, { useState, useEffect, Fragment, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { elipsis, vibrate } from 'src/utils'
import dailyStore from './dailyStore';
import moment from 'moment'
import { edit } from 'src/assets/image'
import { observer } from 'mobx-react';
import CheckModal from './checkModal'
import themeContext from 'src/themeContext'
import tinycolor from 'tinycolor2'
import { toJS } from 'mobx';

let pressTimeout
const { width } = Dimensions.get('window')
function DailyItem ({ info, level, isSet, selectList, handleSelect, handleUnselect, navigation }) {
  const [ isTouch, setIsTouch ] = useState(false)
  useEffect(() => {
    if (!isTouch) {
      clearTimeout(pressTimeout)
    }
  }, [ isTouch ])

  const theme = useContext(themeContext)

  useEffect(() => {
    if (isSet) {
      closeFinishAnimation.start(() => {
        setShowOperator(true)
        showOperatorAnimation.start()
      })
    } else {
      closeOperatorAnimation.start(() => {
        setShowOperator(false)
        showFinishAnimation.start()
      })
    }
  }, [ isSet ])

  // 是否展示补卡弹框
  const [ showCheck, setShowCheck ] = useState(false)
  const handleCheckYesterDay = () => {
    markItem(info, true, true)
    setShowCheck(false)
  }
  const handleCheckToday = () => {
    markItem(info, false, true)
    setShowCheck(false)
    setFinish(true)
  }


  const [ showOperator, setShowOperator ] = useState(false)
  const [ AnimatedOperatorScale ] = useState(new Animated.Value(0))
  const [ AnimatedFinishScale ] = useState(new Animated.Value(1))
  const showOperatorAnimation = Animated.timing(AnimatedOperatorScale, {
    toValue: 1,
    duration: 200
  })
  const closeOperatorAnimation = Animated.timing(AnimatedOperatorScale, {
    toValue: 0,
    duration: 200,
    delay: level * 100
  })
  const showFinishAnimation = Animated.timing(AnimatedFinishScale, {
    toValue: 1,
    duration: 200
  })
  const closeFinishAnimation = Animated.timing(AnimatedFinishScale, {
    toValue: 0,
    duration: 200,
    delay: level * 100
  })
  const [ AnimatedScale ] = useState(new Animated.Value(1))
  const ScaleMiniAnimation = Animated.timing(AnimatedScale, {
    toValue: 0,
    duration: 2000
  })
  const ScaleMaxAnimation = Animated.spring(AnimatedScale, {
    toValue: 1
  })
  const _touchEndHandler = () => {
    ScaleMiniAnimation.stop()
    ScaleMaxAnimation.start()
    setIsTouch(false)
  }
  const [ finish, setFinish ] = useState(!!info.finish)
  // 按压足够时间，设置状态为完成
  const toggleFinish = () => {
    if (!finish) {
      // 检查昨天是否完成了这项任务
      const yesterdayFinish = dailyStore.checkYesterday(info)
      if (!yesterdayFinish) {
        // 如果昨天未完成，提示是否需要补卡
        setShowCheck(true)
        return
      }
      markItem(info, false, true)
    } else {
      markItem(info, false, false)
    }
    setFinish(!finish)
  }

  // 标记 今天/昨天 为 完成/未完成
  const markItem = (info, yesterday = false, finish = true) => {
    const day = new Date()
    if (yesterday) {
      day.setDate(day.getDate() - 1)
    }
    const dayKey = moment(day).format('YYYY-MM-DD')
    finish ? dailyStore.handleFinish(info, dayKey) : dailyStore.handleCancel(info)
    const temp = (dayKey in dailyStore.dailyLog) ? (
      dailyStore.dailyLog[dayKey].finishItems + (finish ? 1 : -1)
    ) : (
      finish ? 1 : 0
    )
    dailyStore.updateDailyLogItem({
      date: day,
      finishItems: temp
    })
  }

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => !isSet,
    onPanResponderGrant: () => {
      setIsTouch(true)
      ScaleMiniAnimation.start()
      clearTimeout(pressTimeout)
      pressTimeout = setTimeout(() => {
        vibrate()
        ScaleMiniAnimation.stop()
        toggleFinish()
        ScaleMaxAnimation.start()
      }, 400)
    },
    onPanResponderRelease: _touchEndHandler,
    onPanResponderTerminate:  _touchEndHandler
  })

  const isSelect = selectList.has(info.id)

  const handlePressItem = () => {
    if (isSelect) {
      handleUnselect(info.id)
    } else {
      handleSelect(info.id)
    }
  }

  // 点击编辑卡片
  const handleEditItem = () => {
    navigation.navigate('AddDaily', {
      info
    })
  }


  return (
    <View>
      <Animated.View style={ [ styles.container, {
        backgroundColor: info.color || theme.themeColor,
        transform: [ { scale: AnimatedScale } ]
      }, isSelect && {
        borderColor: '#FFF',
        borderWidth: 4
      } ] }
      { ..._panResponder.panHandlers }
      >
        <View style={ styles.leftContent }>
          <Text style={  styles.title }>{ elipsis(info.name, 50) }</Text>
        </View>
        <View style={ styles.rightContent }>
          {
            !showOperator && (
              <Fragment>
                <Animated.Text style={ [ styles.count, {
                  transform: [ { scale: AnimatedFinishScale } ]
                } ] }
                >{ info.finishTimes }</Animated.Text>
                <Animated.View style={ [ styles.finishCircle , {
                  transform: [ { scale: AnimatedFinishScale } ],
                  shadowColor: '#000',
                  shadowOpacity: 0.6,
                  shadowOffset: { width: 3, height: 3 },
                  shadowRadius: 3,
                  backgroundColor: info.finish ? '#FFF' : 'transparent',
                  borderColor: '#FFF',
                  borderWidth: 2
                } ] }
                ></Animated.View>
              </Fragment>
            )
          }
        </View>
        <View style={ styles.absoluteView }>
          <TouchableWithoutFeedback onPress={ handlePressItem }>
            <View style={ { flex: 1 } }></View>
          </TouchableWithoutFeedback>
        </View>
        {
          showOperator && (
            <Animated.View style={ {
              transform: [ { scale: AnimatedOperatorScale } ],
              position: 'absolute',
              right: 5,
              bottom: 5,
              padding: 10
            } }
            >
              <TouchableOpacity onPress={ handleEditItem }>
                <Image source={ edit }
                  style={ styles.edit }
                />
              </TouchableOpacity>
            </Animated.View>
          )
        }
      </Animated.View>
      <CheckModal onToday={ handleCheckToday }
        onYesterday={ handleCheckYesterDay }
        setVisible={ setShowCheck }
        visible={ showCheck }
      />
    </View>

  )
}

export default observer(DailyItem)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width / 2 - 20 - 10,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'transparent'
  },
  leftContent: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15
  },
  rightContent: {
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 50,
    paddingBottom: 15,
    paddingTop: 10
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5
  },
  subTitle: {
    color: '#dbdbdb',
    fontSize: 14
  },
  count: {
    color: '#FFF',
    fontSize: 30,
    fontFamily: 'Century Gothic',
    alignSelf: 'flex-end',
    marginRight: 15
  },
  finishCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignSelf: 'center'
  },
  edit: {
    height: 24,
    width: 24
  },
  absoluteView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
})