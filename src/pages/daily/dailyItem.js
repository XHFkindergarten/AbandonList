import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { elipsis, vibrate } from 'src/utils'
import dailyStore from './dailyStore';
import moment from 'moment'
import { edit } from 'src/assets/image'
import { observer } from 'mobx-react';

let pressTimeout
const { width } = Dimensions.get('window')
function DailyItem ({ info, level, isSet, selectList, handleSelect, handleUnselect, navigation }) {
  const [ isTouch, setIsTouch ] = useState(false)
  useEffect(() => {
    if (!isTouch) {
      clearTimeout(pressTimeout)
    }
  }, [ isTouch ])

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
    duration: 4000
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
    const todayKey = moment(new Date()).format('YYYY-MM-DD')
    if (!finish) {
      dailyStore.handleFinish(info)
      // 更新当天的日志
      dailyStore.updateDailyLogItem({
        date: new Date(),
        finishItems: dailyStore.dailyLog[todayKey].finishItems + 1
      })
    } else {
      dailyStore.handleCancel(info)
      // 更新当天的日志
      dailyStore.updateDailyLogItem({
        date: new Date(),
        finishItems: dailyStore.dailyLog[todayKey].finishItems - 1
      })
    }
    setFinish(!finish)
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
      }, 800)
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
    <Animated.View style={ [ styles.container, {
      backgroundColor: info.color || '#23cba7',
      transform: [ { scale: AnimatedScale } ]
    }, isSelect && {
      borderColor: '#FFF',
      borderWidth: 4
    } ] }
    { ..._panResponder.panHandlers }
    >
      <View style={ styles.leftContent }>
        <Text style={ styles.title }>{ elipsis(info.name, 17) }</Text>
        <Text style={ styles.subTitle }>{ elipsis(info.des, 32) }</Text>
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
    fontSize: 18,
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