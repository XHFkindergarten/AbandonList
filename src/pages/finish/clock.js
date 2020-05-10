import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Linking, Text, Switch, Image } from 'react-native';
import Svgs from 'src/assets/svg'
import { useFocusEffect } from '@react-navigation/native'
import finishStore from './store'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/min/moment-with-locales'
import Notification from 'src/utils/Notification'
import themeContext from 'src/themeContext'


moment.locale('zh-cn');

export function SelectReviewTime({ route }) {
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      finishStore.toggleIsEditReview(true)
      return () => {
        // Do something when the screen is unfocused
        finishStore.toggleIsEditReview(false)
      }
    }, [])
  )
  useEffect(() => {
    // component did mount
    // scrollView滚动到顶端
    const { scrollRef } = route.params
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0 })
    }
    const reviewTime = finishStore.reviewTime
    if (reviewTime) {
      setNoti(true)
      setTime(new Date(reviewTime))
    }
  }, [])
  // const defaultReviewTime = new Date(finishStore.reviewTime) || new Date()
  const defaultTime = new Date()
  defaultTime.setHours(22,0,0,0)
  const [ time, setTime ] = useState(defaultTime)
  const [ noti, setNoti ] = useState(false)
  const onTimeChange = (event, newTime) => {
    setTime(newTime)
    if (noti) {
      finishStore.updateReviewTime(newTime)
    }
  }
  const onNotiChange = value => {
    setNoti(value)
    if (value) {
      finishStore.updateReviewTime(new Date(time))
    } else {
      finishStore.updateReviewTime('')
    }
  }
  return (
    <View
      style={ {
        paddingLeft: 20,
        paddingRight: 20
      } }
    >
      <View style={ styles.row }>
        <Text style={ styles.rowLabel }>回顾</Text>
        <Switch
          onValueChange={ onNotiChange }
          trackColor={ { false: '', true: '#4192D9' } }
          value={ noti }
        />
      </View>
      <DateTimePicker
        locale="zh-Hans"
        mode={ 'time' }
        onChange={ onTimeChange }
        value={ time }
      />
    </View>
  )
}

/**
 * 设置提醒时间
 */
function StoreReview({ navigation }) {
  const handlePress = () => {
    Notification.withAuth(false).then(() => {
      navigation.navigate('selectReviewTime')
    }).catch(() => {
      Alert.alert(
        '提示',
        '请开启通知权限',
        [
          {
            text: '确定',
            onPress: () => {

            }
          },{
            text: '去开启通知',
            onPress: () => {
              Linking.openURL('app-settings:')
            }
          }
        ]
      )
    })
  }
  const { reviewTime } = finishStore

  const theme = useContext(themeContext)
  return (
    <View style={ {
      paddingLeft: 20,
      paddingRight: 20
      // alignItems: 'center'
    } }
    >
      <TouchableOpacity onPress={ handlePress }>
        <View style={ styles.container }>
          <Text style={ styles.title }>回顾</Text>
          <Svgs.Clock
            fill={ reviewTime ? theme.themeColor : '#FFF' }
            height={ 28 }
            width={ 28 }
          />
          { /* <Image source={ reviewTime ? clockActive : clock }
            style={ styles.addCircle }
          /> */ }
        </View>
      </TouchableOpacity>
      <View style={ {
        alignItems: 'center'
      } }
      >
        <Text style={ [ styles.subTitle , {
          marginTop: 20
        } ] }
        >在每天{ reviewTime ? moment(new Date(reviewTime)).format('a h:mm') : '的特定时间' }回顾整理当天日程</Text>
      </View>
      <View style={ {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
      } }
      ></View>
    </View>
  )
}




export default StoreReview

const styles = StyleSheet.create({
  container: {
    // marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 10
  },
  rowLabel: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 20
  },
  subTitle: {
    width: 300,
    lineHeight: 20,
    textAlign: 'center',
    color: '#8a8a8a',
    fontSize: 14
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingLeft: 20,
    // paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    height: 40
  },
  label: {
    color: '#FFF',
    fontSize: 16
  }
})