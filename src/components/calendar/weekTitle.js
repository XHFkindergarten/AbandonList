/**
 * 周一~周日标题
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types'


export default function WeekTitle({ width = 375 }) {
  return (
    <View style={ [ styles.container, { width: width - 60 } ] }>
      <Text style={ styles.text }>日</Text>
      <Text style={ styles.text }>一</Text>
      <Text style={ styles.text }>二</Text>
      <Text style={ styles.text }>三</Text>
      <Text style={ styles.text }>四</Text>
      <Text style={ styles.text }>五</Text>
      <Text style={ styles.text }>六</Text>
    </View>
  )
}

WeekTitle.propTypes = {
  width: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    // marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  text: {
    color: '#FFF',
    fontSize: 14
  }
})
