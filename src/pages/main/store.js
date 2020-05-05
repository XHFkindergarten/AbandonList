import { observable, action } from 'mobx'

class Store {
  // 是否正在处理卡片状态
  isHandlingCard = false
}

export default new Store()