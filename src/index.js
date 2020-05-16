import { Add, Main, Finish, Daily, AddDaily, Guide, Future } from './pages'
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack'
import nativeCalendar from 'src/utils/nativeCalendar'
import store from 'src/store';
import { View, AppState } from 'react-native';
import { BottomNavigation, GlobalModal } from 'src/components'
import dailyStore from 'src/pages/daily/dailyStore'
import ThemeContext, { theme as themeValue } from './themeContext'
import Notification from 'src/utils/Notification'
import { isFirstOpen } from 'src/utils'
import finishStore from 'src/pages/finish/store'
import { Toast } from 'src/components'
import tinycolor from 'tinycolor2'
import { getGlobalTheme } from 'src/utils'
import FinishStore from 'src/pages/finish/store'

// 创建栈路由
const Stack = createStackNavigator()

function App() {



  // App did mount
  useEffect(() => {
    // 是否是初次打开App
    isFirstOpen().then(ifFirst => {
      if (!ifFirst) {
        try {
          // 初始化通知模块
          Notification.initialNotification().then(() => {
            // 初始化监听事件
            Notification.initialListener()
          })
          // 检查日历权限
          nativeCalendar.checkAuth().then(() => {
            // 获取存储在本地的可见分组数据
            nativeCalendar.initialVisibleGroup().then(() => {
              // 获取日历所有分组信息[默认只显示默认日历的信息]
              nativeCalendar.getCalendarGroups().then(() => {
                // 获取事件
                store.initialStorageData()
              })
            })
          })
        } catch(e) {
          console.log(e)
        }
      }
    })

    // 初始化用户的主题色设置
    getGlobalTheme().then(color => {
      setThemeColor(color)
    }).catch(() => {
      // 用户没有设置过颜色,不作处理
    })

    // 从AsyncStorage中初始化每日待办列表
    dailyStore.initialDailyStore()
    // 初始化历史记录
    finishStore.initialHistoryList()

    // 初始化每日通知时间
    finishStore.initialReviewTime()

    // 更新全局通知方法
    store.globalNotify = globalNotify

    // 更新全局提示方法
    store.toast = sendToast

    // 监听App状态
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        // 当App从后台切回前台时通过mobx强制刷新某些需要刷新的组件
        store.refreshWhatever()
        // 更新每日待办的数据
        dailyStore.initialDailyStore()
      }
    })

    return () => {
      // App will unmount
      Notification.removeListeners()
    }
  }, [])

  // 全局主题，默认为暗色主题
  const [ theme, setThemeValue ] = useState(themeValue.darkTheme)

  // 更新主题色方法
  const setThemeColor = color => {
    setThemeValue({
      ...theme,
      themeColor: color,
      // 基于主题色偏暗还是偏亮来决定覆盖的文字颜色
      baseThemeText: tinycolor(color).isDark() ? theme.mainText : '#000'
    })
  }

  useEffect(() => {
    // 更新store中的全局方法
    store.setThemeColor = setThemeColor
  }, [])



  // 切换主题方法,存储在全局store中
  // const toggleTheme = () => {
  //   if (themeValue.name === '@global_dark_theme') {
  //     setThemeValue(theme.lightTheme)
  //   } else if (themeValue.name === '@global_light_theme') {
  //     setThemeValue(theme.darkTheme)
  //   }
  // }

  // 全局toast
  const [ showToast, setShowToast ] = useState(false)
  const [ toastMsg, setToastMsg ] = useState('')

  const sendToast = msg => {
    setToastMsg(msg)
    setShowToast(true)
  }

  const [ showGlobalModal, setShowModal ] = useState(false)

  useEffect(() => {
    if (showGlobalModal) {
      FinishStore.tipOk = true
    }
  }, [ showGlobalModal ])
  const [ modalTitle, setModalTitle ] = useState('')
  const [ modalContent, setModalContent ] = useState('')

  // 发送全局通知的方法
  const globalNotify = ({ content, title }) => {
    setModalTitle(title)
    setModalContent(content)
    setShowModal(true)
  }

  const [ showBottom, setBottom ] = useState(true)

  store.setShowBottom = setBottom

  // const isGuiding = store.bottomNavName === 'Guide'

  return (
    <ThemeContext.Provider value={ theme }>
      <View style={ { flex: 1, backgroundColor: theme.mainColor } }>
        <NavigationContainer>
          <Stack.Navigator
            headerMode="none"
            initialRouteName="Main"
            mode="screen"
          >
            <Stack.Screen component={ Main }
              name="Main"
            />
            <Stack.Screen component={ Add }
              name="Add"
              options={ {
              // 返回时的手势方向
              // gestureDirection: 'horizontal-inverted',
              // 卡片式入场动画
              // cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
              } }
            />
            <Stack.Screen component={ Finish }
              name="Finish"
              options={ {
              // 返回时的手势方向
              // gestureDirection: 'horizontal-inverted',
              // 卡片式入场动画
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              } }
            />
            <Stack.Screen component={ Daily }
              name="Daily"
              options={ {
                gestureDirection: 'horizontal-inverted',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              } }
            />
            <Stack.Screen
              component={ AddDaily }
              name="AddDaily"
              options={ {
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
              } }
            />
            <Stack.Screen
              component={ Guide }
              name="Guide"
              options={ {
                gestureEnabled: false,
                cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
              } }
            />
            <Stack.Screen
              component={ Future }
              name="Future"
              options={ {
                gestureEnabled: true,
                cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
              } }
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <GlobalModal
        content={ modalContent }
        setVisible={ setShowModal }
        title={ modalTitle }
        visible={ showGlobalModal }
      />
      {
        showBottom && <BottomNavigation />
      }

      <Toast
        message={ toastMsg }
        setVisible={ setShowToast }
        visible={ showToast }
      />

    </ThemeContext.Provider>

  );
}



export default (App);

// react-navigation@5.x路由需要用NavigationContainer包裹
