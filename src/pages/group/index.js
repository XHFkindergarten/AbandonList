import React, { useEffect, useCallback } from 'react';
import { View,Text, StyleSheet } from 'react-native';
import store from 'src/store'
import { useFocusEffect } from '@react-navigation/native';
import navObserver from 'src/utils/navObserver'
import nativeCalendar from 'src/utils/nativeCalendar'

function Group({ navigation }) {
  // 分组信息
  const { groupStorage:groups } = nativeCalendar
  return (
    <View style={ styles.container }>
      <Text style={ styles.pageTitle }>Groups</Text>
      <Text style={ styles.subTitle }>默认分组</Text>
      {
        groups.map((item, index) => (
          <View key={ item.id }
            style={ styles.row }
          >
            <View style={ {
              flexDirection: 'row',
              alignItems: 'center'
            } }
            >
              <View style={ [ styles.circle, {
                backgroundColor: item.color
              } ] }
              />
              <Text style={ styles.groupLabel }>{ item.title }</Text>
            </View>
          </View>
        ))
      }
    </View>
  )
}
export default (Group)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40
  },
  pageTitle: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '900',
    marginBottom: 20
  },
  subTitle: {
    fontSize: 22,
    color: '#FFF'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  groupLabel: {
    color: '#999',
    fontSize: 18
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5
  }
})