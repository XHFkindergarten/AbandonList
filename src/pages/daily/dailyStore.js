import { observable, action, toJS, computed } from 'mobx'
import { getStorage, setStorage, generateRandomId } from 'src/utils'
import moment from 'moment'
import { flatColorList } from 'src/common'
import Notification from 'src/utils/Notification'


const dailyListKey = '@daily_item_list'
const dailyLogKey = '@daily_log'




class DailyStore {
  // 控制日常页面是否处于编辑状态
  @observable
  isSet = false
  @action
  toggleIsSet = () => this.isSet = !this.isSet
  @action
  setIsSet = value => {
    this.isSet = value
  }

  // 每日待办列表Array
  @observable
  dailyList = {}
  @action
  updateDailyList = value => {
    this.dailyList = value
    // 同步storage数据
    this.saveDailyListStorage()
  }

  // 添加每日任务的表单数据
  addDailyForm = {}
  // 重置表单
  resetDailyForm = () => {
    const randomIndex = Math.floor(Math.random() * 16)
    this.addDailyForm = {
      name: `待办事项[${Object.keys(toJS(this.dailyList)).length + 1}]`,
      des: '',
      color: flatColorList[randomIndex],
      noti: false,
      notiTime: new Date(),
      notiDay: new Set(),
      // 当天是否完成的状态
      finish: false,
      // 总完成次数的记录
      finishTimes: 0,
      // 每月完成次数的记录
      finishLog: {},
      maxContinueTimes: 0,
      // 每天完成的次数(用来统计连续完成次数)
      continueTimesStack: [],
      // 每天完成的记录
      lastFinishStack: []
    }
  }
  // 更新单条数据
  addDailyFormItem = item => {
    this.addDailyForm = {
      ...this.addDailyForm,
      ...item
    }
  }
  // 提交每日任务表单
  submitDailyForm = () => new Promise(async (resolve) => {
    if (!this.addDailyForm.name) {
      resolve()
      return
    }
    await this.updateDailyListItem(this.addDailyForm)
    this.resetDailyForm()
    resolve()
  })

  @action
  updateDailyListItem = item => {
    return new Promise((resolve) => {
      // 不存在的item则执行add操作
      if (!item.id) {
      // 生成一个随机的id
        const newid = generateRandomId()
        const randomIndex = Math.floor(Math.random() * 16)
        this.dailyList[newid] = {
          ...item,
          id: newid,
          des: item.des || '',
          color: item.color || flatColorList[randomIndex],
          noti: !!item.noti,
          notiTime: new Date(item.notiTime),
          notiDay: item.notiDay || new Set(),
          name: item.name ? item.name : `待办事项[${Object.keys(toJS(this.dailyList)).length + 1}]`,
          // 当天是否完成的状态
          finish: false,
          // 总完成次数的记录
          finishTimes: 0,
          // 每月完成次数的记录
          finishLog: {},
          maxContinueTimes: 0,
          // 每天完成的次数(用来统计连续完成次数)
          continueTimesStack: [],
          // 每天完成的记录
          lastFinishStack: []
        }
        // 如果设置了通知时间,以及选择了通知的日期
        if (item.noti && item.notiDay.size) {
          const tempDate = new Date(item.notiTime)
          tempDate.setDate(tempDate.getDate() - 1)
          for(let i = 0;i < 7;i++) {
            tempDate.setDate(tempDate.getDate() + 1)
            const day = tempDate.getDay()
            if (item.notiDay.has(day)) {
              // 依次设置通知
              Notification.setScheduleNotification({
                fireDate: new Date(tempDate),
                alertTitle: '每日任务',
                alertBody: item.name,
                id: newid,
                repeatInterval: 'week'
              })
            }
          }
        }
        // 同步storage数据
        this.saveDailyListStorage()
        resolve()
      } else {
      // 存在的item执行update操作
        this.dailyList[item.id] = item
        // 同步storage数据
        this.saveDailyListStorage()
        resolve()
        // TODO 删除之前的通知事件，重新设置通知
        Notification.removeTarget(item.id)
        if (item.noti && item.notiDay.size) {
          const tempDate = new Date(item.notiTime)
          tempDate.setDate(tempDate.getDate() - 1)
          for(let i = 0;i < 7;i++) {
            tempDate.setDate(tempDate.getDate() + 1)
            const day = tempDate.getDay()
            if (item.notiDay.has(day)) {
              // 依次设置通知
              Notification.setScheduleNotification({
                fireDate: new Date(tempDate),
                alertTitle: '每日任务',
                alertBody: item.name,
                id: item.id,
                repeatInterval: 'week'
              })
            }
          }
        }
      }
    })
  }

