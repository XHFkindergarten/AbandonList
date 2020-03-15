/* eslint-disable no-undef */
import { Dimensions } from 'react-native'
import moment from 'moment'
import { Vibrate } from 'react-native-mo-vibrate'

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
    if (startTime - nowTime < 1000 * 60 * 60 * 24) {
      // 一天之内开始
      outputTime = 'start ' + moment(info.startDate).endOf('hour').fromNow()
    } else {
      outputTime = 'start ' + moment(info.startDate).endOf('day').fromNow()
    }
  } else if (nowTime < endTime) {
    if (endTime - nowTime < 1000 * 60 * 60 * 24) {
      // 一天之内结束
      outputTime = 'end ' + moment(info.endDate).endOf('hour').fromNow()
    } else {
      outputTime = 'end ' + moment(info.endDate).endOf('day').fromNow()
    }
  } else {
    if (nowTime - endTime < 1000 * 60 * 60 * 24) {
      outputTime = 'end ' + moment(info.endDate).startOf('hour').fromNow()
    } else {
      outputTime = 'end ' + moment(info.endDate).startOf('day').fromNow()
    }
  }
  return outputTime
}

// 获取当月天数
export const getMonthDay = day => {
  const newDay = new Date(day)
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

/**
 * 将HEX色值转换成RGB色值
 */

// function HEX2RGB(color) {
//   // 接受#000和#000000格式的HEX色值
//   const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
//   let sColor = color.toLowerCase()
//   if (sColor && reg.test(sColor)) {
//     if (sColor.length === 4) {
//       // 将3位色值转换成6位
//       let sColorNew = '#'
//       for(let i = 1;i < 4;i++) {
//         sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
//       }
//       sColor = sColorNew
//     }
//     // 处理6位色值
//     const sColorChange = []
//     for(let i = 1;i < 7;i += 2) {
//       sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
//     }
//     return sColorChange
//   } else {
//     return false
//   }
// }

// /**
//  * 根据RGB色值判断颜色属于亮色还是暗色
//  * 决定字体颜色
//  */
// export function isDarkColor(hex) {
//   const rgb = HEX2RGB(hex)
//   // 格式不规范默认属于暗色
//   if (!rgb) {
//     return true
//   }
//   const value = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114
//   console.log(value)
//   return value < 110
// }

