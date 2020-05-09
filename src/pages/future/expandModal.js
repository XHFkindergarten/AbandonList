import React, { useState, useMemo, useEffect, Fragment, useContext } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View, Dimensions, Animated, StyleSheet, Image } from 'react-native'
import { BlurView } from '@react-native-community/blur';
import srcStore from 'src/store'
import { beforeNow } from 'src/utils'
import finishStore from 'src/pages/finish/store'
import { info_, correctGreen, wrongRed } from 'src/assets/image'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemeContext from 'src/themeContext'

const { width, height } = Dimensions.get('window')
const CardExpandModal = ({ setVisible, info }) => {
  const handleClose = () => {
    setVisible(false)
  }
  const [ AnimatedScale ] = useState(new Animated.Value(0.2))
  // component did mount
  useEffect(() => {
    Animated.spring(AnimatedScale, {
      toValue: 1
    }).start()
  }, [])


  const theme = useContext(ThemeContext)

  const handleFinish = () => {
    finishStore.addHistoryItem(info, false)
    srcStore.removeFutureListItem(info)
    setVisible(false)
  }

  // 点击删除
  const handleRemove = () => {
    finishStore.addHistoryItem(info, true)
    srcStore.removeFutureListItem(info)
    setVisible(false)
  }

  const fromNowTime = beforeNow(info.createdAt)

  return (
    <Modal
      animationType="fade"
      transparent
      visible
    >
      <TouchableWithoutFeedback onPress={ handleClose }>
        <BlurView
          blurAmount={ 10 }
          blurType="extraDark"
          style={ {
            flex: 1
          } }
        />
      </TouchableWithoutFeedback>
      <Animated.View style={ [ styles.card, {
        backgroundColor: theme.subColor,
        transform: [ { scaleY: AnimatedScale } ]
      } ] }
      >
        <View>
          <Text style={ styles.cardName }>{ info.title }</Text>
          <View style={ {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          } }
          >
            <View style={ [ styles.circle, {
              backgroundColor: info.calendar.color
            } ] }
            />
            <Text style={ {
              color: theme.subText,
              fontSize: 14,
              fontWeight: '500'
            } }
            >{ info.calendar.title }</Text>
          </View>
          <View style={ styles.row }>
            <Image source={ info_ }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ info.notes ? info.notes : '暂无备注' }</Text>
          </View>
          <View style={ styles.row }>
            <Image source={ info_ }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ `${fromNowTime} 创建` }</Text>
          </View>
        </View>
        <View style={ {
          position: 'absolute',
          bottom: -80,
          width: width - 40,
          flexDirection: 'row',
          justifyContent: 'space-around'
        } }
        >
          <TouchableOpacity
            onPress={ handleFinish }
            style={ {
              padding: 20
            } }
          >
            <Image source={ correctGreen }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ handleRemove }
            style={ {
              padding: 20
            } }
          >
            <Image source={ wrongRed }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  )
}

export default (CardExpandModal)

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2F2F2F',
    width: width - 40,
    position: 'absolute',
    top: height / 2 - 200,
    left: 20,
    borderRadius: 6,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 30
  },
  cardName: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center'
  },
  row: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  circle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 5
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 10
  },
  content: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '300',
    flex: 1
  },
  handleIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  }
})