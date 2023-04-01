<template>
  <el-container>
    <el-header>
      <SystemBar class="newsCategory" @item-click="getCategory($event)" />
    </el-header>
    <el-main>
      <el-row :gutter="24">
        <el-col :span="13">
          <div class="newsDisplay">
            <div class="nodata" v-show="dataLength === 0">
              <el-empty :image-size="200" description="暂无相关内容"></el-empty>
            </div>
            <div class="news-wrapper" v-for="item in this.forumList">
              <img :src="item.cover" @click="goNewsDetail(item.id)" alt="">
              <div class="newsTitle">{{ item.title }}</div>
              <div class="newsBrief">
                <div class="newsAuthor">{{ item.author }}</div>
                <div class="newsReleaseTime">{{ item.publishTime.substring(0, 9) }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="">
            <div class="author-wrapper" v-show="ifLogin == true">
              <div class="authorInfo">
                <div class="item" @click="toUserCenter" style="cursor: pointer;">
                  <span class="username">用户{{ username }}</span>
                  <i class="el-icon-arrow-right" style="display:block;padding-top:20px"></i>
                </div>
                <div>
                  <div class="item2">
                    <span class="username">已发帖：{{ forumLength }}</span>
                    <el-button @click="sendForum">立即发布</el-button>
                  </div>
                </div>
              </div>

            </div>
            <div v-show="ifLogin == true" class="forumButton">
              <el-link @click="getAll()" class="link" :type="current !== 0 ? 'primary' : 'default'">全部帖子</el-link>
              <el-link @click="choose(item)" :key="item.value" :type="current !== item.value ? 'primary' : 'default'"
                v-for="item in cateOptions" class="link">{{ item.label
                }}帖</el-link>
            </div>
            <div class="author-wrapper" v-show="ifLogin == false">
              <div class="loginPrompt">登录后查看更多精彩信息！</div>
              <button @click="goLogin">点击登录</button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import SystemBar from "../../src/components/common/navbar/SystemBar";
export default {
  name: 'home',
  components: { SystemBar },
  data() {
    return {
      ifLogin: false,
      username: window.sessionStorage.getItem('username'),
      dataLength: 0,
      forumList: [],
      forumLength: 0,
      cateOptions: {},
      current: 0
    }
  },
  created() {
    this.initData()
  },
  computed: {
    activation() {
      return (index) => { // 使用JavaScript闭包，进行传值操作
        if (index === 0) {
          return { 'color': '#A82E2E' }
        }
        else if (index === 1) {
          return { 'color': '#F04142' }
        }
        else if (index === 2) {
          return { 'color': '#FF9A03' }
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    choose(item) {
      console.log(item);
      this.current = item.value
      this.$API.getForumByCateApi(item.value).then(res => {
        this.forumList = res.data.forumList
      })
    },
    getAll() {
      this.current = 0
      this.$API.viewsAllInvitation()
        .then(res => {
          if (res.code === '20000') {
            this.forumList = res.data.forumList
            this.dataLength = res.data.forumList.length
          }
        })
    },
    getCategory() {
      this.$API.getCategoryApi().then(res => {
        console.log(res);
        this.cateOptions = res.data.categories.map(item => ({ value: item.id, label: item.name }))
      })
    },
    sendForum() {
      console.log('发布');
      this.$router.push('/ForumEdit')
    },
    init() {
      if (window.sessionStorage.getItem('token')) {
        this.ifLogin = true
      } else {
        this.ifLogin = false
      }
      this.$API.getCategoryApi().then(res => {
        console.log(res);
        this.cateOptions = res.data.categories.map(item => ({ value: item.id, label: item.name }))
      })

      this.$API.getSelfForumApi().then(res => {
        console.log(res.data.forumList);
        this.forumLength = res.data.forumList.length
      })
    },
    initData() {
      this.getAll()
    },
    goLogin() {
      this.$router.replace('/Login')
    },
    toUserCenter: function () {
      this.$router.push('/UserCenter')
    },
    //跳转详情
    goNewsDetail(item) {
      this.$router.push('/ForumDetail?id=' + item);
    }
  }
}
</script>

<style  scoped>
.newsDisplay {
  margin-left: 100px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.news-wrapper {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.news-wrapper .newsTitle {
  margin-top: 10px;
  font-size: 15px;
  color: #4b4444;
  width: 100%;
  text-overflow:ellipsis;
}

.news-wrapper img {
  border-radius: 10px;
  width: 200px;
  height: 200px;
  /* object-fit: cover; */
}

.forumButton {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.forumButton .link {
  font-size: 30px;
  margin-top: 30px;
}

.news-wrapper .newsBrief {}

/* 作者信息 */
.author-wrapper {
  background: rgb(250, 250, 250);
  height: 210px;
  width: 90%;
  border-radius: 5%;
  overflow: hidden;
}

.loginPrompt {
  font-size: 22px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  margin-top: 50px;
}

.authorInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item {
  display: flex;
}

.item2 {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 22px;
  font-weight: bold;
  padding: 10px 10px 10px 0;
}
</style>
