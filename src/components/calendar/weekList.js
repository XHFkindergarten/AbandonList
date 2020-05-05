import React, { useRef, useMemo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'
import { Transition, Transitioning } from 'react-native-reanimated'
import CircleItem, { EmptyItem } from './circleItem'
const { width } = Dimensions.get('window')
export default function WeekList({ weekArray, index }) {
  const withColor = index === 1
  const transition = (
    <Transition.Together>
      <Transition.In type="fade" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.Out type="fade" />
    </Transition.Together>
  )
  const animateRef = useRef()
  useMemo(() => {
    if (animateRef.current) {
      animateRef.current.animateNextTransition()
    }
  })
  return (
    <Transitioning.View
      ref={ animateRef }
      style={ styles.container }
      transition={ transition }
    >
      { weekArray.map((item, index) => {
        if (item) {
          return (
            <CircleItem
              key={ index }
              time={ item }
              withColor={ withColor }
            ></CircleItem>
          )
        } else {
          return (
            <EmptyItem key={ index } />
          )
        }
      }) }
    </Transitioning.View>
  )
}
WeekList.propTypes = {
  weekArray: PropTypes.arrayOf(PropTypes.object)
}




const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width - 60,
    paddingTop: 5,
    paddingBottom: 5
    // height: 40
  }
})