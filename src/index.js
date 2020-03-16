import { Add, Main, Finish, Daily, AddDaily } from './pages'
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack'
import nativeCalendar from 'src/utils/nativeCalendar'
import store from 'src/store';
import { View } from 'react-native';
import { BottomNavigation } from 'src/components'
import dailyStore from 'src/pages/daily/dailyStore'
import ThemeContext, { theme as themeValue } from './themeContext'
import Notification from 'src/utils/Notification'
import finishStore from 'src/pages/finish/store'
// 检查通知权限
Notification.initialNotification()

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

// 从AsyncStorage中初始化每日待办列表
dailyStore.initialDailyStore()


// 初始化历史记录
finishStore.initialHistoryList()


// 创建栈路由
const Stack = createStackNavigator()




function App() {
  const [ theme, setThemeValue ] = useState(themeValue.darkTheme)
  // 切换主题方法,存储在全局store中
  // const toggleTheme = () => {
  //   if (themeValue.name === '@global_dark_theme') {
  //     setThemeValue(theme.lightTheme)
  //   } else if (themeValue.name === '@global_light_theme') {
  //     setThemeValue(theme.darkTheme)
  //   }
  // }
  return (
    <ThemeContext.Provider value={ theme }>
      { /* <SafeAreaView style={ { flex: 1, paddingBottom: 60, backgroundColor: themeValue.mainColor } }>
        <StatusBar hidden></StatusBar> */ }
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
              // gestureDirection: 'vertical',
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
              } }
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>

      <BottomNavigation />
      { /* </SafeAreaView> */ }
    </ThemeContext.Provider>

  );
}



export default App;

// react-navigation@5.x路由需要用NavigationContainer包裹
