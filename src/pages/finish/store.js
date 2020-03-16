import { observable, action, toJS } from 'mobx';
import RNCalendarEvents from 'react-native-calendar-events'
import nativeCalendar from 'src/utils/nativeCalendar'
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'

const historyKey = '@h1story_list_key'
class Store {
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
  updateHistoryList = value => this.historyList = value
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
  }
  saveHistory = () => {
    console.log('save history', this.historyList)
    AsyncStorage.setItem(historyKey, JSON.stringify(toJS(this.historyList)))
  }
  /**
   * 初始化历史记录列表
   */
  initialHistoryList = async () => {
    const hisStr = await AsyncStorage.getItem(historyKey)
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
      const monthKey = moment(new Date()).format('YYYY-MM')
      this.updateHistoryItem(monthKey, JSItem)
      // 保存到本地存储
      this.saveHistory()
      resolve()
    })
  }

  // 路由navigation
  nav = null
}

export default new Store()