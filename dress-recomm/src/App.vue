<template>
  <div>
    <router-view />
  </div>
</template>

<script>
// import WebSocket from '../websocket'

export default {
  // data() {
  //   return {
  //     path: 'ws://119.91.78.106:8899/news/statistical/ws/',
  //     username: 'admin',
  //     socket: '',
  //     lockReconnet: false,
  //     messageList: {
  //       report: [],
  //       reply: []
  //     }
  //   }
  // },
  // created() {
  //   // this.init()
  //   // this.initData()
  // },
  // methods: {
  //   initData() {
  //     this.$API.getSelfInfo().then(res => {
  //       if (res.code === 20000) {
  //         this.$store.commit('setUserInfo', res.data.user);//存值：请求回来的数据
  //       }
  //     })
  //   },
  //   init() {
  //     if (typeof (WebSocket) === "undefined") {
  //       alert("您的浏览器不支持socket")
  //     } else {
  //       try {
  //         // 实例化socket
  //         this.socket = new WebSocket(this.path + this.username)
  //         // 监听socket连接
  //         this.socket.onopen = this.open
  //         // 监听socket错误信息
  //         this.socket.onerror = this.error
  //         // 监听socket消息
  //         this.socket.onmessage = this.getMessage
  //         //发送数据
  //         this.socket.send = this.send
  //       } catch (e) {
  //         this.reconnect()
  //       }
  //     }
  //   },
  //   open: function () {

  //     console.log("socket连接成功")
  //   },
  //   error: function (msg) {
  //     console.log("连接错误", msg)

  //   },
  //   getMessage(msg) {
  //     console.log(msg.data);
  //     if (msg.data.substring(0, 3) == '举报：') {
  //       this.messageList.report.push(msg.data.slice(3))
  //       window.sessionStorage.setItem('reportNum', this.messageList.report.length);
  //     } else if (msg.data.substring(0, 3) == '回复：') {
  //       this.messageList.reply.push(msg.data.slice(3))
  //       window.sessionStorage.setItem('replyNum', this.messageList.reply.length);
  //     }

  //     window.sessionStorage.setItem('allMsg', JSON.stringify(this.messageList));

  //   },
  //   send: function (params) {
  //     console.log("send")
  //   },
  //   close: function () {
  //     console.log("socket已经关闭")
  //   },
  //   reconnect() {
  //     if (lockReconnet) { return false }

  //     this.lockReconnet = true
  //     setTimeout(() => {
  //       this.init()
  //       this.lockReconnet = false
  //     }, 2000)
  //   }
  // }
}
</script>

<style>
@import '../src/assets/css/common.css';
@import url('../src/assets/css/newsDisplay.css');

* {
  padding: 0;
  margin: 0;
}
</style>