  /**
   * 检查昨天是否完成了这项任务
   */
  checkYesterday = info => {
    const keysLen = Object.keys(info.finishLog).length
    if ( keysLen === 0 || keysLen === 1) {
      return true // 第一次完成任务也算作之前完成
    }
    const today = new Date()
    const date = today.getDate()
    today.setDate(date - 1)
    const yesterdayKey = moment(today).format('YYYY-MM-DD')
    return !!info.finishLog[yesterdayKey]
  }

  // 标记完成次数+1
  // daykey, 完成日的key
  handleFinish = (info, daykey) => {
    const todayKey = moment(new Date()).format('YYYY-MM-DD')
    const target = {
      ...info,
      finish: todayKey === daykey ? true : false,
      finishTimes: info.finishTimes + 1,
      finishLog: Object.assign(info.finishLog, {
        [daykey]: info.finishLog[daykey] ? info.finishLog[daykey] + 1 : 1
      })
    }
    // 完成栈中没有记录
    if (!info.continueTimesStack.length || !info.lastFinishStack.length) {
      target.continueTimesStack = [ 1 ]
      target.lastFinishStack = [ new Date(daykey) ]
      target.maxContinueTimes = 1
    } else {
      // 防止两个栈长度不一致
      const sameLength = Math.max(info.continueTimesStack.length, info.lastFinishStack.length)
      const continueTimesStack = info.continueTimesStack.slice(0, sameLength)
      const lastFinishStack = info.lastFinishStack.slice(0, sameLength)
      const lastDay = new Date(daykey)
      lastDay.setDate(lastDay.getDate() - 1)
      const lastLog = lastFinishStack[lastFinishStack.length - 1]
      // 如果昨天也完成了该任务
      if (lastDay.setHours(0,0,0,0) === new Date(lastLog).setHours(0,0,0,0)) {
        lastFinishStack.push(new Date(daykey))
        continueTimesStack.push(continueTimesStack[continueTimesStack.length - 1] + 1)
      } else {
        lastFinishStack.push(new Date(daykey))
        continueTimesStack.push(1)
      }
      target.continueTimesStack = continueTimesStack
      target.lastFinishStack = lastFinishStack
      target.maxContinueTimes = continueTimesStack.reduce((prev, item) => {
        return item > prev ? item : prev
      }, 0)
    }
    this.updateDailyListItem(target)
  }
  // 取消完成
  handleCancel = info => {
    const dayKey = moment(new Date()).format('YYYY-MM-DD')
    const target = {
      ...info,
      finish: false,
      finishTimes: info.finishTimes - 1,
      finishLog: Object.assign({}, info.finishLog, {
        [dayKey]: info.finishLog[dayKey] ? info.finishLog[dayKey] - 1 : 0
      })
    }
    if (info.continueTimesStack.length && info.lastFinishStack.length) {
      // 防止两个栈长度不一致
      const sameLength = Math.max(info.continueTimesStack.length, info.lastFinishStack.length)
      const continueTimesStack = info.continueTimesStack.slice(0, sameLength)
      const lastFinishStack = info.lastFinishStack.slice(0, sameLength)
      continueTimesStack.pop()
      lastFinishStack.pop()
      target.continueTimesStack = continueTimesStack
      target.lastFinishStack = lastFinishStack
      target.maxContinueTimes = continueTimesStack.reduce((prev, item) => {
        return item > prev ? item : prev
      }, 0)
    }
    this.updateDailyListItem(target)
  }

  // 标记日历中的事件完成时，对次数进行统计
  handleCalendarItemFinish = () => {
    const date = new Date()
    const todayKey = moment(date).format('YYYY-MM-DD')
    this.updateDailyLogItem({
      date,
      finishItems: this.dailyLog[todayKey].finishItems + 1
    })
  }

