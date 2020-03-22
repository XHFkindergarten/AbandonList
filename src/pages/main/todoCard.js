/**
 * 待办项卡片item
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import CardExpandModal from './cardExpandModal'
import { correctGreen, wrongRed, setting } from 'src/assets/image'
import { StyleSheet, TouchableOpacity, View, Animated, PanResponder, Image, Text } from 'react-native';
import { observer } from 'mobx-react';
import srcStore from 'src/store'
import { fromNow, elipsis, vibrate } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'
import dailyStore from 'src/pages/daily/dailyStore';
import themeContext from 'src/themeContext'



// 全局唯一定时器
let pressTimeout = null
// 唯二1
let timeout1
function TodoCard({ info, navigation }) {

  useEffect(() => {
    return () => {
      // component will unmount
      clearTimeout(timeout1)
      // clearTimeout(timeout2)
    }
  }, [])
  // console.log('info', info)
  // const { allDay, startDate, endDate } = info
  const [ ScaleValue ] = useState(new Animated.Value(1))
  const ScaleAnimation = Animated.timing(ScaleValue, {
    toValue: 0,
    duration: 3000
  })
  const ScaleBackAnimation = Animated.timing(ScaleValue, {
    toValue: 1,
    duration: 200
  })
  const [ expand, setExpand ] = useState(false)
  const [ isHold, setIsHold ] = useState(false)

  const [ AnimatedScaleX ] = useState(new Animated.Value(1))
  const disappearX = Animated.spring(AnimatedScaleX, { toValue: 0 })
  const [ AnimatedHeightY ] = useState(new Animated.Value(300))
  const disappearY = Animated.spring(AnimatedHeightY, { toValue: 0 })


  // 因为useState的异步性,需要额外使用一个控制变量
  const handlePressIn = () => {
    setIsHold(true)
    ScaleAnimation.start()
    clearTimeout(pressTimeout)
    pressTimeout = setTimeout(() => {
      vibrate()
      ScaleAnimation.stop()
      ScaleBackAnimation.start(() => {
        srcStore.preventOtherHandler = true
        setExpand(true)
        setIsHold(false)
      })
    }, 600)
  }
  // 点击展开卡片的完成按钮
  const handleExpandFinish = () => {
    setExpand(false)
    setFinish(true)
    Promise.all([
      new Promise(resolve => {
        opacityAnimation.start(() => resolve())
      }),
      new Promise(resolve => {
        // 第二个参数传false,因为一般只完成当次
        nativeCalendar.removeEvent(info, false)
          .then(() => resolve())
      })
    ]).finally(() => {
      timeout1 = setTimeout(() => {
        disappearX.start()
        disappearY.start()
      }, 1000)
    })
  }
  // 点击展开卡片的删除按钮
  const handleExpandAbandon = () => {
    setExpand(false)
    setFinish(false)
    Promise.all([
      new Promise(resolve => {
        opacityAnimation.start(() => resolve())
      }),
      new Promise(resolve => {
        // 第二个参数传true, 全部删除
        nativeCalendar.removeEvent(info, true)
          .then(() => resolve())
      })
    ]).finally(() => {
      timeout1 = setTimeout(() => {
        disappearX.start()
        disappearY.start()
      }, 1000)
    })
  }

  useEffect(() => {
    if (!isHold) {
      clearTimeout(pressTimeout)
    }
  }, [ isHold ])
  const handlePressOut = () => {
    setIsHold(false)
    ScaleAnimation.stop()
    ScaleBackAnimation.start()
  }
  const handlePressEdit = () => {
    TranslateXAnimationCenter.start()
    navigation.navigate('Add', {
      info
    })
    setIsLeft('center')
  }
  // 点击卡片右侧的完成按钮
  const handlePressFinish = () => {
    setFinish(true)
    TranslateXAnimationCenter.start(() => {
      Promise.all([
        new Promise(resolve => {
          opacityAnimation.start(() => resolve())
        }),
        new Promise(resolve => {
          // 第二个参数传false,因为一般只完成当次
          nativeCalendar.removeEvent(info, false)
            .then(() => resolve())
        })
      ]).finally(() => {
        timeout1 = setTimeout(() => {
          disappearX.start()
          disappearY.start()
        }, 1000)
      })
    })
    setIsLeft('center')
  }
  // 点击卡片右侧的删除按钮
  const handlePressAbandon = () => {
    setFinish(false)
    TranslateXAnimationCenter.start(() => {
      Promise.all([
        new Promise(resolve => {
          opacityAnimation.start(() => resolve())
        }),
        new Promise(resolve => {
          // 第二个参数传true,因为删除一般是针对整个事件而言
          nativeCalendar.removeEvent(info, true)
            .then(() => resolve())
        })
      ]).finally(() => {
        timeout1 = setTimeout(() => {
          disappearX.start()
          disappearY.start()
        }, 1000)
      })
    })
    setIsLeft('center')
  }
  // 控制左右滑动效果
  const [ AnimatedTranslateX ] = useState(new Animated.Value(0))
  const [ AnimatedIconOpacity ] = useState(new Animated.Value(0))
  const AnimatedIconOpacityReverse = AnimatedIconOpacity.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 1, 0 ]
  })
  const [ finish, setFinish ] = useState(true)
  const opacityAnimation = Animated.timing(AnimatedIconOpacity, {
    toValue: 1,
    duration: 500
  })
  const TranslateXAnimationLeft = Animated.spring(AnimatedTranslateX, {
    toValue: -140
  })
  const TranslateXAnimationRight = Animated.spring(AnimatedTranslateX, {
    toValue: 70
  })
  const TranslateXAnimationCenter = Animated.spring(AnimatedTranslateX, {
    toValue: 0
  })
  const [ isLeft, setIsLeft ] = useState('center')
  const _handleMoveEnd = (eve, gesture) => {
    handlePressOut()
    if ((isLeft === 'left' && gesture.dx > 50) || (isLeft === 'right' && gesture.dx < -50)) {
      srcStore.updateFocusCardId('')
      TranslateXAnimationCenter.start()
      setIsLeft('center')
    } else if (isLeft === 'center') {
      if (gesture.dx > 50) {
        srcStore.updateFocusCardId(info.id)
        TranslateXAnimationRight.start()
        setIsLeft('right')
      } else if (gesture.dx < -50) {
        srcStore.updateFocusCardId(info.id)
        TranslateXAnimationLeft.start()
        setIsLeft('left')
      }
    }
  }

  // 检测是否有其他卡片被操作了,恢复当前卡片为center状态
  const focusCardId = srcStore.focusCardId

  useEffect(() => {
    if (srcStore.focusCardId !== info.id && isLeft !== 'center') {
      TranslateXAnimationCenter.start()
      setIsLeft('center')
    }
  }, [ focusCardId ])

  const _panHandlers = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      if (isLeft === 'center') {
        handlePressIn()
      }
    },
    onPanResponderMove: (eve, gesture) => {
      const { dx } = gesture
      // 当出现左滑/右滑动作时,展开动作结束
      if (Math.abs(dx) > 2) {
        handlePressOut()
      }
    },
    onPanResponderTerminate: _handleMoveEnd,
    onPanResponderRelease: _handleMoveEnd
  })
  const AnimatedTextTranslateX = AnimatedTranslateX.interpolate({
    inputRange: [ -181, -180, 0, 180, 181 ],
    outputRange: [ 70, 70, 0, -70, -70 ]
  })
  const fromNowTime = fromNow(info)

  const theme = useContext(themeContext)
  return (
    <View>
      <Animated.View style={ {
        transform: [
          { translateX: AnimatedTranslateX },
          { scaleY: AnimatedScaleX }
        ],
        maxHeight: AnimatedHeightY
      } }
      >
        <Animated.View
          { ..._panHandlers.panHandlers }
          style={ [ styles.card,{
            backgroundColor: theme.mainColor,
            opacity: isHold ? 0.6 : 1,
            transform: [
              { scale: ScaleValue }
            ]
          } ] }
        >
          <View style={ styles.cardHeader }>
            <Animated.View style={ [ styles.cardCircle, {
              backgroundColor: info.calendar.color,
              transform: [ { translateX: AnimatedTextTranslateX } ],
              opacity: AnimatedIconOpacityReverse
            } ] }
            />
            <Animated.Text style={ [
              styles.cardTitle, {
                maxWidth: 200,
                color: theme.pureText,
                transform: [ { translateX: AnimatedTextTranslateX } ],
                opacity: AnimatedIconOpacityReverse
              }
            ] }
            >{ elipsis(info.title, 50) }</Animated.Text>
          </View>
          <Animated.Text style={ [ styles.timeLeft, {
            color: theme.subText,
            transform: [ { translateX: AnimatedTextTranslateX } ],
            opacity: AnimatedIconOpacityReverse
          } ] }
          >{ fromNowTime }</Animated.Text>
          <View style={ styles.absoluteWrapper }>
            <Animated.Image source={ finish ? correctGreen : wrongRed }
              style={ [ styles.handleIcon, {
                opacity: AnimatedIconOpacity
              } ] }
            />
          </View>
        </Animated.View>
        <View style={ styles.handleContainer }>
          <TouchableOpacity onPress={ handlePressFinish }>
            <View style={ styles.iconItem }>
              <Image source={ correctGreen }
                style={ styles.handleIcon }
              ></Image>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={ handlePressAbandon }>
            <View style={ styles.iconItem }>
              <Image source={ wrongRed }
                style={ styles.handleIcon }
              ></Image>
            </View>
          </TouchableOpacity>
        </View>
        <View style={ styles.editContainer }>
          <TouchableOpacity
            onPress={ handlePressEdit }
            style={ {
              height: 60,
              width: 60,
              justifyContent: 'center',
              alignItems: 'center'
            } }
          >
            <Image source={ setting }
              style={ styles.editIcon }
            ></Image>
          </TouchableOpacity>
        </View>
      </Animated.View>
      { expand &&
      <CardExpandModal
        handleAbandon={ handleExpandAbandon }
        handleFinish={ handleExpandFinish }
        info={ info }
        setVisible={ setExpand }
      /> }
    </View>
  )

}

export default observer(TodoCard)

const styles = StyleSheet.create({
  // 待办卡片
  card: {
    borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  // 卡片标题
  cardTitle: {
    // color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 18
  },
  cardCircle: {
    // paddingTop: 6,
    marginTop: 3,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 6
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    position: 'absolute',
    top: 0,
    right: -140
  },
  editContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    position: 'absolute',
    top: 0,
    left: -70
  },
  editIcon: {
    height: 30,
    width: 30
  },
  iconItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60
  },
  handleIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    borderWidth: 10,
    borderColor: 'transparent'
  },
  absoluteWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeLeft: {
    // color: '#999',
    fontSize: 14,
    marginTop: 6
  }
})
