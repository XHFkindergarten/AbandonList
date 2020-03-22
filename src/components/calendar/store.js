import { observable, action, computed } from 'mobx'
import srcStore from 'src/store'
import { getMonthDay } from 'src/utils'

// 月份name map
const monthMap = [
  {
    cn: '一月',
    en: 'Jan.'
  },
  {
    cn: '二月',
    en: 'Feb.'
  },
  {
    cn: '三月',
    en: 'Mar.'
  },
  {
    cn: '四月',
    en: 'Apr.'
  },
  {
    cn: '五月',
    en: 'May.'
  },
  {
    cn: '六月',
    en: 'Jun.'
  },
  {
    cn: '七月',
    en: 'Jul.'
  },
  {
    cn: '八月',
    en: 'Aug.'
  },
  {
    cn: '九月',
    en: 'Sep.'
  },
  {
    cn: '十月',
    en: 'Oct.'
  },
  {
    cn: '十一月',
    en: 'Nov.'
  },
  {
    cn: '十二月',
    en: 'Dec.'
  }
]
class Store {
  // 获取本周周日date
  getCurrentSunday = () => {
    const today = new Date()
    // today.setMonth(1)
    // today.setDate(1)
    return this.getSunday(today)
  }
  // 当前选中的月份,用来控制点击第一行和最后一行时的特殊效果
  controlMonth = null
  // 获取指定日期那一周的周日
  getSunday = day => {
    const sunday = new Date(day)
    sunday.setDate(sunday.getDate() - sunday.getDay())
    return sunday
  }
  clearMonthHeader = () => {
    if (this.centerWeekList[6].getDate() < 7) {
      const newCenterSunday = new Date(this.centerWeekList[6])
      newCenterSunday.setDate(newCenterSunday.getDate() + 1)
      this.updateCenterSunday(newCenterSunday)
    }
  }
  // 视图核心日期date
  @observable
  centerSunday = this.getCurrentSunday()
  @action
  updateCenterSunday = value => this.centerSunday = value
  // 日历的展开状态
  @observable isExpanded = false
  @action
  updateIsExpand = value => this.isExpanded = value
  // 输入周日date，生成一周的日期数组
  generateWeekArray = sunday => {
    const res = []
    res.push(new Date(sunday.setDate(sunday.getDate())))
    for(let i = 0;i < 6;i++) {
      res.push(new Date(sunday.setDate(sunday.getDate() + 1)))
    }
    return res
  }
  // 生成不完整的周历[只有当月]
  generateWeekArrayBeta = sunday => {
    if (!this.isExpanded || !this.controlMonth) {
      return this.generateWeekArray(sunday)
    }
    if (this.controlMonth) {
      const res = []
      const tempDate = new Date(sunday)
      for(let i = 0;i < 7;i++) {
        const temp = new Date(tempDate)
        temp.setDate(temp.getDate() + i)
        if (temp.getMonth() === this.controlMonth) {
          res.push(temp)
        } else {
          res.push(null)
        }
      }
      return res
    }
  }
  // 获取当前核心周list [ date * 7 ]
  @computed get centerWeekList() {
    if (!this.centerSunday) return []
    if (this.controlMonth) {
      return this.generateWeekArrayBeta(this.getSunday(this.centerSunday))
    }
    return this.generateWeekArray(this.getSunday(this.centerSunday))
  }
  // 当前所处的月份
  @computed get currentMonth() {
    const centerWeek = this.centerWeekList
    const set = new Set()
    centerWeek.forEach(item => {
      if (item) {
        set.add(item.getMonth())
      }
    })
    const array = Array.from(set)
    return [ monthMap[array[0]], array.length > 1 ? monthMap[array[1]] : null ]
    // const saturday = this.centerWeekList[6]
    // if (saturday.getDate() < 7) {
    //   const month1 = monthMap[this.centerWeekList[0].getMonth()]
    //   const month2 = monthMap[saturday.getMonth()]
    //   return [ month1, month2 ]
    // } else {
    //   const month1 = monthMap[saturday.getMonth()]
    //   return [ month1, null ]
    // }
  }
  // 获取扁平化3周的日历
  @computed get flatWeekList() {
    const centerSunday = new Date(this.centerSunday)
    const prevSunday = new Date(centerSunday)
    const nextSunday = new Date(centerSunday)
    if (this.isExpanded) {
      prevSunday.setDate(7)
      nextSunday.setDate(7)
      if (this.controlMonth) {
        prevSunday.setMonth(this.controlMonth - 1)
        nextSunday.setMonth(this.controlMonth + 1)
      } else {
        prevSunday.setMonth(prevSunday.getMonth() - 1)
        nextSunday.setMonth(nextSunday.getMonth() + 1)
      }
    } else {
      prevSunday.setDate(prevSunday.getDate() - 7)
      nextSunday.setDate(nextSunday.getDate() + 7)
    }
    const res = [
      this.generateWeekArray(this.getSunday(prevSunday)),
      this.generateWeekArrayBeta(this.getSunday(centerSunday)),
      this.generateWeekArray(this.getSunday(nextSunday))
    ]
    return res
  }
  // 周历向前翻页
  scrollBackward = () => {
    let prevCenterDay
    if (this.controlMonth) {
      prevCenterDay = this.centerWeekList[0] || this.centerWeekList[6]
    } else {
      prevCenterDay = new Date(this.centerSunday)
    }
    this.controlMonth = null
    if (this.isExpanded) {
      prevCenterDay.setDate(7)
      prevCenterDay.setMonth(prevCenterDay.getMonth() - 1)
      prevCenterDay.setDate(7 - prevCenterDay.getDay())
    } else {
      prevCenterDay.setDate(prevCenterDay.getDate() - 7)
    }
    srcStore.redirectCenterWeek(prevCenterDay)
    this.updateCenterSunday(prevCenterDay)
  }
  // 周历向后翻页
  scrollForward = () => {
    let nextCenterDay
    if (this.controlMonth) {
      nextCenterDay = this.centerWeekList[0] || this.centerWeekList[6]
    } else {
      nextCenterDay = new Date(this.centerSunday)
    }
    this.controlMonth = null
    if (this.isExpanded) {
      nextCenterDay.setDate(7)
      nextCenterDay.setMonth(nextCenterDay.getMonth() + 1)
      nextCenterDay.setDate(7 - nextCenterDay.getDay())
    } else {
      nextCenterDay.setDate(nextCenterDay.getDate() + 7)
    }
    srcStore.redirectCenterWeek(nextCenterDay)
    this.updateCenterSunday(nextCenterDay)
  }
  // 生成上旬月历
  @computed get beginMonthListData() {
    return this.flatWeekList.map(item => {
      return this.generatePrevMonthData(item[0])
    })
  }
  // 生成下旬月历
  @computed get endMonthListData() {
    return this.flatWeekList.map(item => {
      return this.generateNextMonthData(item[6])
    })
  }
  // 生成上旬月历工厂函数
  generatePrevMonthData = flagSunday => {
    const res = []
    if (!flagSunday) {
      return res
    }
    const currentSundayDate = flagSunday.getDate()
    // 判断是否上旬已经没有数据了
    // 即当前center周就是第一周
    const Saturday = new Date(flagSunday)
    Saturday.setDate(Saturday.getDate() + 6)
    if (Saturday.getDate() <= 7 && Saturday.getMonth() === flagSunday.getMonth()) {
      return res
    }
    // 计算向上还有几周
    const prevWeekNum = Math.ceil((currentSundayDate - 1) / 7)
    // 计算顶部需要几个占位符
    const prevEmptyNum = (7 - (currentSundayDate - 1) % 7) % 7
    // 生成月份第一周数据
    const firstWeek = new Array(7).fill(null)
    let index = 1
    for(let i = prevEmptyNum;i < 7;i++) {
      const tempDate = new Date(flagSunday)
      tempDate.setDate(index++)
      firstWeek[i] = tempDate
    }
    res.push(firstWeek)
    // 生成剩余上旬数据
    for(let i = 0;i < prevWeekNum - 1;i++) {
      const tempSunday = new Date(this.centerWeekList[0])
      tempSunday.setDate(index)
      res.push(this.generateWeekArray(tempSunday))
      index += 7
    }
    return res
  }
  // 生成下旬月历工厂函数
  generateNextMonthData = centerSunday => {
    // 如果已经是月底，返回空数组
    // const tempDate = new Date(centerSunday)
    // tempDate.setDate(centerSunday.getDate() + 6)
    // if (tempDate.getMonth() !== centerSunday.getMonth()) {
    //   return []
    // }
    if (!centerSunday) {
      return []
    }
    // 输出结果
    const res = []
    const startSaturday = new Date(centerSunday)
    // startSaturday.setDate(startSaturday.getDate() + 6)
    // 获取本月有多少天
    const monthDay = getMonthDay(startSaturday)
    // 下旬开始日期
    let startDate = startSaturday.getDate() + 1
    // 设定接下来还有几周
    while(startDate <= monthDay) {
      const tempArr = new Array(7).fill(null)
      for(let i = 0;i < 7;i++) {
        const tempDate = new Date(startSaturday)
        tempDate.setDate(startDate++)
        tempArr[i] = tempDate
        if (startDate > monthDay) break
      }
      res.push(tempArr)
    }
    return res
  }

  // 是否正在执行展开/收回动画
  shift = false
  // 是展开还是关闭状态
  isExpanded = false
}
export default new Store()