import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store( {
	state:{
		userInfo:{},
		openTab:[],//所有打开的路由
    	activeIndex:'/HomePage' //激活状态
	},
	mutations:{
		//获取登录用户信息
		setUserInfo(state, data){
			state.userInfo = data;
		},
		// 添加tabs
		add_tabs (state, data) {
			this.state.openTab.push(data);
		},
		// 删除tabs
		delete_tabs (state, route) {
			let index = 0;
			for (let option of state.openTab) {
			if (option.route === route) {
				break;
			}
			index++;
			}
			this.state.openTab.splice(index, 1);
		  },
		  // 设置当前激活的tab
		  set_active_index (state, index) {
			this.state.activeIndex = index;
		  },
	},
	actions:{
	}
})