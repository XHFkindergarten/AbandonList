/**
 * 删除item提示框
 */

import React, { useState } from 'react';
import dailyStore from './dailyStore'
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')
export default function DeleteModal ({ visible, setVisible, targets }) {
  const handleCloseModal = () => {
    setVisible(false)
  }
  // const [ top, setTop ] = useState(0)
  const handleCancel = () => {
    setVisible(false)
  }
  const handleDelete = () => {
    dailyStore.deleteDailyListItems(targets.map(item => item.id))
    setVisible(false)
    dailyStore.setIsSet(false)
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
        { /* <Text style={ styles.title }>提示</Text> */ }
        <Text style={ styles.content }>是否确定删除事件</Text>
        <Text
          style={ [ styles.content, {
            fontWeight: '500',
            lineHeight: 24
          } ] }
        >{ targets.map(item => item.name).join('、') }</Text>

        <Text style={ [ styles.content, { fontSize: 12 } ] }>删除事项后无法恢复，但过去的完成数据仍然有效</Text>
        <View style={ styles.footer }>
          <TouchableOpacity
            onPress={ handleCancel }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>取消</Text>
            </View>
          </TouchableOpacity>
          <View style={ {
            width: 1,
            backgroundColor: '#444'
          } }
          ></View>
          <TouchableOpacity
            onPress={ handleDelete }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ [ styles.btnText, {
                color: '#d91e18'
              } ] }
              >删除</Text>
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