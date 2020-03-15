/**
 * 加载组件
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { loading } from 'src/assets/image'
export default function Loading() {
  const [ rotate ] = useState(new Animated.Value(0))
  const spin = () => {
    rotate.setValue(0)
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000
    }).start(() => {
      spin()
    })
  }
  useEffect(() => {
    spin()
  }, [])
  const AnimatedRotate = rotate.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ '0deg', '360deg' ]
  })
  return (
    // <View style={ styles.container }>
    <Animated.Image source={ loading }
      style={ [ styles.image, {
        transform: [ { rotate: AnimatedRotate } ]
      } ] }
    />
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220
  },
  image: {
    height: 80,
    width: 80,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginBottom: -40
  }
})