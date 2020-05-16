/**
 * 全局提示框
 */

import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';


const { width, height } = Dimensions.get('window')
export default function GlobalModal({ visible, setVisible, content, title }) {
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

      <View style={ styles.modal }>
        <BlurView
          blurAmount={ 100 }
          blurType="dark"
          reducedTransparencyFallbackColor="light"
        />
        <View style={ {
          paddingTop: 10,
          paddingBottom: 20,
          alignItems: 'center',
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          flex: 1
        } }
        >
          <View style={ styles.preContent }>
            <Text style={ styles.title }>{ title || 'Tips' }</Text>
            {
              typeof content === 'string' ? (
                <Text style={ styles.content }>
                  { content }
                </Text>
              ) : content
            }
          </View>
          <TouchableOpacity onPress={ handleCloseModal }>
            <View style={ styles.confirmBtn }>
              <Text style={ {
                fontSize: 16,
                color: '#FFF'
              } }
              >OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
  title: {
    fontFamily: 'Century Gothic',
    fontSize: 24,
    fontWeight: '500',
    color: '#FFF'
  },
  content: {
    color: '#888',
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 24,
    marginVertical: 20
  },
  confirmBtn: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1b1b1b',
    justifyContent: 'center',
    alignItems: 'center'
  },
  preContent: {
    alignItems: 'center'
  },
  modal: {
    minHeight: 300,
    top: height / 2 - 120,
    width: 280,
    left: width / 2 - 140,
    position: 'absolute',
    backgroundColor: 'rgba(97, 97, 97, 0.6)',
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