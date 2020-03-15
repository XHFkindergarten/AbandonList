import React, { useState, Fragment, useCallback, useEffect } from 'react';
import { View, Modal,Text, StyleSheet, Image, TouchableOpacity, PanResponder, ActionSheetIOS } from 'react-native';
import { down, addThin, correctGreen } from 'src/assets/image'
import finishStore from './store'
import { vibrate } from 'src/utils'
import nativeCalendar from 'src/utils/nativeCalendar'
import { correct } from 'src/assets/image'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native'
import { observer } from 'mobx-react';
import AddCalendar from './addCalendar'

import { ScrollView } from 'react-native-gesture-handler';
import srcStore from 'src/store'
import calStore from 'src/components/calendar/store'

const Stack = createStackNavigator()

function CalendarItem({ item }) {
  const [ flag, setFlag ] = useState(false)
  // 获取可见的日历id
  const visibleGroupIds = finishStore.visibleGroupIds
  const isVisible = visibleGroupIds.includes(item.id)
  const handleClick = () => {
    nativeCalendar.toggleVisibleGroupIds(item.id)
    // 刷新日历中的数据
    srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
    // 因为groupids不是响应式的，所以需要手动刷新组件
    setFlag(!flag)
  }
  const handleLongPress = () => {
    vibrate()
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [ '删除', '取消' ],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1
      },
      async index => {
        if (index === 0) {
          // 点击删除
          await finishStore.deleteCalendar(item.id)

          // 刷新日历中的数据
          srcStore.redirectCenterWeek(srcStore.targetDate || calStore.centerSunday)
          // 刷新日历分组
          finishStore.refreshGroupStorage()
        }
      }
    )
  }
  return (
    <TouchableOpacity
      onLongPress={ handleLongPress }
      onPress={ handleClick }
    >
      <View style={ styles.row } >
        <View style={ {
          flexDirection: 'row',
          alignItems: 'center'
        } }
        >
          <View style={ [ styles.circle, {
            backgroundColor: item.color
          } ] }
          />
          <Text style={ styles.groupName }>{ item.title }</Text>
        </View>
        {
          isVisible && (
            <Image source={ correct }
              style={ styles.check }
            />
          )
        }
      </View>
    </TouchableOpacity>
  )
}

const CalendarItem_ob = observer(CalendarItem)

function CalendarList ({ navigation }) {
  // 更新store中的navigation
  useEffect(() => {
    finishStore.nav = navigation
  }, [])
  // 分组信息
  // const visibleList = finishStore.visibleGroupIds.slice()
  const groups = finishStore.groupStorage.slice()
  // groups.sort((a, b) => visibleList.includes(a.id) ? -1 : 1)
  const handleClickAdd = () => {
    navigation.navigate('addCalendar')
  }
  return (
    <ScrollView>
      <TouchableOpacity onPress={ handleClickAdd }>
        <View style={ {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        } }
        >
          <Text style={ styles.title }>日历分组</Text>
          <Image source={ addThin }
            style={ styles.addCircle }
          />
        </View>
      </TouchableOpacity>
      <Text style={ [ styles.subTitle , {
        marginTop: 20
      } ] }
      >点击控制分组相关事件的显示和隐藏</Text>
      <Text style={ styles.subTitle }>长按对分组进行删除</Text>
      {
        groups.map((item) => (
          <CalendarItem_ob item={ item }
            key={ item.id }
          />
        ))
      }
    </ScrollView>
  )
}

const CalendarList_ob = observer(CalendarList)



function SetModal({ visible }) {
  const handleClose = ()=> {
    finishStore.toggleSet(false)
  }
  const isAdd = finishStore.isAddCalendar

  // 在添加路由页面点击返回按钮
  const handleClickBack = () => {
    finishStore.nav.navigate('calendarList')
  }

  // 点击确认创建按钮
  const handleClickCreate = async () => {
    if (!finishStore.addCalendarForm.id) {
      // 数据没有ID, 是创建行为
      const res = await nativeCalendar.createCalendar(finishStore.addCalendarForm)
        .catch(() => {
        // TODO: 弹出提示框
        })
      // 返回值就是新日历的id,默认设置为可见的
      nativeCalendar.toggleVisibleGroupIds(res)
    } else {
      // 有ID，是更新行为
      await nativeCalendar.updateCalendar(finishStore.addCalendarForm)
        .catch(() => {
        // TODO: 弹出提示框
        })
    }

    // 创建成功
    await finishStore.refreshGroupStorage()
    finishStore.nav.navigate('calendarList')
  }
  const readyToCreate = (isAdd && finishStore.addCalendarForm.name && finishStore.addCalendarForm.color)
  return (
    <Modal
      animationType="slide"
      transparent
      visible={ visible }
    >
      <View style={ styles.wrapper }>
        <View style={ styles.container }>
          <View style={ styles.header } >
            {
              readyToCreate ? (
                <TouchableOpacity onPress={ handleClickCreate }>
                  <Image source={ correctGreen }
                    style={ styles.closeIcon }
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={ handleClose }>
                  <Image source={ down }
                    style={ styles.closeIcon }
                  />
                </TouchableOpacity>
              )
            }
            {
              isAdd && (
                <TouchableOpacity onPress={ handleClickBack }>
                  <Image source={ down }
                    style={ [ styles.closeIcon, {
                      transform: [ { rotate: '90deg' } ]
                    } ] }
                  />
                </TouchableOpacity>
              )
            }
          </View>
          <Stack.Navigator
            headerMode="none"
            initialRouteName="calendarList"
          >
            <Stack.Screen
              component={ CalendarList_ob }
              name="calendarList"
              options={ {
                cardStyle: {
                  backgroundColor: 'transparent'
                },
                header: null
              } }
            ></Stack.Screen>
            <Stack.Screen
              component={ AddCalendar }
              name="addCalendar"
              options={ {
                cardStyle: {
                  backgroundColor: 'transparent'
                },
                header: null,
                cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
              } }
            ></Stack.Screen>
          </Stack.Navigator>
        </View>
      </View>
    </Modal>
  )
}

export default observer(SetModal)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    backgroundColor: '#2F2F2F',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    minHeight: 500,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
    // paddingBottom: 60
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20
  },
  closeIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginRight: 20
  },
  subTitle: {
    // width: 300,
    lineHeight: 20,
    textAlign: 'center',
    color: '#8a8a8a',
    fontSize: 14
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    height: 40
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    marginRight: 5
  },
  groupName: {
    color: '#FFF',
    fontSize: 16
  },
  check: {
    height: 24,
    width: 24
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  addCircle: {
    height: 24,
    width: 24
  }
})