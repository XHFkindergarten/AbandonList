import { observable, action } from 'mobx'

class Store {
  // 是否在滑动卡片
  // @observable
  isScrollCard = false
  // @action
  updateIsScroll = value => {
    // console.warn('before', this.isScrollCard.toString())
    // console.warn('after', value)
    this.isScrollCard = value
  }
}

export default new Store()