<template>
  <div>
    <nav-bar class="news-nav-bar">
      <div slot="left" style="cursor: pointer;" @click="gotoHome">穿搭交流与推荐平台</div>
      <div slot="leftCenter">
        <NavBarItem v-on="$listeners" />
      </div>
      <!-- <div slot="rightCenter">
        <div class="search-wrapper">
          <input v-model="input" type="text" aria-label="搜索" />
          <button type="button" aria-label="搜索" @click="searchNews">
            <svg t="1679897449632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5833" width="16" height="16">
              <path
                d="M0 425.621165C0 660.359055 190.980031 851.129449 425.516346 851.129449c108.052157 0 206.896378-40.629417 282.067654-107.221669l271.182614 271.182614a25.511307 25.511307 0 0 0 18.222362 7.538897c6.692283 0 13.191055-2.507591 18.222363-7.538897a25.527433 25.527433 0 0 0 0-36.227024L743.811024 707.688819c66.600315-75.171276 107.221669-173.805858 107.221669-282.067654 0-234.745953-190.980031-425.516346-425.516347-425.516346S0 190.875213 0 425.621165z m799.727874 0c0 206.267465-167.952126 374.203465-374.211528 374.203465-206.267465 0-374.211528-167.936-374.211527-374.203465 0-206.267465 167.944063-374.211528 374.203464-374.211527 206.275528 0 374.219591 167.734425 374.219591 374.203464z"
                fill="#409EFF" p-id="5834"></path>
            </svg>
            <span>搜索</span></button>
        </div>
      </div> -->
      <div slot="right">
        <el-link v-show="!isWhich" :underline="false" type="info" style="float:right" @click="goLogin"><i
            class="el-icon-user" style="margin-right:5px;color: #3f3f3f"></i>登录</el-link>
        <el-dropdown trigger="hover" style="float:right;margin-right:20px" @command="handleCommand">
          <el-link v-show="isWhich" :underline="false" type="info" style="float:right" @click="toUserCenter">
            <el-avatar shape="circle" fit="fill" :src="this.userInfo.avatar" style="margin-right:7px;"></el-avatar>
          </el-link>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" command="0">
              个人主页
            </el-dropdown-item>
            <el-dropdown-item class="clearfix" command="1">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="hover" style="float:right;margin-right:20px">
          <el-link :underline="false" type="info" @click="goMessageCenter"><i class="el-icon-chat-dot-round"
              style="margin-right:5px;color: #3f3f3f"></i>
            消息
          </el-link>
          <el-dropdown-menu></el-dropdown-menu>
          <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              通知
              <el-badge class="mark" :value="reportNum" />
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              回复
              <el-badge class="mark" :value="replyNum" />
            </el-dropdown-item>
          </el-dropdown-menu> -->
        </el-dropdown>
      </div>

    </nav-bar>
    <el-dialog title="登录解锁完整功能" :visible.sync="loginPromptVisible" width="25%">
      <div class="tips">
        <div class="loginPrompt">登录后查看更多</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginPromptVisible = false">取 消</el-button>
        <el-button type="danger" @click="goLogin(), loginPromptVisible = false">前往登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from "./NavBar";
import NavBarItem from "./NavBarItem";
export default {
  data() {
    return {
      loginPromptVisible: false,
      userInfo: {},
      messageList: JSON.parse(window.sessionStorage.getItem('allMsg')),
      reportNum: window.sessionStorage.getItem('reportNum'),
      replyNum: window.sessionStorage.getItem('replyNum'),
      isWhich: false,
      input: '',
      pageNum: 1,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value: '',
    }
  },
  components: {
    NavBar,
    NavBarItem
  },
  created() {
    this.initData()
  },
  methods: {
    gotoHome(){
      this.$router.push('/')
    },
    initData() {
      this.$API.getSelfInfo().then(res => {
        console.log(res);
        if (res.code === '20000') {
          this.isWhich = true
          this.userInfo = res.data
          window.sessionStorage.setItem("userId", res.data.userId);
          window.sessionStorage.setItem("nickname", res.data.nickname);
        } else {
          this.isWhich = false
        }
      })
    },
    searchNews() {
      this.$router.push('/NewsSearchPage?keyword=' + this.input);
    },
    handleCommand(command) {
      if (command == "0") {
        if (window.sessionStorage.getItem('token') == null) {
          this.loginPromptVisible = true
        } else {
          this.$router.push('/UserInfo');
        }
      } else {
        window.sessionStorage.clear();
        this.isWhich = false
        this.$router.push('/Login')

        // this.initData()
      }
    },
    goMessageCenter() {
      if (window.sessionStorage.getItem('token') == null) {
        this.loginPromptVisible = true
      } else {
        this.$router.push('/MessageCenter');
      }
    },
    goLogin() {
      this.$router.push('/Login')
    },
    toUserCenter: function () {
      this.$router.push('/UserInfo')
    },
  }
}
</script>
<style  scoped>
.item {
  margin-top: 5px;
}

.news-nav-bar {
  line-height: 50px;
  height: 50px;
  padding-top: 5px;
}

.el-input {
  width: 150px;
}

.search-wrapper {
  display: flex;
  position: relative;
  height: 45px;
  line-height: 45px;
  margin-top: 3px;
  border: 1px solid #e8e8e8;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.search-wrapper input {
  width: 70%;
  padding: 0 5px;
  border: 0;
  outline: none;
  background: #f5f5f5;
  font-size: 16px;
}

.search-wrapper button {
  border-style: none;
}

/* .search-wrapper button i{
  width: 30px;
  height: 28px;
  line-height: 28px;
  margin:0;
  display: block;
  float: left;
  background: #f5f5f5;
  background-image:url('https://lf3-cdn2-tos.bytescm.com/toutiao/toutiao_web_pc/svgs/search_icon_red.7fe98096.svg') ;
  position: relative;
} */
.search-wrapper button i:before {
  content: "";
  display: block;
  width: 1px;
  height: 16px;
  background-color: #e8e8e8;
  position: absolute;
  left: 0;
}

.search-wrapper button span {
  display: inline-block;
  margin-left: 4px;
  font-size: 16px;
  color: #409EFF;
  background: #f5f5f5;
}

.search-wrapper button span:hover {
  color: #409EFF;
}

.loginPrompt {
  font-size: 18px;
  color: #409EFF;
  text-align: center;
  position: absolute;
  left: 30%;
  top: 35%;
}</style>
