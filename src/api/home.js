import qs from 'qs'

import axios from '@/utils/request'

/**
 * 获取帖子列表
 * @param {*} options 获取帖子列表参数
 */
const getList = (options) => {
  axios.get('/public/list?' + qs.stringify(options))
}

/**
 * 获取本周热议
 * @param {*}
 */
const getTopWeek = () => {
  axios.get('/public//public/topWeek')
}

/**
 * 获取温馨通道
 * @param {*}
 */
const getTips = () => {
  axios.get('/public/tips')
}

/**
 * 获取友情链接
 * @param {*}
 */
const getLinks = () => {
  axios.get('/public/links')
}

export {
  getList,
  getTopWeek,
  getTips,
  getLinks
}