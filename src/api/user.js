import qs from 'qs'

import axios from '@/utils/request'

/**
 * 用户签到
 * @param {*}
 */
const sign = async () => {
  return axios.get('/user/sign')
}

/**
 * 获取用户基本信息
 * @param {*}
 */
const getInfo = async () => axios.get('/user/info')

/**
 * 修改用户基本信息
 * @param {*}
 */
const updateInfo = async (options) => {
  return axios.post('/user/basic', options)
}

/**
 * 修改用户邮件账户
 * @param {*}
 */
const updateEmail = async (options) => {
  return axios.get('/public/resetEmail?' + qs.stringify(options))
}

/**
 * 获取用户消息
 * @param {*}
 */
const getUserMessages = async (options) => {
  return axios.get('/user/messages?' + qs.stringify(options))
}

export {
  sign,
  updateInfo,
  updateEmail,
  getInfo,
  getUserMessages
}
