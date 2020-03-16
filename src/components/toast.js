/**
 * 提示toast组件
 */
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Transitioning, Transition } from 'react-native-reanimated'
let timeoutId1, timeoutId2
export default function Toast({ visible, setVisible, message }) {
  const transition = (
    <Transition.Sequence>
      <Transition.In durationMs={ 300 }
        type="fade"
      />
      <Transition.Change interpolation="easeInOut" />
      <Transition.Out durationMs={ 300 }
        type="fade"
      />
    </Transition.Sequence>
  )
  const [ show, setShow ] = useState(false)
  const ref = useRef()
  useEffect(() => {
    // 清除所有定时器
    clearTimeout(timeoutId1)
    clearTimeout(timeoutId2)
    if (visible) {
      if (ref.current) {
        ref.current.animateNextTransition()
        setShow(true)
      }
      timeoutId1 = setTimeout(() => {
        if (ref.current) {
          ref.current.animateNextTransition()
        }
        setShow(false)
        timeoutId2 = setTimeout(() => {
          setVisible(false)
        }, 300)
      }, 2000)
    }
    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [ visible ])
  return (
    visible && (
      <Transitioning.View ref={ ref }
        style={ styles.container }
        transition={ transition }
      >
        {
          show && <View style={ styles.toast }>
            <Text style={ styles.label }>{ message }</Text>
          </View>
        }
      </Transitioning.View>
    )
  )
}
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    width,
    height: 50,
    alignItems: 'center'
  },
  toast: {
    height: 50,
    minWidth: 120,
    maxWidth: 300,
    backgroundColor: 'rgba(255, 255, 255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center'
  }
})