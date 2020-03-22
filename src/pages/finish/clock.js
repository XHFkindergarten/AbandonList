import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Switch, Image } from 'react-native';
import { clock, clockActive } from 'src/assets/image'
import { useFocusEffect } from '@react-navigation/native'
import finishStore from './store'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/min/moment-with-locales'

moment.locale('zh-cn');

export function SelectReviewTime({ route }) {
  console.log('scrollRef', route.params.scrollRef)
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
    navigation.navigate('selectReviewTime')
  }
  const { reviewTime } = finishStore
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
          <Image source={ reviewTime ? clockActive : clock }
            style={ styles.addCircle }
          />
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
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 20
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
  addCircle: {
    height: 24,
    width: 24
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