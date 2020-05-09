/*
 * @Descripttion : 提示是否需要补卡
 * @Author       : lizhaokang
 * @Date         : 2020-05-08 18:14:58
 */
import React, { useState } from 'react';
import dailyStore from './dailyStore'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')
export default function DeleteModal ({ visible = false, setVisible, onYesterday, onToday }) {
  const handleCloseModal = () => {
    setVisible(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={ visible }
    >
      <TouchableWithoutFeedback onPress={ handleCloseModal }>
        <View style={ styles.container } />
      </TouchableWithoutFeedback>
      <View
        style={ [ styles.modal, {
          top: height / 2 - 80
        } ] }
      >
        <Text style={ styles.content }>检测到该事件昨天未完成，请确认本次打卡的时间</Text>
        <View style={ styles.footer }>
          <TouchableOpacity
            onPress={ onYesterday }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>昨天</Text>
            </View>
          </TouchableOpacity>
          <View style={ {
            width: 1,
            backgroundColor: '#444'
          } }
          ></View>
          <TouchableOpacity
            onPress={ onToday }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>今天</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modal: {
    width: 280,
    left: width / 2 - 140,
    position: 'absolute',
    backgroundColor: 'rgba(47,47,47,0.95)',
    borderRadius: 14,
    paddingTop: 30
  },
  content: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20
    // lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    borderTopColor: '#484547',
    borderTopWidth: 1,
    marginTop: 20
  },
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: '#5291ee',
    fontSize: 16
  }
})