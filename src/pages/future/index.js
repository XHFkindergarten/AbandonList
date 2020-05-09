/*
 * @Descripttion : 未来的事项列表
 * @Author       : lizhaokang
 * @Date         : 2020-05-09 22:11:52
 */
import React, { useContext, useCallback } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import themeContext from 'src/themeContext'
import { useFocusEffect } from '@react-navigation/native';
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import FutureCard from './futureCard'
import { FlatList } from 'react-native-gesture-handler';

function Future() {

  useFocusEffect(
    useCallback(() => {
      srcStore.setShowBottom(false)
      return () => {
        srcStore.setShowBottom(true)
      }
    }, [])
  )

  const theme = useContext(themeContext)

  const futureList = srcStore.futureList
  console.log('future list', futureList)

  const renderCardItem = ({ item, index }) => {
    return <FutureCard info={ item } />
  }

  return (
    <ScrollView style={ [ styles.container, { backgroundColor: theme.themeColor } ] }>
      <Text style={ [ styles.pageTitle, { color: theme.baseThemeText } ] }>Later</Text>
      <FlatList data={ futureList }
        keyExtractor={ item => item.id }
        renderItem={ renderCardItem }
      />
    </ScrollView>
  )
}

export default observer(Future)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  pageTitle: {
    lineHeight: 40,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'left',
    fontFamily: 'ADAM.CG PRO',
    transform: [ { translateY: 5 } ],
    marginBottom: 20
  }
})
