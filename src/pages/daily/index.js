import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Animated, PixelRatio, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react';
import dailyStore from './dailyStore'
import DeleteModal from './deleteModal'
import DailyItem from './dailyItem'
import srcStore from 'src/store'
import themeContext from 'src/themeContext'
import { checkFirstIn, isNewIPhone } from 'src/utils'
let notifyTimeout
function Daily({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      srcStore.updateBottomNavName('Daily')
      return () => {
        // Do something when the screen is unfocused
        // 取消设置状态
        dailyStore.setIsSet(false)
      }
    }, [])
  )
  // component did mount
  useEffect(() => {
    // 以防万一,挂载时也初始化一下数据
    dailyStore.initialDailyStore()
    // 初次进入页面展示提示
    checkFirstIn('daily').then(res => {
      if (res) {
        notifyTimeout = setTimeout(() => {
          srcStore.globalNotify('daily功能指引\n1. 点击右上方按钮创建卡片\n2. 长按卡片标记完成，再次长按取消\n3. 点击下方彩色按钮进入编辑模式\n4. 【新功能】缺卡时将自动提示补卡')
        }, 600)
      }
    })
    return () => {
      clearTimeout(notifyTimeout)
    }
  }, [])

  // 选中要删除的itemid
  const [ selectList, setSelectList ] = useState(new Set())


  const handleSelect = id => {
    const newset = new Set(selectList)
    newset.add(id)
    setSelectList(newset)
  }

  const handleUnselect = id => {
    const newset = new Set(selectList)
    newset.delete(id)
    setSelectList(newset)
  }

  const isSet = dailyStore.isSet


  useEffect(() => {
    if (isSet) {
      hideAddAnimation.start(() => {
        setShowDelete(true)
        showDeleteAnimation.start()
      })
    } else {
      setSelectList(new Set())
      hideDeleteAnimation.start(() => {
        setShowDelete(false)
        showAddAnimation.start()
      })
    }
  }, [ isSet ])

  // 控制删除按钮的显示
  const [ showDelete, setShowDelete ] = useState(false)
  const [ AnimatedAddScale ] = useState(new Animated.Value(1))
  const [ AnimatedDeleteScale ] = useState(new Animated.Value(0))
  const showDeleteAnimation = Animated.timing(AnimatedDeleteScale, {
    toValue: 1,
    duration: 200
    // delay: level * 100
  })
  const hideDeleteAnimation = Animated.timing(AnimatedDeleteScale, {
    toValue: 0,
    duration: 200
    // delay: level * 100
  })
  const showAddAnimation = Animated.timing(AnimatedAddScale, {
    toValue: 1,
    duration: 200
  })
  const hideAddAnimation = Animated.timing(AnimatedAddScale, {
    toValue: 0,
    duration: 200
    // delay: level * 100
  })


  const dailyList = []
  const dailyListData = dailyStore.dailyList
  if (typeof dailyListData === 'object') {
    for(let i of Object.keys(dailyListData)) {
      dailyList.push({
        ...dailyListData[i]
      })
    }
  }

  // 计算选中的item
  const selectItemList = useMemo(() => {
    return dailyList.filter(item => selectList.has(item.id))
  }, [ selectList ])

  // 显示删除确认框
  const [ showDeleteModal, setShowDeleteModal ] = useState(false)

  const handleConfirmDelete = () => {
    if (selectList.size) {
      setShowDeleteModal(true)
    }
  }

  const handleClickAdd = () => {
    navigation.navigate('AddDaily')
  }

  const theme = useContext(themeContext)

  return (
    <SafeAreaView style={ { flex: 1, paddingBottom: 60, backgroundColor: theme.mainColor } }>
      <View style={ [ styles.header , {
        backgroundColor: theme.mainColor
      } ] }
      >
        <Text style={ [ styles.pageTitle, {
          color: theme.mainText
        } ] }
        >Daily</Text>
        {
          showDelete ? (
            <TouchableOpacity onPress={ handleConfirmDelete }>
              <Animated.View style={ [ styles.addBtn , {
                backgroundColor: '#cf000f',
                transform: [ { scale: AnimatedDeleteScale } ]
              } ] }
              >
                <Text style={ styles.btnLabel }>-</Text>
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={ handleClickAdd }>
              <Animated.View style={ [ styles.addBtn, {
                backgroundColor: theme.themeColor,
                transform: [ { scale: AnimatedAddScale } ]
              } ] }
              >
                <Text style={ [ styles.btnLabel, {
                  color: theme.baseThemeText
                } ] }
                >+</Text>
              </Animated.View>
            </TouchableOpacity>
          )
        }
      </View>
      <ScrollView style={ {
        flex: 1,
        backgroundColor: theme.mainColor,
        marginTop: 40,
        paddingLeft: 20,
        paddingRight: 20
      } }
      >
        <View style={ {
          flex: 1,
          paddingBottom: 60,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          backgroundColor: theme.mainColor
        } }
        >
          {
            dailyList.map((item, index) => (
              // <View key={ index } />
              <DailyItem
                handleSelect={ handleSelect }
                handleUnselect={ handleUnselect }
                info={ item }
                isSet={ isSet }
                key={ item.id }
                level={ Math.ceil((index + 1) / 2) }
                navigation={ navigation }
                selectList={ selectList }
              />
            ))
          }
        </View>
      </ScrollView>
      <DeleteModal
        setVisible={ setShowDeleteModal }
        targets={ selectItemList }
        visible={ showDeleteModal }
      />
    </SafeAreaView>
  )
}
export default observer(Daily)

const styles = StyleSheet.create({
  // container: {
  //   flex: 1
  // },
  header: {
    paddingTop: isNewIPhone ? 60 : 40,
    paddingBottom: 20,
    borderBottomColor: '#444',
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    paddingRight: 20
  },
  addBtn: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#4192D9',
    borderRadius: 20
  },
  btnLabel: {
    color: '#FFF',
    fontSize: 20
  },
  pageTitle: {
    lineHeight: 40,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'left',
    fontFamily: 'ADAM.CG PRO',
    transform: [ { translateY: 5 } ]
  },
  col: {
    flex: 1,
    alignItems: 'center'
  }
})