import RNCalendarEvents from 'react-native-calendar-events'
import moment from 'moment'
import { observable, action } from 'mobx'
import finishStore from 'src/pages/finish/store'
import Notification from './Notification'
import dailyStore from 'src/pages/daily/dailyStore'
import AsyncStorage from '@react-native-community/async-storage'

const rememberGroupKey = '@remenber_group_key'

/**
 * 原生日历模块
 */
const repeatMap = [
  {
    label: 'Never',
    recurrence: '',
    value: {}
  },{
    label: 'Every Week',
    recurrence: 'weekly',
    value: {
      recurrence: 'weekly'
    }
  },{
    label: 'Every Month',
    recurrence: 'monthly',
    value: {
      recurrence: 'monthly'
    }
  },{
    label: 'Every Year',
    recurrence: 'yearly',
    value: {
      recurrence: 'yearly'
    }
  }
]

const notificationRepeatMap = {
  weekly: 'week',
  monthly: 'month',
  yearly: 'year'
}

const repeatGapTime = {
  weekly: 1000 * 60 * 60 * 24 * 7,
  monthly: 1000 * 60 * 60 * 24 * 7 * 30,
  yearly: 1000 * 60 * 60 * 24 * 7 * 30 * 12
}

// IOS下的日期格式处理
const convertDateIOS = target => moment.utc(target).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');


const visibleGroupKey = '@_visible_group_key'


