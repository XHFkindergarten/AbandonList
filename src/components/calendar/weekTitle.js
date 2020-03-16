/**
 * 周一~周日标题
 */
import React, { useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types'
import themeContext from 'src/themeContext'


export default function WeekTitle({ width = 375 }) {
  const theme = useContext(themeContext)
  return (
    <View style={ [ styles.container, { width: width - 60 } ] }>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>日</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>一</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>二</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>三</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>四</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>五</Text>
      <Text style={ [ styles.text, { color: theme.mainText } ] }>六</Text>
    </View>
  )
}

WeekTitle.propTypes = {
  width: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  text: {
    // color: '#FFF',
    fontSize: 14
  }
})
