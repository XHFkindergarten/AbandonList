/**
 * 修改item提示框
 */

import React, { useState, useEffect, useRef } from 'react';
import dailyStore from './dailyStore'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Animated, TouchableOpacity, Text, Switch, Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import moment from 'moment';
import { Transitioning, Transition } from 'react-native-reanimated';
import { TimePickModal } from 'src/components'


const { width, height } = Dimensions.get('window')
export default function EditModal ({ visible, target, handleEditClose }) {
  // 弹窗关闭时的回调
  const onDismiss = () => {
    // 重置数据
    setRemind(false)
    setRemindTime(defaultTime)
    AnimatedHeight.setValue(0)
  }

  useEffect(() => {
    setName(target ? target.name : '')
    setRemind(!!(target && target.remind))
    setShowTime(!!(target && target.remind))
  }, [ target ])

  /* ====================== 表单信息 ====================== */
  const [ name, setName ] = useState(target ? target.name : '')
  const [ remind, setRemind ] = useState(false)
  const [ showTime, setShowTime ] = useState(false)
  const defaultTime = new Date()
  defaultTime.setHours(8,0,0,0)
  const [ remindTime, setRemindTime ] = useState(defaultTime)
  const [ showTimePicker, setShowTimePicker ] = useState(false)
  const handleRemindChange = value => {
    setRemind(value)
    if (value) {
      Animated.timing(AnimatedHeight, {
        toValue: 40,
        duration: 200
      }).start()
      setTimeout(() => {
        ref.current.animateNextTransition()
        setShowTime(true)
      }, 200)
    } else {
      ref.current.animateNextTransition()
      setShowTime(false)
      setTimeout(() => {
        Animated.timing(AnimatedHeight, {
          toValue: 0,
          duration: 200
        }).start()
      }, 200)
    }
  }
  const handlePressTime = () => {
    setShowTimePicker(true)
  }
  const [ AnimatedHeight ] = useState(new Animated.Value(0))
  const handleNameChange = value => setName(value)
  // 点击确认按钮
  const handleConfirm = () => {
    const params = target ? {
      ...target,
      name
    } : {
      name
    }
    dailyStore.updateDailyListItem(params)
    handleEditClose()
    if (!target) {
      setName('')
      setRemind(false)
      setShowTime(false)
    }
    dailyStore.setIsSet(false)
  }
  const ref = useRef()
  const transition = (
    <Transition.Sequence>
      <Transition.In type="fade" />
      <Transition.Change interpolation="linear" />
      <Transition.Out type="fade" />
    </Transition.Sequence>
  )
  return (
    <Modal
      animationType="fade"
      onDismiss={ onDismiss }
      transparent
      visible={ visible }
    >
      <TouchableWithoutFeedback onPress={ handleEditClose }>
        <View style={ styles.container } />
      </TouchableWithoutFeedback>
      <Transitioning.View
        // onLayout={ eve => setTop(height / 2 - eve.nativeEvent.layout.height / 2) }
        ref={ ref }
        style={ [ styles.modal, {
          top: 200
        } ] }
        transition={ transition }
      >
        <Text style={ styles.title }>{ target ? '编辑事项' : '添加事项' }</Text>
        <TextInput
          caretHidden
          clearButtonMode="while-editing"
          keyboardAppearance="dark"
          maxLength={ 30 }
          multiline
          onChangeText={ handleNameChange }
          placeholder="请输入事项名称"
          placeholderTextColor="#444"
          returnKeyType="next"
          style={ styles.textInput }
          value={ name }
        />

        <View style={ styles.row }>
          <Text style={ styles.rowTitle }>Reminds</Text>
          <Switch
            onValueChange={ handleRemindChange }
            trackColor={ { false: '', true: '#4192D9' } }
            value={ remind }
          />
        </View>
        <Animated.View style={ [ styles.row, {
          height: AnimatedHeight
        } ] }
        >
          {
            showTime && (
              <TouchableOpacity onPress={ handlePressTime }>
                <Text style={ [ styles.rowTitle, { color: '#999' } ] }>{ moment(remindTime).format('LLL') }</Text>
              </TouchableOpacity>
            )
          }
        </Animated.View>
        <View style={ styles.footer }>
          <TouchableOpacity
            onPress={ handleEditClose }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>取消</Text>
            </View>
          </TouchableOpacity>
          <View style={ {
            height: 50,
            width: 1,
            backgroundColor: '#444'
          } }
          ></View>
          <TouchableOpacity
            onPress={ handleConfirm }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>确定</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Transitioning.View>
      <TimePickModal
        defaultTime={ remindTime }
        handleClose={ () => setShowTimePicker(false) }
        setTime={ setRemindTime }
        visible={ showTimePicker }
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modal: {
    width: 300,
    left: width / 2 - 150,
    position: 'absolute',
    backgroundColor: 'rgba(47,47,47,0.95)',
    borderRadius: 14,
    paddingTop: 30
  },
  title: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  content: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    borderTopColor: '#444',
    borderTopWidth: 1,
    marginTop: 40
    // width: 280
  },
  button: {
    // flex: 1,
    height: 50,
    // backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: '#2e73bd',
    fontSize: 16,
    fontWeight: '700'
  },
  textInput: {
    paddingLeft: 40,
    paddingRight: 40,
    color: '#FFF',
    fontSize: 16
    // textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20
    // marginBottom: 20
  },
  rowTitle: {
    color: '#666',
    fontSize: 16
  }
})