import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login'
import Register from '../views/Register'
import Home from '../views/Home'
import blank from '../views/blank'

import UserCenter from '../views/usercenter/UserCenter'
import UserInfo from '../views/usercenter/UserInfo'
import MyForum from '../views/usercenter/MyForum'

import NewsDetail from '../components/content/news/NewsDetail'
import MessageCenter from '../components/UserChat/index.vue'
import ForumEdit from '../components/ForumEdit/index.vue';

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/blank', component: blank },
    {
      path: '/Login',
      name: '登录',
      component: Login,
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
      ]
    },
    {
      path: '/ForumEdit',
      name: 'ForumEdit',
      component: ForumEdit,
    },
    {
      path: '/UserCenter',
      name: 'UserCenter',
      component: UserCenter,
      children: [
        //个人简介
        {
          path: '/UserInfo',
          name: '个人简介',
          component: UserInfo
        },
        //我的帖子
        {
          path: '/MyForum',
          name: '我的帖子',
          component: MyForum
        },
        {
          path: '/MessageCenter', name: '消息中心', component: MessageCenter,
        }
      ],
      redirect: '/UserInfo'
    },

    //详情页面
    { path: '/ForumDetail', name: '帖子详情', component: NewsDetail },
    //消息中心messageCenter

  ],
  mode: 'hash'
})
