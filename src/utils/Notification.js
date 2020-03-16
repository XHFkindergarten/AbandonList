import PushNotificationIOS from '@react-native-community/push-notification-ios'
import moment from 'moment'

// IOS下的日期格式处理
const convertDateIOS = target => moment.utc(target).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

/**
 * 通知模块
 */
class Notification {

  // 初始化通知模块
  initialNotification = () => {
    PushNotificationIOS.checkPermissions(res => {
      for(let i of Object.keys(res)) {
        if (!res[i]) {
          // 获取权限
          PushNotificationIOS.requestPermissions()
          return
        }
      }
    })
  }

  // 设定定时通知
  setScheduleNotification = option => {
    console.log('option', option)
    console.log(convertDateIOS(option.fireDate))
    PushNotificationIOS.scheduleLocalNotification({
      // 通知事件
      fireDate: convertDateIOS(option.fireDate),
      // 标题
      alertTitle: option.alertTitle,
      // 正文
      alertBody: option.alertBody,
      // 附加参数
      userInfo: {
        id: option.id
      },
      // 重复规则[enum: minute, hour, day, week, month, year]
      repeatInterval: option.repeatInterval
    })
  }

  // 删除指定id的所有通知事件
  removeTarget = id => {
    PushNotificationIOS.cancelLocalNotifications({
      id
    })
  }

  // 获取所有的定时事件[测试]
  getScheduleList = () => new Promise((resolve) => {
    PushNotificationIOS.getScheduledLocalNotifications(res => {
      resolve(res)
    })
  })

  // 删除所有本地通知
  removeAllSchedule = () => {
    PushNotificationIOS.cancelAllLocalNotifications()
  }


  // 发送本地通知[理论上不会用到,测试用]
  sendLocalNotification = item => {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'haha',
      alertBody: '测试'
      // applicationIconBadgeNumber: item
    })
  }

  // 获取当前应用的角标数
  getBadge = () => new Promise((resolve, reject) => {
    PushNotificationIOS.getApplicationIconBadgeNumber(res => {
      resolve(res)
    })
  })

  // 设置应用角标
  setBadge = num => {
    PushNotificationIOS.setApplicationIconBadgeNumber(num)
  }
}

export default new Notification()