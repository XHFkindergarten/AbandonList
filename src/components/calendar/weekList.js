import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'
import CircleItem, { EmptyItem } from './circleItem'
const { width } = Dimensions.get('window')
export default function WeekList({ weekArray, index }) {
  const withColor = index === 1
  return (
    <View
      style={ styles.container }
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
            <EmptyItem />
          )
        }
      }) }
    </View>
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