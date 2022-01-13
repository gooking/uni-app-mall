const WXAPI = require('apifm-uniapp')
import store from '@/store'

// 显示购物车tabBar的Badge
async function showTabBarBadge(noTabBarPage){
  const token = store.state.token
  if (!token) {
    return 0
  }
  let number = 0
  // 自营商品
  let res = await WXAPI.shippingCarInfo(token)
  if (res.code == 0) {
    number += res.data.number
  }
  // vop 购物车
  // res = await WXAPI.jdvopCartInfo(token)
  // if (res.code == 0) {
  //   number += res.data.number
  // }
  if (!noTabBarPage) {
    if (number == 0) {
      // 删除红点点
      uni.removeTabBarBadge({
        index: 3
      })
    } else {
      // 显示红点点
      uni.setTabBarBadge({
        index: 3,
        text: number + ''
      })
    }
  }
  store.commit('$uStore', {
  	name: 'cartNumber',
	value: number
  })
  return number
}

module.exports = {
  showTabBarBadge: showTabBarBadge
}