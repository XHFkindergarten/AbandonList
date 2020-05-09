/* eslint-disable no-undef */
import { Dimensions } from 'react-native'
import moment from 'moment/min/moment-with-locales'
import { Vibrate } from 'react-native-mo-vibrate'
import AsyncStorage from '@react-native-community/async-storage';
moment.locale('zh-cn');
/**
 * 工具类函数
 */
export const navObserver = require('./nativeCalendar')
/**
 * 判断是否是刘海屏新款iPhone
 */
const versionSizeList = [
  '{"width":375,"height":812}',
  '{"width":414,"height":896}'
]
export const isNewIPhone = () => {
  const { width, height } = Dimensions.get('window')
  return versionSizeList.includes(JSON.stringify({ width, height }))
}

/**
 * 获取事件时间距离目前的时间
 * @param {卡片信息} info
 */
export const fromNow = info => {
  const nowTime = new Date().getTime()
  const startTime = new Date(info.startDate).getTime()
  const endTime = new Date(info.endDate).getTime()
  let outputTime
  if (nowTime < startTime) {
    if (startTime - nowTime < 1000 * 60 * 60) {
      // 一小时之内开始
      outputTime = moment(info.startDate).endOf('minute').fromNow() + '开始'
    } else if (startTime - nowTime < 1000 * 60 * 60 * 24) {
      // 一天之内开始
      outputTime = moment(info.startDate).endOf('hour').fromNow() + '开始'
    } else {
      outputTime = moment(info.startDate).endOf('day').fromNow() + '开始'
    }
  } else if (nowTime < endTime) {
    if (endTime - nowTime < 1000 * 60 * 60) {
      outputTime = moment(info.endDate).endOf('minute').fromNow() + '结束'
    } else if (endTime - nowTime < 1000 * 60 * 60 * 24) {
      // 一天之内结束
      outputTime = moment(info.endDate).endOf('hour').fromNow() + '结束'
    } else {
      outputTime = moment(info.endDate).endOf('day').fromNow() + '结束'
    }
  } else {
    if (nowTime - endTime < 1000 * 60 * 60 * 24) {
      outputTime = moment(info.endDate).startOf('hour').fromNow() + '结束'
    } else {
      outputTime = moment(info.endDate).startOf('day').fromNow() + '结束'
    }
  }
  return outputTime
}

// 获取当月天数
export const getMonthDay = day => {
  const newDay = new Date(day)
  newDay.setDate(28) // 防止日期溢出到下下个月
  newDay.setMonth(newDay.getMonth() + 1)
  newDay.setDate(0)
  return newDay.getDate()
}

// 中文2个字符，英文数字1个。默认长度不得超过20个字符
const CNpattern = new RegExp('[\u4E00-\u9FA5]+');
export const elipsis = (text, limit = 17) => {
  let res = ''
  let len = 0
  for (let i of text) {
    res += i
    len += CNpattern.test(i) ? 2 : 1
    if (len > limit) {
      return res + '...'
    }
  }
  return res
}
/**
 * 点击产生轻微抖动效果
 * TAP: "tap"
 * MEDIUM: "medium"
 * HEAVY: "heavy"
 * TWICE: "twice"
 * @param index enum[ 0, 1, 2, 3 ]
 */
const VibrateType = [ 'tap', 'medium', 'heavy', 'twice' ]
export const vibrate = (index = 1) => {
  Vibrate.vibrate(VibrateType[index])
}

const firstLaunchKey = '@first_launch_key'

/**
 * 判断是否是第一次打开App
 */
export function isFirstOpen() {
  return new Promise(resolve => {
    AsyncStorage.getItem(firstLaunchKey).then(res => {
      if (!res) {
        resolve('first')
      } else {
        resolve('')
      }
    })
  })
}

export function getStorage(key) {
  return new Promise(async resolve => {
    const value = await AsyncStorage.getItem(key)
    resolve(value)
  })
}
export function setStorage(key, value) {
  return new Promise(async resolve => {
    await AsyncStorage.setItem(key, value)
    resolve(value)
  })
}

/**
 * 获取用户设置的全局主题色
 */
const themeColorKey = '@global_theme_color_set'
export function getGlobalTheme() {
  return new Promise(async (resolve, reject) => {
    const setedColor = await getStorage(themeColorKey)
    if (setedColor) {
      resolve(setedColor)
    } else {
      reject()
    }
  })
}

/**
 * 设置用户设置的全局主题色
 */
export function setGlobalTheme(color) {
  return new Promise(async (resolve, reject) => {
    setStorage(themeColorKey, color).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
