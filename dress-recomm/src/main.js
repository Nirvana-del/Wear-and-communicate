import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$axios = axios
Vue.config.productionTip = false


if(process.env.NODE_ENV === 'production') {
	axios.defaults.baseURL = '/'
} else {
	axios.defaults.baseURL = '/api/'
}

router.beforeEach(function(to, from, next) {
  if (to.meta.needLogin) {
    //页面是否登录
    if (window.sessionStorage.getItem("token")) {
      //本地存储中是否有token(uid)数据
      next(); //表示已经登录
    } else {
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      next({
        name: "Login"
      });
    }
  } else {
    //表示不需要登录
    next(); //继续往后走
  }
});

Vue.use(ElementUI)

//引入api接口文件内全部函数
import * as API from './api/api';
new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    Vue.prototype.$API = API;
  },
}).$mount('#app')


