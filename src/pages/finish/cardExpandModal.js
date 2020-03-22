import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View, Dimensions, Animated, StyleSheet, Image } from 'react-native'
import { BlurView } from '@react-native-community/blur';
import { info_, ring, refresh, circleWrong, shalou, type } from 'src/assets/image'
import moment from 'moment/min/moment-with-locales'
import srcStore from 'src/store'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Notification from 'src/utils/Notification'
import ThemeContext from 'src/themeContext'

moment.locale('zh-cn');
const { width, height } = Dimensions.get('window')
const CardExpandModal = ({ setVisible, info, handleAbandon, handleFinish }) => {
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
  const [ ringText, setRingText ] = useState('')
  Notification.getScheduleList().then(res => {
    const scheduleList = res.filter(item => item.userInfo.id === info.id)
    if (info.allDay && scheduleList.length) {
      setRingText('将会在当日早晨8:00AM提醒')
      return
    }
    if (scheduleList.length === 2) {
      setRingText('将会在事件开始和结束时时提醒')
    } else if (scheduleList.length === 1) {
      if (scheduleList[0].alertBody.endsWith('开始')) {
        setRingText('将会在事件开始时提醒')
      } else if (scheduleList[0].alertBody.endsWith('结束')) {
        setRingText('将会在事件结束时提醒')
      }
    } else {
      setRingText('暂无提醒')
    }
  })

  const theme = useContext(ThemeContext)

  const finishDate = info.finishDate

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
          {
            info.allDay ? (
              <View style={ styles.row }>
                <Image source={ shalou }
                  style={ [ styles.icon, { transform: [ { rotate: '180deg' } ] } ] }
                ></Image>
                <Text style={ styles.content }>{ moment(info.startDate).format('LL') + '全天' }</Text>
              </View>
            ) : (
              <Fragment>
                <View style={ styles.row }>
                  <Image source={ shalou }
                    style={ [ styles.icon, { transform: [ { rotate: '180deg' } ] } ] }
                  ></Image>
                  <Text style={ styles.content }>{ moment(info.startDate).format('LLL') }</Text>
                </View>
                <View style={ styles.row }>
                  <Image source={ shalou }
                    style={ styles.icon }
                  ></Image>
                  <Text style={ styles.content }>{ moment(info.endDate).format('LLL') }</Text>
                </View>
              </Fragment>
            )
          }
          <View style={ styles.row }>
            <Image source={ type }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ `${info.isDelete ? '删除' : '完成'}于${moment(finishDate).format('lll')}` }</Text>
          </View>
          <View style={ styles.row }>
            <Image source={ ring }
              style={ styles.icon }
            ></Image>
            <Text style={ styles.content }>{ ringText }</Text>
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
            <Image source={ refresh }
              style={ styles.handleIcon }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ handleAbandon }
            style={ {
              padding: 20
            } }
          >
            <Image source={ circleWrong }
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