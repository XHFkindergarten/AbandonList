import PushNotificationIOS from '@react-native-community/push-notification-ios'

/**
 * 通知模块
 */
class Notification {

  // 设定定时通知
  setScheduleNotification = option => {
    PushNotificationIOS.scheduleLocalNotification({
      // 通知事件
      fireDate: option.fireDate,
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
      // repeatInterval: 'minute'
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
      console.log('all schedule', res)
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