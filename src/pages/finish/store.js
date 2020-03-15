import { observable, action } from 'mobx';
import RNCalendarEvents from 'react-native-calendar-events'
import nativeCalendar from 'src/utils/nativeCalendar'
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

  // 路由navigation
  nav = null
}

export default new Store()