import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import CardExpandModal from './cardExpandModal'
import { correctGreen, wrongRed, bell, setting } from 'src/assets/image'
import { StyleSheet, TouchableOpacity, Dimensions, View, Animated, Image, Text } from 'react-native';
import { observer } from 'mobx-react';
import srcStore from 'src/store'
import { fromNow, vibrate } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'
import themeContext from 'src/themeContext'
import calStore from 'src/components/calendar/store'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TapGestureHandler, State } from 'react-native-gesture-handler'
import Notification from 'src/utils/Notification'

const { width } = Dimensions.get('window')

function TodoCard({ info, navigation }) {

  const theme = useContext(themeContext)

  const [ animatedOpacity ] = useState(new Animated.Value(1))
  const animatedOpacityReverse = animatedOpacity.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ 1, 0 ]
  })

  const [ expand, setExpand ] = useState(false)

  const [ finishStatus, setFinishStatus ] = useState(0)
  // 当前活跃的卡片
  const activeCardId = srcStore.focusCardId

  useEffect(() => {
    if (activeCardId !== info.id) {
      swipeRef.current.close()
    }
  }, [ activeCardId ])

  // 卡片主体
  const RenderCard = (progress, dragX) => {
    const fromNowTime = fromNow(info)

    const [ animatedScale ] = useState(new Animated.Value(1))

    const _handleStateChange = ({ nativeEvent }) => {

      vibrate(1)
      setExpand(true)
      // if (nativeEvent.state === State.BEGAN) {
      //   srcStore.updateFocusCardId(info.id)
      //   Animated.spring(animatedScale, {
      //     toValue: 0.90
      //   }).start(() => {
      //     Animated.timing(animatedScale, {
      //       toValue: 1,
      //       duration: 200
      //     }).start()
      //   })
      // }
      // if (nativeEvent.state === State.END) {
      //   vibrate(1)
      //   setExpand(true)
      // }
    }
    return (
      <TouchableOpacity
        activeOpacity={ 0.8 }
        onPress={ _handleStateChange }
      >
        <Animated.View style={ [ styles.card, {
          backgroundColor: theme.mainColor,
          transform: [ { scale: animatedScale } ]
        } ] }
        >
          <Animated.View style={ {
            opacity: animatedOpacity
          } }
          >
            <View style={ styles.cardHeader }>
              <View style={ [ styles.cardCircle, {
                backgroundColor: info.calendar.color
              } ] }
              />
              <Text
                numberOfLines={ 2 }
                style={ [
                  styles.cardTitle,
                  {
                    color: theme.pureText
                  }
                ] }
              >{ info.title }</Text>
            </View>
            <View style={ {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            } }
            >
              <Text style={ [ styles.timeLeft, {
                color: theme.subText
              } ] }
              >{ fromNowTime }</Text>
              {
                hasNoti && (
                  <Image source={ bell }
                    style={ styles.miniIcon }
                  />
                )
              }
            </View>
          </Animated.View>
          {
            finishStatus === 1 && (
              <View style={ styles.absoluteWrapper }>
                <Animated.Image source={ correctGreen }
                  style={ [ styles.handleIcon, {
                    opacity: animatedOpacityReverse
                  } ] }
                />
              </View>
            )
          }
          {
            finishStatus === 2 && (
              <View style={ styles.absoluteWrapper }>
                <Animated.Image source={ wrongRed }
                  style={ [ styles.handleIcon, {
                    opacity: animatedOpacityReverse
                  } ] }
                />
              </View>
            )
          }
        </Animated.View>
      </TouchableOpacity>
    )
  }

  // 左侧操作按钮
  const RenderLeft = (progress, dragX) => {
    const animatedX = dragX.interpolate({
      inputRange: [ 0, width - 60 ],
      outputRange: [ 30 - width / 2, 0 ]
    })
    const animatedOpacity = dragX.interpolate({
      inputRange: [ 0, width - 60 ],
      outputRange: [ 0, 1 ]
    })
    const handlePressEdit = () => {
      swipeRef.current.close()
      setTimeout(() => {
        navigation.navigate('Add', {
          info
        })
      }, 300)
    }
    return (
      <Animated.View style={ [ styles.leftContainer, {
        transform: [ { translateX: animatedX } ],
        opacity: animatedOpacity
      } ] }
      >
        <TouchableOpacity
          onPress={ handlePressEdit }
          style={ {
            padding: 10
          } }
        >
          <Image
            source={ setting }
            style={ styles.editIcon }
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // 右侧操作按钮
  const RenderRight = (progress, dragX) => {
    // 点击完成
    const handlePressFinish = () => {
      swipeRef.current.close()
      srcStore.updateFocusCardId('')
      setTimeout(() => {
        Promise.all([
          nativeCalendar.removeEvent(info, false),
          new Promise((resolve) => {
            setFinishStatus(1)
            Animated.timing(animatedOpacity, { toValue: 0, duration: 600 }).start(() => {
              resolve()
            })
          })
        ]).then(() => {
          setTimeout(() => {
            srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
          }, 400)
        }).catch(err => {
          srcStore.globalNotify(err)
        })
      }, 400)
    }
    // 点击删除
    const handlePressAbandon = () => {
      swipeRef.current.close()
      srcStore.updateFocusCardId('')
      setTimeout(() => {
        Promise.all([
          nativeCalendar.removeEvent(info, true),
          new Promise((resolve) => {
            setFinishStatus(2)
            Animated.timing(animatedOpacity, { toValue: 0, duration: 600 }).start(() => {
              resolve()
            })
          })
        ]).then(() => {
          setTimeout(() => {
            srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
          }, 400)
        }).catch(err => {
          srcStore.globalNotify(err)
        })
      }, 600)
    }
    return (
      <Animated.View style={ [ styles.rightContainer, {

      } ] }
      >
        <TouchableOpacity onPress={ handlePressFinish }>
          <Image source={ correctGreen }
            style={ styles.handleIcon }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={ handlePressAbandon }>
          <Image source={ wrongRed }
            style={ styles.handleIcon }
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const handleExpandFinish = () => {
    setExpand(false)
    swipeRef.current.close()
    srcStore.updateFocusCardId('')
    setTimeout(() => {
      Promise.all([
        nativeCalendar.removeEvent(info, false),
        new Promise((resolve) => {
          setFinishStatus(1)
          Animated.timing(animatedOpacity, { toValue: 0, duration: 600 }).start(() => {
            resolve()
          })
        })
      ]).then(() => {
        setTimeout(() => {
          srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
        }, 400)
      }).catch(err => {
        srcStore.globalNotify(err)
      })
    }, 400)
  }

  const handleExpandAbandon = () => {
    setExpand(false)
    swipeRef.current.close()
    srcStore.updateFocusCardId('')
    setTimeout(() => {
      Promise.all([
        nativeCalendar.removeEvent(info, true),
        new Promise((resolve) => {
          setFinishStatus(2)
          Animated.timing(animatedOpacity, { toValue: 0, duration: 600 }).start(() => {
            resolve()
          })
        })
      ]).then(() => {
        setTimeout(() => {
          srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
        }, 400)
      }).catch(err => {
        srcStore.globalNotify(err)
      })
    }, 400)
  }

  const handleExpandSetting = () => {
    setExpand(false)
    navigation.navigate('Add', {
      info
    })
  }

  const swipeRef = useRef()

  const _handleLeftOpen = () => {
    navigation.navigate('Add', {
      info
    })
    setTimeout(() => {
      srcStore.updateFocusCardId('@not_any_one')
    }, 300)
  }
  const _handleRightOpen = () => {
    srcStore.updateFocusCardId(info.id)
  }


  const [ hasNoti, setHasNoti ] = useState(false)

  Notification.getScheduleList().then(res => {
    const scheduleList = res.filter(item => item.userInfo.id === info.id)
    if (scheduleList.length) {
      setHasNoti(true)
    }
  })

  return (
    <Fragment>
      <Swipeable
        friction={ 1 }
        leftThreshold={ 200 }
        onSwipeableLeftWillOpen={ _handleLeftOpen }
        onSwipeableRightOpen={ _handleRightOpen }
        // onHandlerStateChange={ _handleSwipeStateChange }
        overshootFriction={ 1 }
        ref={ swipeRef }
        renderLeftActions={ RenderLeft }
        renderRightActions={ RenderRight }
        rightThreshold={ 40 }
      >
        <RenderCard info={ info } />
      </Swipeable>
      {
        expand && (
          <CardExpandModal
            handleAbandon={ handleExpandAbandon }
            handleFinish={ handleExpandFinish }
            handleSetting={ handleExpandSetting }
            info={ info }
            setVisible={ setExpand }
          />
        )
      }
    </Fragment>
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
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 4, height: 4 },
    minHeight: 80
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  // 卡片标题
  cardTitle: {
    maxWidth: 200,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 6
  },
  cardCircle: {
    // paddingTop: 6,
    marginTop: 3,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 6
  },
  timeLeft: {
    fontSize: 14,
    textAlign: 'center'
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  rightContainer: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  editIcon: {
    height: 30,
    width: 30
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
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniIcon: {
    height: 16,
    width: 16
  }
})