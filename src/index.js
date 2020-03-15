import { Add, Main, Group, Finish, Daily, AddDaily } from './pages'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack'
import nativeCalendar from 'src/utils/nativeCalendar'
import store from 'src/store';
import { View, SafeAreaView, StatusBar, Text } from 'react-native';
import { BottomNavigation } from 'src/components'
import dailyStore from 'src/pages/daily/dailyStore'

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


// 创建栈路由
const Stack = createStackNavigator()


function App() {
  return (
    <SafeAreaView style={ { flex: 1, paddingBottom: 60, backgroundColor: '#111' } }>
      <StatusBar hidden></StatusBar>
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
      <BottomNavigation />
    </SafeAreaView>

  );
}



export default App;

// react-navigation@5.x路由需要用NavigationContainer包裹
