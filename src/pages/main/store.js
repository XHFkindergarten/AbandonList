import { observable, action } from 'mobx'

class Store {
  // 是否在滑动卡片
  // @observable
  isScrollCard = false
  // @action
  updateIsScroll = value => {
    this.isScrollCard = value
  }

}

export default new Store()