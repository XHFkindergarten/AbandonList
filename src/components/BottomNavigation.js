import React, { useState, Fragment, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { finish, type, correct, wrong } from 'src/assets/image'
import { TouchableOpacity } from 'react-native-gesture-handler';
import store from 'src/store'
import { observer } from 'mobx-react';
import nativeCalendar from 'src/utils/nativeCalendar'
import { isNewIPhone, vibrate } from 'src/utils'
import dailyStore from 'src/pages/daily/dailyStore'
import finishStore from 'src/pages/finish/store'
import themeContext from 'src/themeContext'
import Svgs from 'src/assets/svg'

let isConfirmAvailable = true

function BottomNavigation() {

  const [ animateY ] = useState(new Animated.Value(-40))

  const [ animateMainY ] = useState(new Animated.Value(-40))

  const [ animateFinishY ] = useState(new Animated.Value(-40))


  const focusStackName = store.bottomNavName

  const onDailyPage = focusStackName === 'Daily'
  const onMainPage = focusStackName === 'Main'
  const onFinishPage = focusStackName === 'Finish'


  // 跳转到daily页面时
  useEffect(() => {
    if (onDailyPage) {
      onEnterDaily()
    } else {
      onLeaveDaily()
    }
  }, [ onDailyPage ])

  // 跳转到main页面时
  useEffect(() => {
    if (onMainPage) {
      onEnterMain()
    } else {
      onLeaveMain()
    }
  }, [ onMainPage ])
  useEffect(() => {
    if (onFinishPage) {
      onEnterFinish()
    } else {
      onLeaveFinish()
    }
  })

  // 添加/修改日历事件
  const isAddPage = store.isAddPage
  const isAddDaily = store.isAddDaily
  const showHandler = isAddPage || isAddDaily
  useEffect(() => {
    // 每次点击√之后取消防误触
    isConfirmAvailable = true
  }, [ showHandler ])

  const keyboardHeight = store.keyboardHeight
  // 点击取消
  const handelCancelClick = useCallback(() => {
    // 重置页面的表单数据
    store.resetAddFormData()
    store.nav.navigate( isAddPage ? 'Main' : 'Daily')
  }, [ isAddPage, isAddDaily ])
  // 点击确定
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

  const onEnterDaily = () => {
    Animated.spring(animateY, {
      toValue: 0
    }).start()
  }

  // 还原daily图标
  const onLeaveDaily = () => {
    Animated.spring(animateY, {
      toValue: -40
    }).start()
  }

  const onEnterMain = () => {
    Animated.spring(animateMainY, {
      toValue: 0
    }).start()
  }

  const onLeaveMain = () => {
    Animated.spring(animateMainY, {
      toValue: -40
    }).start()
  }

  const onEnterFinish = () => {
    Animated.spring(animateFinishY, {
      toValue: 0
    }).start()
  }

  const onLeaveFinish = () => {

    Animated.spring(animateFinishY, {
      toValue: -40
    }).start()
  }

  const handleToDaily = () => {
    store.nav.navigate('Daily')
  }
  const handleSetDaily = () => {
    vibrate(0)
    dailyStore.toggleIsSet()
  }

  const handleToMain = () => {
    store.nav.navigate('Main')
  }

  const handleToFinish = () => {
    store.nav.navigate('Finish')
  }

  const handleSetFinish = () => {
    if (finishStore.tipOk) {
      vibrate(0)
      finishStore.toggleSet(true)
    }
  }

  // 点击中心按钮
  const handlePressMain = () => {
    store.nav.navigate('Future')
  }
  // 是否是刘海屏iPhone,底部安全距离处理

  const theme = useContext(themeContext)

  const futureLen = !!store.futureList.slice().length

  return (
    <View
      style={ [ styles.container, {
        backgroundColor: theme.mainColor,
        paddingBottom: isNewIPhone && !(showHandler && keyboardHeight) ? 34 : 0,
        bottom: (showHandler && keyboardHeight) ? keyboardHeight : 0,
        height: (keyboardHeight || !isNewIPhone) ? 60 : 94
      } ] }
    >
      { !showHandler ?
        (

          <Fragment>
            <View style={ {
              height: 40,
              overflow:'hidden'
            } }
            >
              <Animated.View style={ {
                transform: [ { translateY: animateY } ]
              } }
              >
                <TouchableOpacity
                  onPress={ handleSetDaily }
                  style={ styles.iconContainer }
                >
                  <Svgs.DailyActive fill={ theme.themeColor }
                    height={ 20 }
                    width={ 20 }
                  />

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={ handleToDaily }
                  style={ styles.iconContainer }
                >
                  <Animated.Image
                    source={ finish }
                    style={ styles.icon }
                  />
                </TouchableOpacity>
              </Animated.View>

            </View>

            <View style={ {
              height: 40,
              overflow:'hidden'
            } }
            >
              <Animated.View style={ {
                transform: [ { translateY: animateMainY } ]
              } }
              >
                <TouchableOpacity
                  onPress={ handlePressMain }
                  style={ styles.iconContainer }
                >
                  <View
                    style={ {
                      height: 28,
                      width: 28,
                      borderRadius: 14,
                      backgroundColor: theme.themeColor

                    } }
                  >
                    {
                      futureLen && (
                        <View style={ {
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          backgroundColor: '#D40D12'
                        } }
                        />
                      )
                    }
                  </View>

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={ handleToMain }
                  style={ styles.iconContainer }
                >
                  <View
                    style={ {
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: '#FFF'
                    } }
                  />
                </TouchableOpacity>
              </Animated.View>

            </View>


            <View style={ {
              height: 40,
              overflow:'hidden'
            } }
            >
              <Animated.View style={ {
                transform: [ { translateY: animateFinishY } ]
              } }
              >
                <TouchableOpacity
                  onPress={ handleSetFinish }
                  style={ styles.iconContainer }
                >
                  <Svgs.Set fill={ theme.themeColor }
                    height={ 30 }
                    width={ 30 }
                  />

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={ handleToFinish }
                  style={ styles.iconContainer }
                >
                  <Animated.Image
                    source={ type }
                    style={ [ styles.icon ] }
                  />
                </TouchableOpacity>
              </Animated.View>

            </View>
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