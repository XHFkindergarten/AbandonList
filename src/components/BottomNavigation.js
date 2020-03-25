import React, { useState, Fragment, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { finish, type, center, correct, wrong, settingDaily } from 'src/assets/image'
import { TouchableOpacity } from 'react-native-gesture-handler';
import store from 'src/store'
import { observer } from 'mobx-react';
import nativeCalendar from 'src/utils/nativeCalendar'
import { isNewIPhone, vibrate } from 'src/utils'
import dailyStore from 'src/pages/daily/dailyStore'
import finishStore from 'src/pages/finish/store'
import themeContext from 'src/themeContext'

let isConfirmAvailable = true

function BottomNavigation() {
  const [ AnimatedScale1 ] = useState(new Animated.Value(1))
  const [ AnimatedScale2 ] = useState(new Animated.Value(1))
  const [ AnimatedScale3 ] = useState(new Animated.Value(1))
  const AnimatedScale = [ AnimatedScale1, AnimatedScale2, AnimatedScale3 ]
  const navNames = [ 'Daily', 'Main', 'Finish' ]
  const focusStackName = store.bottomNavName
  const select = navNames.indexOf(focusStackName)
  const [ isDaily, setIsDaily ] = useState(false)
  const pressHandler = index => {
    store.nav.navigate(navNames[index])
  }

  const [ isFinish, setIsFinish ] = useState(false)

  const isDailySet = dailyStore.isSet

  const [ setRotate ] = useState(new Animated.Value(0))
  const setRotateDeg = setRotate.interpolate({
    inputRange: [ 0, 90 ],
    outputRange: [ '0deg', '90deg' ]
  })
  const rotateAnimation = Animated.spring(setRotate, {
    toValue: 30
  })
  const rotateAnimationBack = Animated.spring(setRotate, {
    toValue: 0
  })
  useEffect(() => {
    if (isDailySet) {
      rotateAnimation.start()
    } else {
      rotateAnimationBack.start()
    }
  }, [ isDailySet ])


  // 路由发生改变时执行
  useEffect(() => {
    // 判断是否是daily页面,不是的话重置dailyStore
    if (select !== 0) {
      setIsDaily(false)
      dailyStore.setIsSet(false)
    }
    if (select !== 2) {
      setIsFinish(false)
    }
    // 恢复图标尺寸
    for(let i = 0;i < 3;i++) {
      if (AnimatedScale[i]._value !== 1) {
        AnimatedScale[i].setValue(1)
      }
    }
    setTimeout(() => {
      Animated.timing(AnimatedScale[select], {
        toValue: 1.2,
        duration: 400
      }).start(() => {
        // 在日常页面时修改图标和功能
        if (select === 0) {
          Animated.timing(AnimatedScale[0], {
            toValue: 0,
            duration: 200
          }).start(() => {
            setIsDaily(true)
            Animated.timing(AnimatedScale[0], {
              toValue: 1,
              duration: 200
            }).start()
          })
        } else if (select === 2) {
          Animated.timing(AnimatedScale[2], {
            toValue: 0,
            duration: 200
          }).start(() => {
            setIsFinish(true)
            Animated.timing(AnimatedScale[2], {
              toValue: 1,
              duration: 200
            }).start()
          })
        }
      })
    })
  }, [ focusStackName ])
  // 添加/修改日历事件
  const isAddPage = store.isAddPage
  const isAddDaily = store.isAddDaily
  const showHandler = isAddPage || isAddDaily
  useEffect(() => {
    // 每次点击√之后取消防误触
    isConfirmAvailable = true
  }, [ showHandler ])
  const keyboardHeight = store.keyboardHeight
  const handelCancelClick = useCallback(() => {
    // 重置页面的表单数据
    store.resetAddFormData()
    store.nav.navigate( isAddPage ? 'Main' : 'Daily')
  }, [ isAddPage, isAddDaily ])
  const handleConfirmClick = useCallback(() => {
    if (!isConfirmAvailable) {
      return
    }
    // 禁止重复点击
    isConfirmAvailable = false
    if (isAddPage) {
      // 存储事件
      nativeCalendar.saveEvent(store.addFormData)
        .then(async res => {
          await store.refreshTodoList(store.startDay)
          store.nav.navigate('Main')
        })
        .catch(err => {
          console.log('err', err)
        })
    } else {
      // 添加每日任务
      dailyStore.submitDailyForm().then(res => {
        store.nav.navigate('Daily')
      })
    }
  }, [ isAddPage, isAddDaily ])
  const handleClickDaily = useCallback(() => {
    if (isDaily) {
      vibrate(0)
      dailyStore.toggleIsSet()
    } else {
      store.nav.navigate('Daily')
    }
  }, [ isDaily ])
  const handleClickFinish = useCallback(() => {
    if (isFinish) {
      vibrate(0)
      finishStore.toggleSet()
    } else {
      store.nav.navigate('Finish')
    }
  }, [ isFinish ])
  // 是否是刘海屏iPhone,底部安全距离处理
  const newIPhone = isNewIPhone()

  const theme = useContext(themeContext)
  return (
    <View
      style={ [ styles.container, {
        backgroundColor: theme.mainColor,
        paddingBottom: newIPhone && !(showHandler && keyboardHeight) ? 34 : 0,
        bottom: (showHandler && keyboardHeight) ? keyboardHeight : 0,
        height: (keyboardHeight || !newIPhone) ? 60 : 94
      } ] }
    >
      { !showHandler ?
        (
          <Fragment>
            <TouchableOpacity
              onPress={ handleClickDaily }
              style={ styles.iconContainer }
            >
              {
                isDaily ? (
                  <Animated.Image
                    source={ settingDaily }
                    style={ [ {
                      height: 32,
                      width: 32
                    }, select === 0 && {
                      transform: [ { scale: AnimatedScale[0] }, { rotate: setRotateDeg } ]
                    } ] }
                  />
                ) : (
                  <Animated.Image
                    source={ finish }
                    style={ [ styles.icon, select === 0 && {
                      transform: [ { scale: AnimatedScale[0] } ]
                    } ] }
                  />
                )
              }
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ () => pressHandler(1) }
              style={ styles.iconContainer }
            >
              <Animated.Image
                source={ center }
                style={ [ styles.icon, select === 1 && {
                  transform: [ { scale: AnimatedScale[1] } ]
                } ] }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ handleClickFinish }
              style={ styles.iconContainer }
            >
              {
                isFinish ? (
                  <Animated.Image
                    source={ settingDaily }
                    style={ [ {
                      height: 32,
                      width: 32
                    }, select === 2 && {
                      transform: [ { scale: AnimatedScale[2] } ]
                    } ] }
                  />
                ) : (
                  <Animated.Image
                    source={ type }
                    style={ [ styles.icon, select === 2 && {
                      transform: [ { scale: AnimatedScale[2] } ]
                    } ] }
                  />
                )
              }
            </TouchableOpacity>
          </Fragment>
        )
        : (
          <View style={ {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flex: 1
          } }
          >
            <TouchableOpacity
              onPress={ handelCancelClick }
              style={ styles.halfContainer }
            >
              <Image source={ wrong }
                style={ styles.icon }
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ handleConfirmClick }
              style={ styles.halfContainer }
            >
              <Image source={ correct }
                style={ styles.icon }
              ></Image>
            </TouchableOpacity>
          </View>
        ) }
    </View>
  )
}
export default observer(BottomNavigation)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: 60,
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 10,
    paddingBottom: 10
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 18,
    width: 18,
    resizeMode: 'contain'
  },
  halfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
})