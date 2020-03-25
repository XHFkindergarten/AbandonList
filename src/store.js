import { observable, action, computed } from 'mobx'
import nativeCalendar from 'src/utils/nativeCalendar'
import moment from 'moment'

let timeoutId = ''
class Store {
  // 顶层路由获取
  @observable nav = null
  @action setNav = value => this.nav = value
  // 当前点击的日期
  @observable targetDate = new Date()
  @action updateTargetDate = value => this.targetDate = new Date(value)
  // 当前的路由栈
  @observable bottomNavName = 'Main'
  @action updateBottomNavName = value => this.bottomNavName = value
  @observable navStack = []
  @action storeNavPush = item => {
    this.navStack = this.navStack.concat([ item ])
  }
  @computed get navStackName() {
    if (!this.navStack.length) {
      return ''
    } else {
      return this.navStack[this.navStack.length - 1]
    }
  }
  @action storeNavPop = () => {
    this.navStack = this.navStack.slice(0, this.navStack.length - 1)
  }
  // 当前显示的待办列表数组
  @observable todoList = []
  @observable showTodoList = true
  @action updateTodoListById = (index, id, value) => {
    this.todoList[index][id] = value
  }
  // 初始化待办列表数组
  initialTodoList = () => {
    this.redirectCenterWeek(new Date())
  }
  // 一个缓存变量,存储startDay
  startDay = new Date()
  // 重定向到中心周，更新todoList[有闪动动画]
  @action redirectCenterWeek = async startday => {
    const startDay = new Date(startday)
    this.startDay = new Date(startday)
    const res = []
    // 获取这个日期范围内的事件
    await nativeCalendar.getWeekEvents(startDay, new Date(startDay).setDate(startDay.getDate() + 7))
    for(let i = 0;i < 7;i++) {
      const key = moment(startDay).format('YYYY-MM-DD')
      res.push({
        date: new Date(startDay),
        data: nativeCalendar.eventStorage[key] || {}
      })
      startDay.setDate(startDay.getDate() + 1)
    }
    this.showTodoList = false
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      this.showTodoList = true
    })
    this.todoList = res
  }
  // 更新todoList不出现闪动动画
  @action refreshTodoList = async startday => {
    const startDay = new Date(startday)
    this.startDay = new Date(startday)
    const res = []
    // 获取这个日期范围内的事件
    await nativeCalendar.getWeekEvents(startDay, new Date(startDay).setDate(startDay.getDate() + 7))
    for(let i = 0;i < 7;i++) {
      const key = moment(startDay).format('YYYY-MM-DD')
      res.push({
        date: new Date(startDay),
        data: nativeCalendar.eventStorage[key] || {}
      })
      startDay.setDate(startDay.getDate() + 1)
    }
    this.todoList = res
  }
  // 初始化存储在本地的待办数据
  storageData = {}
  initialStorageData = async () => {
    this.initialTodoList()
  }
  // 监听是否处于add页面
  @observable isAddPage = false
  @action updateIsAddPage = value => this.isAddPage = value
  // 监听add页面中是否弹出了键盘
  @observable keyboardHeight = 0
  @action updateKeyboardHeight = value => this.keyboardHeight = value
  // 监听是否处于addDaily页面
  @observable isAddDaily = false
  @action updateIsAddDaily = value => this.isAddDaily = value

  // 控制add页表单数据
  @observable addFormData = {
    id: '',
    title: '',
    description: '',
    start: null,
    end: null,
    allDay: false,
    RAB: false,
    RAE: false,
    groupId: '',
    repeat: ''
  }
  @action updateAddFormData = value => {
    this.addFormData = value
  }
  @action resetAddFormData = () => {
    this.addFormData = {
      id: '',
      title: '',
      description: '',
      start: null,
      end: null,
      allDay: false,
      RAB: false,
      RAE: false,
      groupId: '',
      repeat: ''
    }
  }

  // 控制addDaily页面表单数据
  @observable dailyFormData = {
    id: '',
    title: '',
    description: ''
  }
  // 更新单项/多项数据
  @action updateDailyFormItem = value => {
    this.dailyFormData = Object.assign(this.dailyFormData, {
      ...value
    })
  }
  // 重置表单
  @action resetDailyFormData = () => {
    this.dailyFormData = {
      id: '',
      title: '',
      description: ''
    }
  }


  // 控制阻止其他操作
  preventOtherHandler = false

  // 当前处于操作状态的卡片id
  @observable focusCardId = ''
  @action updateFocusCardId = value => this.focusCardId = value

  // 发送全局通知的方法
  globalNotify = () => {}

  // 控制底部导航栏显示
  setShowBottom = () => {}
}

const store = new Store()

export default store
