import PushNotificationIOS from '@react-native-community/push-notification-ios'
import moment from 'moment'

// IOS下的日期格式处理
const convertDateIOS = target => moment.utc(target).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

/**
 * 通知模块
 */
class Notification {

  // 初始化通知模块
  initialNotification = () => new Promise((resolve, reject) => {
    // 检查通知全新啊
    PushNotificationIOS.checkPermissions(async res => {
      let isBlock = false
      for(let i of Object.keys(res)) {
        if (!res[i]) {
          isBlock = true
          // 获取权限
          await PushNotificationIOS.requestPermissions()
            .catch(err => reject(err))
          resolve()
          return
        }
      }
      if (!isBlock) {
        resolve()
      }
    })
  })

  onPresentNotification = instance => {
    // 获取当前角标数
    const badgeNum = instance.getBadgeCount()
    PushNotificationIOS.setApplicationIconBadgeNumber(badgeNum > 1 ? badgeNum - 1 : 0)
  }

  initialListener = () => {
    // 添加本地通知监听事件
    PushNotificationIOS.addEventListener('localNotification', this.onPresentNotification)
  }

  // 移除本地监听事件
  removeListeners = () => {
    PushNotificationIOS.removeEventListener('localNotification', this.onPresentNotification)
  }

  // 设定定时通知
  setScheduleNotification = option => {
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
      applicationIconBadgeNumber: 1,
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
  // 清空应用角标数
  clearBadgeNum = () => {
    this.setBadge(0)
  }
}

export default new Notification()