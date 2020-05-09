import { observable, action, toJS } from 'mobx';
import RNCalendarEvents from 'react-native-calendar-events'
import nativeCalendar from 'src/utils/nativeCalendar'
import moment from 'moment'
import { getStorage, setStorage } from 'src/utils'
import Notification from 'src/utils/Notification'
import { Alert } from 'react-native';

const historyKey = '@h1story_list_key'
const reviewKey = '@review_time_key'

// IOS下的日期格式处理
const convertDateIOS = target => {
  return moment.utc(target).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}

const wallpaperKey = '@wall_paper_k1y'

class Store {

  constructor() {
    this.initialWallPaper()
  }

  // 设置弹框是否活跃
  @observable
  isSet = false
  @action
  toggleSet = (flag) => {
    this.isSet = typeof flag === 'boolean' ? flag : !this.isSet
  }

  // 是否正在添加日历
  @observable
  isAddCalendar = false
  @action
  toggleIsAddCalendar = flag => {
    this.isAddCalendar = typeof flag === 'boolean' ? flag : !this.isAddCalendar
  }

  // 是否正在编辑回顾时间
  @observable
  isEditReview = false
  @action
  toggleIsEditReview = flag => {
    this.isEditReview = typeof flag === 'boolean' ? flag : !this.isEditReview
  }

  /* =================== 日历表单 =================== */
  @observable
  addCalendarForm = {
    name: '',
    color: ''
  }
  // 更新表单
  @action
  updateAddCalendarForm = value => {
    this.addCalendarForm = Object.assign(
      {},
      this.addCalendarForm,
      value
    )
  }
  // 重置表单
  @action
  resetAddCalendarForm = () => {
    this.addCalendarForm = {
      name: '',
      color: ''
    }
  }

  /* =================== 日历所有分组[observable版本] =================== */

  @observable
  groupStorage = []
  @action
  updateGroupStorage = value => this.groupStorage = value
  // 刷新本机所有日历分组
  refreshGroupStorage = () => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.findCalendars().then(res => {
        this.updateGroupStorage([ ...res.filter(item => item.allowsModifications) ])
        // 在原生模块也做一个同步
        nativeCalendar.groupStorage = [ ...this.groupStorage ]
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

  /* =================== 日历可见分组[observable版本] =================== */
  @observable
  visibleGroupIds = []
  @action
  updateVisibleGroupIds = value => this.visibleGroupIds = value

  /**
   * 删除某个日历
   */
  deleteCalendar = id => {
    return new Promise((resolve, reject) => {
      RNCalendarEvents.removeCalendar(id).then(res => {
        resolve(res)
      }).catch(err => {
        // TODO: 提示这是无法删除的日历
        reject(err)
      })
    })
  }

  /* 历史已完成(删除)数据 */
  @observable
  historyList = {}
  @action
  updateHistoryList = value => {
    this.historyList = value
    this.saveHistory()
  }
  @action
  updateHistoryItem = (monthKey, info) => {
    // 同一个月同一个事件只允许完成一次
    if (this.historyList[monthKey] && !this.historyList[monthKey][info.id]) {
      this.historyList = {
        ...this.historyList,
        [monthKey]: {
          ...this.historyList[monthKey],
          [info.id]: info
        }
      }
    }
    this.saveHistory()
  }
  /**
   * 保存到本机存储
   */
  saveHistory = () => {
    setStorage(historyKey, JSON.stringify(toJS(this.historyList)))
  }
  /**
   * 删除一条历史记录
   */
  removeHisItem = (monthKey, info) => {
    const hisData = {
      ...this.historyList
    }
    if (hisData[monthKey] && hisData[monthKey][info.id]) {
      delete hisData[monthKey][info.id]
    }
    this.updateHistoryList(hisData)
  }
  /**
   * 初始化历史记录列表
   */
  initialHistoryList = async () => {
    const hisStr = await getStorage(historyKey)
    const hisData = JSON.parse(hisStr) || {}
    const monthKey = moment(new Date()).format('YYYY-MM')
    if (!(monthKey in hisData)) {
      hisData[monthKey] = {}
    }
    this.updateHistoryList(hisData)
  }
  // 将完成/删除事件添加到数据中
  addHistoryItem = (item, isDelete) => {
    return new Promise((resolve) => {
      // JS化数据
      const JSItem = toJS(item)
      JSItem.isDelete = isDelete
      JSItem.finishDate = convertDateIOS(new Date())
      const monthKey = moment(new Date()).format('YYYY-MM')
      this.updateHistoryItem(monthKey, JSItem)
      resolve()
    })
  }

  // 路由navigation
  nav = null


  // 每天回顾的时间
  @observable reviewTime = ''
  @action updateReviewTime = value => {
    if (value) {
      const dateStr = convertDateIOS(value)
      if (dateStr && dateStr !== 'Invalid date') {
        this.reviewTime = dateStr
        // 清空所有的每日通知
        Notification.removeTarget(reviewKey)
        // 重新添加每日通知
        Notification.setScheduleNotification({
          fireDate: convertDateIOS(value),
          alertTitle: 'AbandonList',
          alertBody: '回顾一下今天的日程吧',
          id: reviewKey,
          repeatInterval: 'day'
        })
      } else {
        // 数据不正确
        this.reviewTime = ''
        // 清空所有的每日通知
        Notification.removeTarget(reviewKey)
        Alert.alert('回顾处理失败，已重置数据，请重新设置')
      }
    } else {
      this.reviewTime = ''
      // 清空所有的每日通知
      Notification.removeTarget(reviewKey)
    }
    // Notification
    this.saveReviewTime()
  }
  // 保存到本地
  saveReviewTime = () => {
    setStorage(reviewKey, this.reviewTime)
  }
  // 初始化
  @action
  initialReviewTime = async () => {
    const str = await getStorage(reviewKey)
    if (str && str.length > 10) {
      const dateStr = convertDateIOS(str)
      if (dateStr && dateStr !== 'Invalid date') {
        this.reviewTime = dateStr
      }
    }
  }

  @observable
  wallpaperIndex = 0
  @action updateWallPaper = value => {
    if (value < 1 || value > 3) {
      return
    }
    this.wallpaperIndex = value
  }

  // 更改壁纸
  changeWallPaper = index => {
    this.updateWallPaper(index)
    setStorage(wallpaperKey, index + '')
  }

  initialWallPaper = () => {
    return new Promise(async (resolve) => {
      const index = await getStorage(wallpaperKey)
      if (index) {
        this.updateWallPaper(index)
      } else {
        this.updateWallPaper(1) // 默认1
      }
      resolve()
    })
  }
}

export default new Store()