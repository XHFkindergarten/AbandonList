/*
 * @Descripttion : 未来的事项列表
 * @Author       : lizhaokang
 * @Date         : 2020-05-09 22:11:52
 */
import React, { useContext, useCallback } from 'react';
import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import themeContext from 'src/themeContext'
import { useFocusEffect } from '@react-navigation/native';
import srcStore from 'src/store'
import { observer } from 'mobx-react';
import { isNewIPhone } from 'src/utils'
import Svgs from 'src/assets/svg'
import FutureCard from './futureCard'
import { FlatList } from 'react-native-gesture-handler';

const { height : screenHeight } = Dimensions.get('window')

const emptyHeight = screenHeight - (isNewIPhone ? 300 : 280)



function Future() {

  function EmptyElement() {
    return (
      <View style={ styles.emptyContainer }>
        <View style={ { alignItems: 'center' } }>
          <Svgs.Burger
            height={ 100 }
            style={ { marginBottom: 20 } }
            width={ 100 }
          />
          <Text style={ [ styles.tip, { color: theme.baseThemeText } ] }>
            qaq 暂时没有数据
          </Text>
          <Text style={ [ styles.tip, { color: theme.baseThemeText } ] }>
            请在创建日程时勾选【以后】
          </Text>
        </View>
      </View>
    )
  }

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

  const renderCardItem = ({ item }) => {
    return <FutureCard info={ item } />
  }

  return (
    <ScrollView style={ [ styles.container, { backgroundColor: theme.themeColor } ] }>
      <Text style={ [ styles.pageTitle, { color: theme.baseThemeText } ] }>Later</Text>
      <FlatList
        data={ futureList }
        keyExtractor={ item => item.id }
        ListEmptyComponent={ EmptyElement }
        renderItem={ renderCardItem }
      />
    </ScrollView>
  )
}

export default observer(Future)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isNewIPhone ? 60 : 40,
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
  },
  emptyContainer: {
    height: emptyHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tip: {
    fontSize: 16,
    lineHeight: 20
  }
})