class NativeCalendar {
  // 是否已经获得用户授权
  authorized = false
  // 获取当前权限状态
  checkAuth = () => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.authorizationStatus().then(res => {
        if (res !== 'authorized') {
          // 如果没有取得授权,申请日历权限
          RNCalendarEvents.authorizeEventStore().then(res => {
            if (res === 'denied') {
              // 用户拒绝了授权
              reject()
            } else {
              // 用户给与了授权
              // this.authorized = true
              resolve()
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          // 已有权限
          // this.authorized = true
          resolve()
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  withAuth = () => new Promise((resolve, reject) => {
    RNCalendarEvents.authorizationStatus().then(res => {
      if (res === 'authorized' || res === 'undetermined') {
        resolve()
      } else {
        reject()
      }
    })
  } )

  /**
   * 新增/更新 日历事件
   * @params title
   * @params details[ description, calendarId, startDate, endDate, allDay ]
   */
  saveEvent = props => {
    const { id, title, description, start, end, allDay, groupId, repeat, RAE, RAB } = props
    if (!title) {
      return Promise.resolve()
    }
    const idOption = id ? { id } : {}
    const repeatOption = repeat ? repeatMap.find(item => item.recurrence === repeat).value : {}
    return new Promise((resolve, reject) => {
      const details = Object.assign({}, {
        calendarId: groupId,
        startDate: convertDateIOS(new Date(start)),
        endDate: convertDateIOS(new Date(end)),
        allDay,
        notes: description
      }, repeatOption, idOption)
      RNCalendarEvents.saveEvent(
        title,
        details
      ).then(res => {
        // 清除这个事件的所有通知
        Notification.removeTarget(res)
        // 添加全天通知通知
        if (allDay && RAB) {
          const fireDate = new Date(start)
          fireDate.setHours(8,0,0,0)
          Notification.setScheduleNotification({
            fireDate: new Date(fireDate),
            alertTitle: 'Abandon List事件',
            alertBody: title + ' 全天',
            id: res,
            repeatInterval: repeat ? notificationRepeatMap[repeat] : ''
          })
        } else {
          if (RAB) {
            // 是否在事件开头设置通知
            const fireDate = new Date(start)
            Notification.setScheduleNotification({
              fireDate,
              alertTitle: 'Abandon List事件',
              alertBody: title + ' 开始',
              id: res,
              repeatInterval: repeat ? notificationRepeatMap[repeat] : ''
            })
          }
          if (RAE) {
            // 是否在事件结尾设置通知
            const fireDate = new Date(end)
            Notification.setScheduleNotification({
              fireDate,
              alertTitle: 'Abandon List事件',
              alertBody: title + ' 结束',
              id: res,
              repeatInterval: repeat ? notificationRepeatMap[repeat] : ''
            })
          }
        }
        resolve(res)
        AsyncStorage.setItem(rememberGroupKey, groupId)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 恢复一个事件
   */
  reCreateEvent = (event) => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.saveEvent(
        event.title,
        {
          calendarId: event.calendar.id,
          startDate: event.startDate,
          endDate: event.endDate,
          allDay: event.allDay,
          notes: event.notes
        }
      ).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }


  // 维护一个队列，用来记录用户的*连续*操作，例如完成/删除
  // 当队列为空时，再刷新数据
  removeQueue = new Set()

  /**
   * 移除事件，futureEvents决定是否删除同一series的后续事件
   */
  removeEvent = (event, futureEvents = true) => {
    if (!futureEvents) {
      dailyStore.handleCalendarItemFinish()
    }
    return new Promise(async (resolve, reject) => {
      // 加入处理队列代表正在处理
      this.removeQueue.add(event.id)
      console.log(this.removeQueue)
      // 原生模块resolve事件id
      const res = await RNCalendarEvents.removeEvent(
        event.id,
        {
          futureEvents,
          exceptionDate: convertDateIOS(new Date(event.startDate))
        }
      ).catch(err => {
        reject(err)
      })
      if (futureEvents) {
        // 如果是删除动作，清除全部对应的推送
        Notification.removeTarget(event.id)
      } else if (event.recurrence) {
        // 如果删除的是连续事件
        // 获取这个事件的通知列表
        const allSchedule = await Notification.getScheduleList()
        // 寻找到所有属于该事件的通知
        const eventSchedule = allSchedule.filter(item => item.userInfo.id === event.id)
        // 清除已有通知事件
        Notification.removeTarget(event.id)
        for(let i = 0;i < eventSchedule.length;i++) {
          // 为所有通知重新设定时间
          const item = eventSchedule[i]
          if (item.alertBody.endsWith(' 全天')) {
            let time = new Date(event.startDate).getTime() + repeatGapTime[event.recurrence]
            time = new Date(time).setHours(8, 0, 0, 0)
            Notification.setScheduleNotification({
              ...item,
              fireDate: new Date(time)
            })
          } else if (item.alertBody.endsWith(' 开始')) {
            let time = new Date(event.startDate).getTime() + repeatGapTime[event.recurrence]
            Notification.setScheduleNotification({
              ...item,
              fireDate: new Date(time)
            })
          } else if (item.alertBody.endsWith(' 结束')) {
            let time = new Date(event.endDate).getTime() + repeatGapTime[event.recurrence]
            Notification.setScheduleNotification({
              ...item,
              fireDate: new Date(time)
            })
          }
        }
      }
      // 将该事件保存到历史记录中
      finishStore.addHistoryItem(event, futureEvents)
      // 事件完成，从处理队列中删除
      resolve(res)
    })
  }

  // 当前可见的日历列表，默认只有初始日历
  visibleGroupIds = []

  initialVisibleGroup = () => {
    return new Promise(async (resolve, reject) => {
      // 读取本地存储中的数据
      const res = await AsyncStorage.getItem(visibleGroupKey).catch(() => {
        reject('get visible groups fail')
      })
      if (res) {
        const data = JSON.parse(res)
        this.visibleGroupIds = data
        finishStore.updateVisibleGroupIds(data)
        resolve()
      } else {
        this.visibleGroupIds = []
        finishStore.updateVisibleGroupIds([])
        resolve()
      }
    })
  }

  // 添加/删除一个可见的日历分组
  toggleVisibleGroupIds = id => {
    if (this.visibleGroupIds.includes(id)) {
      // 如果已经有了这个ID,删除
      this.visibleGroupIds = this.visibleGroupIds.filter(item => item !== id)
      finishStore.updateVisibleGroupIds(this.visibleGroupIds)
      this.saveVisibleGroup()
    } else {
      // 如果没有这个ID，添加到ids中
      this.visibleGroupIds = [
        ...this.visibleGroupIds,
        id
      ]
      finishStore.updateVisibleGroupIds(this.visibleGroupIds)
      this.saveVisibleGroup()
    }
  }

  // 存储可见分组数据到本地
  saveVisibleGroup = async () => {
    await AsyncStorage.setItem(visibleGroupKey, JSON.stringify(this.visibleGroupIds))
  }


  // 缓存本机的日历分组
  groupStorage = []

  // 获取本机所有日历[分组]
  getCalendarGroups = () => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.findCalendars().then(res => {
        this.groupStorage = [ ...res.filter(item => item.allowsModifications) ]
        // 初始化的时候做一个小备份
        finishStore.updateGroupStorage([ ...this.groupStorage ])
        // 如果没有可见的
        if (!this.visibleGroupIds.length) {
          this.visibleGroupIds = this.groupStorage.filter(p => p.isPrimary).map(item => item.id)
          finishStore.updateVisibleGroupIds(this.visibleGroupIds)
          this.saveVisibleGroup()
          // 如果可见日历数依然为0,提示用户去创建日历
          // if (this.visibleGroupIds.length === 0) {
          //   // TODO: 唤起全局提示框

          // }
        }
        resolve()
      }).catch(() => {
        reject('get group fail')
      })
    })
  }

  // 在本机日历中添加一个日历
  createCalendar = item => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.saveCalendar({
        title: item.name,
        color: item.color,
        entityType: 'event'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 在本机日历中更新一个日历
  updateCalendar = item => {
    if (!item.id) {
      return Promise.reject('no id provided')
    }
    return new Promise((resolve, reject) => {
      RNCalendarEvents.saveCalendar({
        id: item.id,
        title: item.name,
        color: item.color,
        entityType: 'event'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // 缓存之前的事件
  @observable
  eventStorage = {}
  @action
  // 获取指定事件范围内的事件
  getWeekEvents = async (start, end) => {
    const monthStart = new Date(start)
    const monthEnd = new Date(end)
    monthStart.setDate(1)
    monthEnd.setMonth(monthEnd.getMonth() + 1)
    monthEnd.setDate(1)
    // 最大搜索范围
    monthStart.setHours(0,0,0,0)
    monthEnd.setHours(23, 59, 59, 999)
    return new Promise((resolve, reject) => {
      if (this.visibleGroupIds.length === 0) {
        // 没有可见分组时，直接不显示所有事件
        this.eventStorage = {}
        resolve([])
      } else {
        RNCalendarEvents.fetchAllEvents(convertDateIOS(new Date(monthStart)), convertDateIOS(new Date(monthEnd)), this.visibleGroupIds)
          .then(res => {
            const tempObj = {}
            res.forEach(item => {
              const key = moment(item.startDate).format('YYYY-MM-DD')
              if (!tempObj[key]) {
                tempObj[key] = {}
              }
              tempObj[key][item.id] = item
            })
            this.eventStorage = Object.assign({}, tempObj)
            // this.eventStorage = Object.assign({}, this.eventStorage, tempObj)
            resolve(res)
          })
          .catch(err => reject(err))
      }

    })
  }
}

const calendar = new NativeCalendar()



export default calendar
