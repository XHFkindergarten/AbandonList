/**
 * 全局提示框
 */

import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')
export default function GlobalModal({ visible, setVisible }) {
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
        <View>
          <Text style={ styles.content }>
            提示内容
          </Text>
        </View>
        <View style={ styles.footer }>
          <TouchableOpacity
            onPress={ handleCloseModal }
            style={ {
              flex: 1
            } }
          >
            <View style={ styles.button }>
              <Text style={ styles.btnText }>确定</Text>
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
  content: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 20
  },
  modal: {
    width: 280,
    left: width / 2 - 140,
    position: 'absolute',
    backgroundColor: 'rgba(47,47,47,0.95)',
    borderRadius: 14,
    paddingTop: 30
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