  // 每次取消完成一个事项，对连续完成栈进行管理
  @action
  handleCancelFinishStack = item => {
    const continueTimesStack = [ ...item.continueTimesStack ]
    const lastFinishStack = [ ...item.lastFinishStack ]
    if (!continueTimesStack.length || !lastFinishStack.length) {
      return
    }
    const today = new Date()
    const lastLog = lastFinishStack[lastFinishStack.length - 1]
    // 如果最后一次完成记录是在今天
    if (today.setHours(0,0,0,0) === lastLog.setHours(0,0,0,0)) {
      lastFinishStack.pop()
      continueTimesStack.pop()
    } else {
      return
    }
    const maxContinueTimes = continueTimesStack.reduce((prev, item) => {
      return item > prev ? item : prev
    }, 0)
    this.dailyList[item.id] = Object.assign({}, item, {
      continueTimesStack,
      lastFinishStack,
      maxContinueTimes
    })
  }
  // 删除待办事项
  @action
  deleteDailyListItem = itemId => {
    if (itemId) {
      const newList = Object.assign({}, this.dailyList)
      delete newList[itemId]
      this.dailyList = newList
      // 同步storage数据
      this.saveDailyListStorage()
      // 删除相应的通知
      Notification.removeTarget(itemId)
    } else {
      throw new Error('delete daily item requires id')
    }
  }

  // 批量删除Item
  deleteDailyListItems = itemArray => {
    for(let i = 0;i < itemArray.length;i++) {
      this.deleteDailyListItem(itemArray[i])
    }
  }

  saveDailyListStorage = () => {
    setStorage(dailyListKey, JSON.stringify(toJS(this.dailyList)))
  }
  saveDailyLogStorage = () => {
    setStorage(dailyLogKey, JSON.stringify(toJS(this.dailyLog)))
  }
  /**
   * 每天的日志
   */
  @observable dailyLog = {}
  @action updateDailyLog = value => {
    this.dailyLog = value
    this.saveDailyLogStorage()
  }
  @action updateDailyLogItem = item => {
    if (!item || !item.date) {
      throw new TypeError('updateDailyLogItem 参数格式不合法')
    }
    const key = moment(item.date).format('YYYY-MM-DD')
    this.dailyLog[key] = item
    this.saveDailyLogStorage()
  }
  // 初始化日志
  initialDailyLog = async () => {
    // 从AsyncStorage中获取日志
    const logStr = await getStorage(dailyLogKey) || '{}'
    const logData = JSON.parse(logStr)
    const todayKey = moment(new Date()).format('YYYY-MM-DD')
    if (!(todayKey in logData)) {
      logData[todayKey] = {
        date: new Date(),
        finishItems: 0
      }
    }
    this.updateDailyLog(logData)
  }
  // 计算数据总览所需要的数据[各个月份完成次数][总完成次数]
  @computed get dataOverView() {
    const log = this.dailyLog
    const res = {
      allFinishTimes: 0,
      // maxContinueTimes: 0,
      monthList: {}
    }
    for(let i of Object.keys(log)) {
      const item = log[i]
      // 累加总完成天数
      res.allFinishTimes += item.finishItems
      const tempArr = i.split('-')
      const monthKey = `${tempArr[0]}-${tempArr[1]}`
      if (!res.monthList[monthKey]) {
        res.monthList[monthKey] = {
          finishItems: item.finishItems,
          finishDays: item.finishItems ? 1 : 0
        }
      } else {
        res.monthList[monthKey] = {
          finishItems: res.monthList[monthKey].finishItems + item.finishItems,
          finishDays: res.monthList[monthKey].finishDays + (item.finishItems ? 1 : 0)
        }
      }
    }
    console.log('overview', res)
    return res
  }


  // 初始化待办列表
  initialDailyList = async () => {
    // 从AsyncStorage中获取待办数据
    const listStr = await getStorage(dailyListKey)
    const listData = JSON.parse(listStr) || {}
    const todayKey = moment(new Date()).format('YYYY-MM-DD')
    const monthKey = moment(new Date()).format('YYYY-MM')
    const isNewDay = (todayKey in this.dailyLog) && (this.dailyLog[todayKey].finishItems === 0)
    // 洗数据
    for(let i of Object.keys(listData)) {
      if (isNewDay) {
        listData[i].finish = false
      }
      if (!listData[i].finishLog[monthKey]) {
        listData[i].finishLog[monthKey] = 0
      }
    }
    this.updateDailyList(listData)
  }
  initialDailyStore = async () => {
    await this.initialDailyLog()
    this.initialDailyList()
  }



}

export default new DailyStore()