/**
 * 待办项卡片item
 */
import React, { useState, useEffect, useContext, useRef } from 'react';
import CardExpandModal from './cardExpandModal'
import { wallpaper, wrongRed, setting } from 'src/assets/image'
import { StyleSheet, Dimensions, ImageBackground, TouchableOpacity, View, Animated, PanResponder, Image, Text } from 'react-native';
import { observer } from 'mobx-react';
import srcStore from 'src/store'
import { elipsis, vibrate } from 'src/utils'
import themeContext from 'src/themeContext'

const { width } = Dimensions.get('window')

// 全局唯一定时器
let pressTimeout = null
function TodoCard({ info }) {
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

  // 点击卡片右侧的完成按钮
  const handleExpandAbandon = () => {
    // setFinish(true)
    // TranslateXAnimationCenter.start(() => {
    //   Promise.all([
    //     new Promise(resolve => {
    //       opacityAnimation.start(() => resolve())
    //     }),
    //     new Promise(resolve => {
    //       // 第二个参数传false,因为一般只完成当次
    //       nativeCalendar.removeEvent(info, false)
    //         .then(() => resolve())
    //     })
    //   ]).then(() => {
    //     setTimeout(() => {
    //       disappearX.start()
    //       disappearY.start()
    //     }, 1000)
    //   })
    // })
    // // 更新完成次数数据
    // dailyStore.handleCalendarItemFinish()
    // setIsLeft('center')
  }
  // 点击卡片右侧的删除按钮
  const handleExpandFinish = () => {
    // setFinish(false)
    // TranslateXAnimationCenter.start(() => {
    //   Promise.all([
    //     new Promise(resolve => {
    //       opacityAnimation.start(() => resolve())
    //     }),
    //     new Promise(resolve => {
    //       // 第二个参数传true,因为删除一般是针对整个事件而言
    //       nativeCalendar.removeEvent(info, true)
    //         .then(() => resolve())
    //     })
    //   ]).then(() => {
    //     setTimeout(() => {
    //       disappearX.start()
    //       disappearY.start()
    //     }, 1000)
    //   })
    // })
    // setIsLeft('center')
  }

  const _panHandlers = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      handlePressIn()
    },
    onPanResponderMove: (eve, gesture) => {
      const { dx } = gesture
      // 当出现左滑/右滑动作时,展开动作结束
      if (Math.abs(dx) > 2) {
        handlePressOut()
      }
    },
    onPanResponderTerminate: handlePressOut,
    onPanResponderRelease: handlePressOut
  })
  const theme = useContext(themeContext)

  const { isDelete } = info
  return (
    <View>
      <Animated.View style={ {
        transform: [
          { scaleY: AnimatedScaleX }
        ],
        maxHeight: AnimatedHeightY
      } }
      >
        <Animated.View
          { ..._panHandlers.panHandlers }
          style={ {
            transform: [
              { scale: ScaleValue }
            ]
          } }
        >
          <ImageBackground
            imageStyle={ { borderRadius: 6 } }
            source={ wallpaper }
            style={ styles.card, {
              marginBottom: 6,
              height: 78,
              width: width - 60,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isDelete ? 0.6 : 1
            } }
          >
            <View style={ styles.cardHeader }>
              <View style={ [ styles.cardCircle, {
                backgroundColor: info.calendar.color
              } ] }
              />
              <Text style={ [
                styles.cardTitle, {
                  maxWidth: 200,
                  color: theme.pureText,
                  textDecorationLine: isDelete ? 'line-through' : 'none'
                }
              ] }
              >{ elipsis(info.title, 20) }</Text>
            </View>
          </ImageBackground>
        </Animated.View>
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
    // borderRadius: 6,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
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
    marginTop: 3,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 6
  }
})
