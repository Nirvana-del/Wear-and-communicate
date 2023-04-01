<template>
  <el-container>
    <el-header>
      <SystemBar class="newsCategory" @item-click="getCategory($event)" />
      <div class="pagehead" style="margin-top: 15px;cursor: pointer;">
        <el-page-header @back="goBack" content="帖子详情"> </el-page-header>
      </div>
    </el-header>
    <el-main>
      <div class="newsDetail-wrapper">
        <div class="nodata" v-show="!ifDetail"><el-empty :image-size="300" description="数据跑丢啦"></el-empty></div>
        <div class="newsDetail" v-show="ifDetail">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content">
                <div class="left-sidebar">
                  <div class="shadow" style="cursor: pointer;" @click="likeNews"><img :src="ifLikeNews == 0 ? imgUrl1 : imgUrl2" alt="">
                    <p>{{ this.newsDetail.forum?.star }}</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="detailDisplay grid-content">
                <div class="newsTopic">
                  <span class="newsDetailTitle">{{ this.newsDetail.forum?.title }}</span>
                  <div class="publishInfo">
                    <span>{{ this.newsDetail.forum?.createTime }}</span>
                    <span>{{ this.newsDetail.forum?.author }}</span>
                  </div>
                </div>
                <div class="newsContent" v-html="this.newsDetail.forum?.content">
                </div>
                <div class="nodata" v-show="!hasComment"><el-empty :image-size="100" description="暂无用户评论"></el-empty>
                </div>
                <div class="newsComment" v-show="hasComment">
                  <div class="comment-nav">评论</div>
                  <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
                    <el-avatar class="header-img" :size="40" :src="userInfo.avatar"></el-avatar>
                    <div class="reply-info">
                      <div tabindex="0" contenteditable="true" id="replyInput" spellcheck="false" placeholder="输入评论..."
                        class="reply-input" @focus="showReplyBtn" @input="onDivInput($event)">
                      </div>
                    </div>
                    <div class="reply-btn-box" v-show="btnShow">
                      <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
                    </div>
                  </div>
                  <div v-for="(item, i) in userCommentsList" :key="i" class="author-title reply-father">
                    <el-avatar class="header-img" :size="40" :src="item.avatarUrl"></el-avatar>
                    <div class="author-info">
                      <span class="author-name">{{ item.username }}</span>
                      <span class="author-time">{{ item.commentCreateTime }}</span>
                    </div>
                    <div class="icon-btn">
                      <img :src="item.ifLikeComment == 0 ? imgUrl1 : imgUrl2" alt=""
                        @click="likeUserComment(item.commentId, i)" style="width:17px;height:17px;margin-right:10px;cursor: pointer;">
                      <span @click="showReplyInput(i, item.username, item.commentId)"><i
                          class="iconfont el-icon-s-comment"></i>{{ item.commentNum }}</span>
                    </div>
                    <div class="talk-box" style="cursor: pointer;">
                      <p>
                        <span class="reply">{{ item.commentContent }}</span>
                      </p>
                      <i class="el-icon-arrow-down" @click.once="showSubComment(item.commentId, i)">展开</i>
                    </div>
                    <div class="reply-box" v-show="_subcommentsShow(i)">
                      <div v-for="(reply, j) in subCommentsList" :key="j" class="author-title">
                        <el-avatar class="header-img" :size="40" :src="reply.avatarUrl"></el-avatar>
                        <div class="author-info">
                          <span class="author-name">{{ reply.username }}</span>
                          <span class="author-time">{{ reply.commentCreateTime }}</span>
                        </div>
                        <div class="icon-btn">
                          <img :src="reply.ifLikeComment == 0 ? imgUrl1 : imgUrl2" alt=""
                            @click="likeSubComment(reply.commentId, j)" style="width:17px;height:17px;margin-right:10px">
                          <span @click="showReplyInput(i, reply.username, reply.commentId)"><i
                              class="iconfont el-icon-s-comment"></i>{{ reply.commentNum }}</span>
                        </div>
                        <div class="talk-box">
                          <p>
                            <span>回复 {{ reply.replyTo }}:</span>
                            <span class="reply">{{ reply.commentContent }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
                      <el-avatar class="header-img" :size="40" :src="userInfo.avatarUrl"></el-avatar>
                      <div class="reply-info">
                        <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."
                          @input="onDivInput($event)" class="reply-input reply-comment-input"></div>
                      </div>
                      <div class="reply-btn-box">
                        <el-button class="reply-btn" size="medium" @click="sendCommentReply(i)"
                          type="primary">发表评论</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content">
                <div class="author-wrapper">
                  <div class="authorInfo">
                    <div class="username">{{ this.newsDetail.forum?.author }}</div>
                  </div>
                  <button type="button" v-if="newsDetail.userId != userId && userId" @click="payAttention">立即沟通</button>
                  <button type="button" v-if="newsDetail.userId == userId && userId" @click="gotoMyForum">我的帖子</button>
                  <button type="button" v-if="!userId" @click="gotoLogin">去登录</button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
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
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() { },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
const bfs = root => {
  if (!root) return;
  const queue = [root];
  const list = []
  while (queue.length) {
    const top = queue.shift();
    list.push(top)
    if (top.commentList) {
      top.commentList.forEach(child => {
        queue.push(child)
      })
    }
  }
  return list;
};
import SystemBar from "../../common/navbar/SystemBar.vue";

export default {
  name: 'NewsDetail',
  data() {
    return {
      userInfo: {},
      forumId: this.$route.query.id,
      newsDetail: {},
      ifDetail: false,
      input: '',
      ifEnter: 0,
      hasComment: false,
      loginPromptVisible: false,
      reportTitle: '',
      reportContent: '',
      ifLikeNews: 0,
      ifCollectNews: 0,
      ifLikeComment: 0,
      imgUrl1: require('../../../assets/imgs/like.png'),
      imgUrl2: require('../../../assets/imgs/icon-getLike.png'),
      imgUrl3: require('../../../assets/imgs/icon-noCollect.png'),
      imgUrl4: require('../../../assets/imgs/icon-collect.png'),
      imgUrl5: require('../../../assets/imgs/view.png'),
      publishedTodayList: [],
      todayListLength: 0,
      currentIndex: 0,
      btnShow: false,
      commentShow: false,
      inputShow: false,
      index: 0,
      replyComment: '',
      to: '',
      toId: -1,
      loginInfo: {},
      userCommentsList: [],
      subCommentsList: [],
      userId: ''
    }
  },
  components: {
    SystemBar
  },
  directives: { clickoutside, bfs },
  created() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo']),
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
  methods: {
    gotoLogin(){
      this.$router.push('/Login')
    },
    goBack() {
      console.log(111);
      this.$router.push("/");
    },
    getCategory(item) {
      window.sessionStorage.setItem("currentCategory", item);
      this.$router.push('/')
    },
    goLogin() {
      this.$router.push('/Login')
    },
    goNewsDetail(id) {
      if (this.$route.path !== id.url) {
        this.$router.push('/NewsDetail?id=' + id);
      }
    },
    gotoMyForum() {
      this.$router.push('/MyForum');
    },
    initData() {
      if (window.sessionStorage.getItem('userId')) {
        const userId = window.sessionStorage.getItem('userId')
        this.userId = userId
        console.log(this.userId);
        this.$API.getSelfInfoById(userId)
          .then((res) => {
            console.log(res);
            if (res.code === '20000') {
              this.userInfo = res.data.user
              window.sessionStorage.setItem("userId", res.data.user.id);
              window.sessionStorage.setItem("nickname", res.data.user.nickname);
              window.sessionStorage.setItem("avatar", res.data.user.avatar);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.$API.getInvitationDetail(this.forumId).then(res => {
        if (res.code === '20000') {
          this.newsDetail = res.data.forum
          console.log(this.newsDetail.userId);
          this.ifDetail = true
          this.reportTitle = res.data.forum.forum.title
        }
      }).catch(err => {
        console.log(err)
      });
      this.$API.getAllFirstComment(this.forumId).then(res => {
        console.log(res);
        if (res.code === '20000') {
          console.log(res.data.comments);
          this.userCommentsList = res.data.comments
          let new_arr = res.data.comments.map(obj => { return obj.commentId })

          for (let i = 0; i < new_arr.length; i++) {
            let temp = this.userCommentsList[i];
            temp.ifLikeComment = this.ifLikeComment;
            temp.inputShow = this.inputShow
            temp.commentShow = this.commentShow
            this.$set(this.userCommentsList, i, temp);
          }
          this.hasComment = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    payAttention(event) {
      const { userId, avatar, nickName } = this.newsDetail
      this.$router.push({ path: '/MessageCenter', query: { sellerId: userId, sellerAvatar: avatar, sellerNickName: nickName } })
    },
    //点赞
    likeNews() {
      if (this.ifLikeNews === 0) {
        this.$API.likeForumApi(this.forumId).then(res => {
          if (res.code === '20000') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.ifLikeNews = 1
            this.newsDetail.forum.star++;

          } else if (res.code === 209) {
            this.loginPromptVisible = true
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.ifCollectNews = 0
        this.newsDetail.forum.star--;
        this.$message({
          type: 'success',
          message: 取消点赞
        });
      }
    },
    //点赞评论
    likeUserComment(id, index) {
      let temp = this.userCommentsList[index];
      if (temp.ifLikeComment === 0) {
        this.$API.likeCommentApi(id).then(res => {
          if (res.code === '20000') {
            temp.ifLikeComment = 1
            this.$set(this.userCommentsList, index, temp)
            this.$message({
              type: 'success',
              message: res.message
            });

          } else if (res.code === 209) {
            this.loginPromptVisible = true
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        temp.ifLikeComment = 0
        this.$set(this.userCommentsList, index, temp);
      }
    },
    likeSubComment(id, index) {
      let temp = this.subCommentsList[index];
      if (temp.ifLikeComment === 0) {
        this.$API.likeComment(id).then(res => {
          if (res.code === 20000) {
            temp.ifLikeComment = 1
            this.$set(this.subCommentsList, index, temp)
            this.$message({
              type: 'success',
              message: res.message
            });

          } else if (res.code === 209) {
            this.loginPromptVisible = true
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        temp.ifLikeComment = 0
        this.$set(this.subCommentsList, index, temp);
      }
    },
    showSubComment(id, index) {
      this.subCommentsList = []
      let list = []
      this.$API.getChildrenComment(id).then(res => {
        console.log(res);
        if (res.code === '20000') {
          list = bfs(res.data.comment)
          for (let i = 0; i < list.length; i++) {
            let temp = list[i];
            temp.ifLikeComment = this.ifLikeComment;
            temp.inputShow = this.inputShow
            if (i > 1) {
              temp.replyTo = list[i - 1].username
            } else if (i == 1) {
              temp.replyTo = this.userCommentsList[index].username
            }
            this.$set(list, i, temp);
          }
          console.log(list.slice(1));
          this.subCommentsList = list.slice(1)
        }
      }).catch(err => {
        console.log(err)
      })
      this.userCommentsList[this.index].commentShow = false
      this.index = index
      this.userCommentsList[index].commentShow = !this.userCommentsList[index].commentShow
    },
    inputFocus() {
      var replyInput = document.getElementById('replyInput');
      replyInput.style.padding = "8px 8px"
      replyInput.style.border = "2px solid blue"
      replyInput.focus()
    },
    showReplyBtn() {
      this.btnShow = true
    },
    hideReplyBtn() {
      this.btnShow = false
      replyInput.style.padding = "10px"
      replyInput.style.border = "none"
    },
    showReplyInput(i, name, id) {

      let temp1 = this.userCommentsList[this.index];
      temp1.inputShow = false
      this.$set(this.userCommentsList, this.index, temp1);

      this.index = i

      let temp2 = this.userCommentsList[i];
      temp2.inputShow = true
      this.$set(this.userCommentsList, i, temp2);
      this.to = name
      this.toId = id

    },
    _subcommentsShow(i) {
      return this.userCommentsList[i].commentShow
    },
    _inputShow(i) {
      return this.userCommentsList[i].inputShow
    },
    sendComment() {
      if(!this.userId){
        return this.$message.warning('请先登录！')
      }
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        this.$API.addComment(this.forumId, this.replyComment).then(res => {
          if (res.code === '20000') {
            let a = {}
            let input = document.getElementById('replyInput')
            let timeNow = new Date().getTime();
            let time = this.dateStr(timeNow);
            a.username = this.userInfo.username
            a.commentContent = this.replyComment
            a.avatarUrl = this.userInfo.avatarUrl
            a.commentCreateTime = time
            a.commentNum = 0
            a.ifLikeComment = this.ifLikeComment
            this.userCommentsList.push(a)
            this.replyComment = ''
            input.innerHTML = '';
            this.$message({
              type: 'success',
              message: res.message
            });
          } else if (res.code === 209) {
            this.loginPromptVisible = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    sendCommentReply(i) {
      console.log(this.userId);
      if(!this.userId){
        return this.$message.warning('请先登录！')
      }
      if (!this.replyComment) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '评论不能为空'
        })
      } else {
        this.$API.addCommentLevel2(this.userCommentsList[i].commentId, this.replyComment).then(res => {
          if (res.code === '20000') {
            let a = {}
            let timeNow = new Date().getTime();
            let time = this.dateStr(timeNow);
            a.username = this.userInfo.username
            a.replyTo = this.userCommentsList[i].username
            a.avatarUrl = this.userInfo.avatarUrl
            a.commentContent = this.replyComment
            a.commentCreateTime = time
            a.ifLikeComment = this.ifLikeComment
            this.subCommentsList.push(a)
            this.replyComment = ''
            document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
            this.userCommentsList[i].commentShow = true
            this.$message({
              type: 'success',
              message: res.message
            });
          } else if (res.code === 209) {
            this.loginPromptVisible = true
          }
        })
      }
    },
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML;
    },
    dateStr(date) {
      //获取js 时间戳
      var time = new Date().getTime();
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time = parseInt((time - date) / 1000);
      //存储转换值 
      var s;
      if (time < 60 * 10) {//十分钟内
        return '刚刚';
      } else if ((time < 60 * 60) && (time >= 60 * 10)) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60);
        return s + "分钟前";
      } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60);
        return s + "小时前";
      } else if ((time < 60 * 60 * 24 * 30) && (time >= 60 * 60 * 24)) {
        //超过1天少于30天内
        s = Math.floor(time / 60 / 60 / 24);
        return s + "天前";
      } else {
        //超过30天ddd
        var date = new Date(parseInt(date));
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      }
    },


  }
}
</script>

<style scoped>
@import url('../../../assets/css/hotList.css');
@import url('../../../assets/css/newsDetail.css');

.el-header {
  /* background-color: #E7e7e3; */
  line-height: 50px;
  height: 50px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1)
}

::v-deep .el-radio {
  display: block;
  margin: 5px 0;
  padding: 10px;
}

.loginPrompt {
  font-size: 18px;
  color: #409EFF;
  text-align: center;
  position: absolute;
  left: 30%;
  top: 35%;
}
</style>
