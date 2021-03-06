import Vue from 'vue'
import VueRouter from 'vue-router'
import jwt from 'jsonwebtoken'
import moment from 'moment'

import Home from '@/views/Home'
import store from '../store'
import { getInfo } from '@/api/user'

Vue.use(VueRouter)

const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue')
const Reg = () => import(/* webpackChunkName: 'reg' */ '../views/Reg.vue')
const Forget = () => import(/* webpackChunkName: 'forget' */ '../views/Forget.vue')
const Index = () => import(/* webpackChunkName: 'index' */ '../views/channels/Index.vue')
const Page1 = () => import(/* webpackChunkName: 'page1' */ '../views/channels/Page1.vue')
const Center = () => import(/* webpackChunkName: 'center' */ '../views//Center.vue')
const UserCenter = () => import(/* webpackChunkName: 'userCenter' */ '../components/user/Center.vue')
const UserMessage = () => import(/* webpackChunkName: 'userMessage' */ '../components/user/Message.vue')
const UserOther = () => import(/* webpackChunkName: 'UuserOther' */ '../components/user/Other.vue')
const UserPosts = () => import(/* webpackChunkName: 'userPosts' */ '../components/user/Posts.vue')
const UserSetting = () => import(/* webpackChunkName: 'userSetting' */ '../components/user/Setting.vue')
const User = () => import(/* webpackChunkName: 'user' */ '../views/User.vue')
const MyInfo = () => import(/* webpackChunkName: 'myInfo' */ '../components/user/common/MyInfo.vue')
const Accounts = () => import(/* webpackChunkName: 'accounts' */ '../components/user/common/Accounts.vue')
const ModifyPassword = () => import(/* webpackChunkName: 'modifyPassword' */ '../components/user/common/ModifyPassword.vue')
const PicUpload = () => import(/* webpackChunkName: 'picUpload' */ '../components/user/common/PicUpload.vue')
const MyPost = () => import(/* webpackChunkName: 'myPost' */ '../components/user/common/MyPost.vue')
const MyCollection = () => import(/* webpackChunkName: 'myCollection' */ '../components/user/common/MyCollection.vue')
const NoFount = () => import(/* webpackChunkName: 'noFount' */ '../views/NoFount.vue')
const Confirm = () => import(/* webpackChunkName: 'confirm' */ '../views/Confirm.vue')
const Reset = () => import(/* webpackChunkName: 'reset' */ '../views/Reset.vue')
const Add = () => import(/* webpackChunkName: 'add' */ '../components/contents/Add.vue')
const Edit = () => import(/* webpackChunkName: 'edit' */ '../components/contents/Edit.vue')
const Detail = () => import(/* webpackChunkName: 'detail' */ '../components/contents/Detail.vue')
const Result = () => import(/* webpackChunkName: 'result' */ '../components/contents/Result.vue')

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'index',
        component: Index,
        meta: {
          title: '1024技术论坛'
        }
      },
      {
        path: '/index/:catalog',
        name: 'catalog',
        component: Page1
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg,
    beforeEnter: (to, from, next) => {
      if (from.name === 'login') {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: Confirm
  },
  {
    path: '/reset',
    name: 'reset',
    component: Reset
  },
  {
    path: '/forget',
    name: 'forget',
    component: Forget,
    beforeEnter: (to, from, next) => {
      if (from.name === 'login') {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/add',
    name: 'add',
    component: Add,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:tid',
    name: 'edit',
    component: Edit,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/detail/:tid',
    name: 'detail',
    component: Detail,
    props: true
  },
  {
    path: '/result/:keyword',
    name: 'result',
    component: Result
  },
  {
    path: '/center',
    component: Center,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'center',
        component: UserCenter
      },
      {
        path: 'message',
        name: 'message',
        component: UserMessage
      },
      {
        path: 'other',
        name: 'other',
        component: UserOther
      },
      {
        path: 'posts',
        component: UserPosts,
        children: [
          {
            path: '',
            name: 'posts',
            component: MyPost
          },
          {
            path: 'collection',
            name: 'collection',
            component: MyCollection
          }
        ]
      },
      {
        path: 'setting',
        component: UserSetting,
        children: [
          {
            path: '',
            name: 'setting',
            component: MyInfo
          },
          {
            path: 'accounts',
            name: 'accounts',
            component: Accounts
          },
          {
            path: 'password',
            name: 'password',
            component: ModifyPassword
          },
          {
            path: 'picupload',
            name: 'picupload',
            component: PicUpload
          }
        ]
      }
    ]
  },
  {
    path: '/user:uid',
    name: 'user',
    component: User,
    props: true
  },
  {
    path: '/404',
    component: NoFount
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'layui-this',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!store.state.userInfo && !store.state.token) {
    const userInfo = localStorage.getItem('userInfo')
    const token = localStorage.getItem('token')
    if (userInfo && token) {
      const payload = jwt.decode(token)
      if (moment().isBefore(moment(payload.exp * 1000))) {
        store.commit('setUserToken', token)
        store.commit('setLoginStatus', true)
        store.commit('setUserInfo', JSON.parse(userInfo))
        store.commit('initWebSocket', {})
        getInfo().then(res => {
          if (res.code === 10000) {
            store.commit('setUserInfo', res.data)
          }
        })
      }
    }
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.isLogin) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
