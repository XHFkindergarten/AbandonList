/**
 * 添加daily页面
 */
import React, { useCallback, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, Text, Keyboard, ScrollView, TextInput, TouchableWithoutFeedback, TouchableOpacity, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import srcStore from 'src/store'
import { flatColorList } from 'src/common'
import moment from 'moment'
import { TimePickModal } from 'src/components'
import dailyStore from 'src/pages/daily/dailyStore'
import { toJS } from 'mobx';
const pickDay = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]


const DayItem = ({ name, index, handlePress, notiDay }) => {
  const onPress = () => {
    handlePress(index)
    setIsSelect(!isSelect)
  }
  const [ isSelect, setIsSelect ] = useState(false)
  useEffect(() => {
    if (notiDay.has(index)) {
      setIsSelect(true)
    }
  }, [ notiDay ])
  return (
    <TouchableOpacity onPress={ onPress }>
      <View style={ [ styles.dayItem, isSelect && {
        borderColor: '#FFF'
      } ] }
      >
        <Text style={ styles.dayText }>{ name }</Text>
      </View>
    </TouchableOpacity>
  )
}

function AddDaily ({ navigation, route }) {
  // 路由活跃和不活跃时控制底部栏状态
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      srcStore.updateIsAddDaily(true)
      return () => {
        // Do something when the screen is unfocused
        srcStore.updateIsAddDaily(false)
        dailyStore.setIsSet(false)
        // 重置表单数据
        // srcStore.resetAddFormData()
      }
    }, [])
  )

  useEffect(() => {
    // component did mount
    const info = route.params && route.params.info
    if (info) {
      setTitle(info.name)
      setDes(info.des)
      setColor(info.color)
      setNoti(info.noti)
      setNotiTime(new Date(info.notiTime))
      setNotiDay(new Set(toJS(info.notiDay)))
      dailyStore.addDailyFormItem(info)
    } else {
      // 重置表单数据
      dailyStore.resetDailyForm()
    }
  }, [])

  // 键盘弹起/收回时控制底部栏位置
  const _keyboardShowHandler = e => {
    srcStore.updateKeyboardHeight(e.endCoordinates.height)
  }
  const _keyboardHideHandler = () => {
    srcStore.updateKeyboardHeight(0)
  }

  // 挂载时和卸载时监听/卸载keyboard事件
  let keyboardShowListener, keyboardHideListener
  useEffect(() => {
    // component did mount
    keyboardShowListener = Keyboard.addListener('keyboardWillShow', _keyboardShowHandler)
    keyboardHideListener = Keyboard.addListener('keyboardWillHide', _keyboardHideHandler)
    return () => {
      // component did unmount
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  // 表单数据
  const [ title, setTitle ] = useState('')
  const [ des, setDes ] = useState('')
  const [ color, setColor ] = useState('')
  const [ noti, setNoti ] = useState(false)
  const [ notiTime, setNotiTime ] = useState(new Date())
  const [ notiDay, setNotiDay ] = useState(new Set())

  const handleTitleChange = value => {
    setTitle(value)
    dailyStore.addDailyFormItem({
      name: value
    })
  }
  const handleDesChange = value => {
    setDes(value)
    dailyStore.addDailyFormItem({
      des: value
    })
  }
  const handleColorChange = value => {
    setColor(value)
    dailyStore.addDailyFormItem({
      color: value
    })
  }
  const handleNotiChange = value => {
    setNoti(value)
    dailyStore.addDailyFormItem({
      noti: value
    })
  }
  const handleNotiTimeChange = value => {
    setNotiTime(value)
    dailyStore.addDailyFormItem({
      notiTime: value
    })
  }
  const handlePressDayItem = index => {
    const newSet = new Set(notiDay)
    if (notiDay.has(index)) {
      newSet.delete(index)
      setNotiDay(newSet)
      dailyStore.addDailyFormItem({
        notiDay: newSet
      })
    } else {
      newSet.add(index)
      setNotiDay(newSet)
      dailyStore.addDailyFormItem({
        notiDay: newSet
      })
    }
  }

  // 是否显示时间选择器
  const [ showDatePick, setShowDatePick ] = useState(false)
  const openDatePick = () => {
    setShowDatePick(true)
  }
  const closeDatePick = () => {
    setShowDatePick(false)
  }


  const ColorItem = ({ color: itemColor }) => {
    const onPress = () => {
      handleColorChange(itemColor)
    }
    const isSelect = color === itemColor
    return (
      <TouchableOpacity onPress={ onPress }>
        <View style={ [ styles.colorItem , {
          backgroundColor: itemColor,
          borderWidth: 2,
          borderColor: isSelect ? '#DBDBDB' : itemColor
        } ] }
        />
      </TouchableOpacity>
    )
  }



  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={ { flex: 1, backgroundColor: '#212121' } }
    >
      <View style={ styles.container }>
        <Text style={ styles.title }>创建每日任务</Text>
        <TextInput
          defaultValue={ title }
          keyboardAppearance="dark"
          maxLength={ 15 }
          onChangeText={ handleTitleChange }
          placeholder="请输入任务名称"
          placeholderTextColor="#bfbfbf"
          returnKeyType="done"
          style={ styles.textInput }
        />
        <TextInput
          clearButtonMode="while-editing"
          defaultValue={ des }
          keyboardAppearance="dark"
          maxLength={ 32 }
          onChangeText={ handleDesChange }
          placeholder="备注"
          placeholderTextColor="#2F2F2F"
          returnKeyType="done"
          style={ styles.description }
        />
        <Text style={ styles.rowLabel }>卡片颜色</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={ false }
          showsVerticalScrollIndicator={ false }
          style={ styles.colorContainer }
        >
          {
            flatColorList.map(color => (
              <ColorItem color={ color }
                key={ color }
              />
            ))
          }
        </ScrollView>
        <View style={ styles.row }>
          <Text style={ styles.rowLabel }>通知</Text>
          <Switch
            onValueChange={ handleNotiChange }
            trackColor={ { false: '', true: '#4192D9' } }
            value={ noti }
          />
        </View>
        <View style={ styles.row }>
          <Text style={ styles.rowLabel }>通知时间</Text>
          <TouchableOpacity onPress={ openDatePick }>
            <Text style={ styles.rowValue }>{ moment(notiTime).format('LT') }</Text>
          </TouchableOpacity>
        </View>

        <Text style={ [ styles.rowLabel, { marginTop: 20 } ] }>重复</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={ false }
          showsVerticalScrollIndicator={ false }
          style={ styles.dayContainer }
        >
          {
            pickDay.map((item, index) => (
              <DayItem
                handlePress={ handlePressDayItem }
                index={ index }
                key={ item }
                name={ item }
                notiDay={ notiDay }
              />
            ))
          }
        </ScrollView>
      </View>
      <TimePickModal
        defaultTime={ notiTime }
        handleClose={ closeDatePick }
        mode="time"
        setTime={ handleNotiTimeChange }
        visible={ showDatePick }
      />
    </ScrollView>
  )
}

export default observer(AddDaily)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80
  },
  title: {
    color: '#DBDBDB',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20
  },
  description: {
    marginTop: 20,
    marginBottom: 20,
    color: '#DBDBDB',
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  textInput: {
    backgroundColor: '#2c2c2c',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 15,
    fontSize: 16,
    color: '#DBDBDB'
  },
  colorContainer: {
    // marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20
  },
  colorItem: {
    height: 42,
    width: 42,
    borderRadius: 21,
    margin: 10
  },
  rowLabel: {
    fontSize: 16,
    color: '#DBDBDB'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  rowValue: {
    color: '#999',
    fontSize: 16
  },
  dayContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    marginTop:10
  },
  dayItem: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 17,
    borderColor: '#2c2c2c',
    // borderColor: '#DBDBDB',
    borderWidth: 2,
    color: '#444',
    marginRight: 10
  },
  dayText: {
    color: '#DBDBDB',
    fontSize: 14
  }
})