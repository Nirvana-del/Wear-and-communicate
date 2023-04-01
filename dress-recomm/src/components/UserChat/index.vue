<template>
    <div class="wrap">
        <div class="main">
            <div class="main_down">
                <el-card class="left" shadow="never">
                    <div class="left_up">
                        <div class="label_title">
                            消息列表
                        </div>
                        <div class="box-item" :class="curSessionId === item.username ? 'box_select' : 'box'"
                            v-for="item in sessionList_already" :key="item.id">
                            <el-avatar shape="square" :src="item.recipienHeadUrl" />
                            <div class="box-item-name" @click="startSession(item.username)">
                                {{ item.screenName }}
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card class="right" shadow="never">
                    <!--          聊天框-->
                    <div class="right-up" ref="chatBox" id="msg_end">
                        <el-empty v-if="this.list.length === 0" description="暂无聊天内容" />

                        <div v-for="(item, i) in list" :key="i" class="msg-wrap"
                            :class="item.senderUsername === String(userId) ? 'msg_right' : 'msg_left'">
                            <!--              发送者名称-->
                            <div class="msg-sender">
                                <el-tag size="small">{{ item.date }}</el-tag>
                                {{ item.senderName }}
                            </div>
                            <!--              头像以及消息内容-->
                            <div class="msg-down"
                                :class="item.senderUsername === String(userId) ? 'msg-right-down' : 'msg-left-down'">
                                <!--                我发送的消息-->
                                <div v-if="item.senderUsername === String(userId)" class="msg-right-down">
                                    <div class="msg-bubble">
                                        {{ item.message }}
                                    </div>
                                    <el-avatar shape="square" :src="item.senderHeadUrl" />
                                </div>
                                <div v-else class="msg-left-down">
                                    <!--                  :src="item.recipienHeadUrl === 'recipienHeadUrl' ? 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'-->
                                    <!--                  :item.recipienHeadUrl"-->
                                    <el-avatar shape="square" :src="item.senderHeadUrl" />
                                    <div class="msg-bubble">
                                        {{ item.message }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--          输入框-->
                    <div class="right-down">
                        <el-input type="textarea" :rows="9" placeholder="请输入内容，回车发送！" @keyup.enter.native="sendMsg"
                            v-model="textarea">
                        </el-input>
                        <el-button :class="{ 'sendButton-active': !textareaIsEmpty }" :color="!textareaIsEmpty && '#00BEBD'"
                            class="sendButton" @click="sendMsg" :disabled="textareaIsEmpty">发送
                        </el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'messageCenter',
    data() {
        const wsBaseUrl = 'ws://10.33.36.231:8899/dress/chat/'
        return {
            textarea: "",
            list: [],
            curUserId: "",
            curUserName: "",
            curSessionId: '',
            sessionList_already: [],
            sessionList_not: [],
            websock: null,
            wsBaseUrl,
            userinfo: {},
            userId: '',
            nickname: '',
            avatar: '',
            sellerAvatar: '',
            sellerNickName: ''
        }
    },
    created() {
        // this.getUserInfo()
    },
    mounted() {
        // console.log();
        console.log(window.sessionStorage.getItem("nickname"));
        console.log(window.sessionStorage.getItem("avatar"));
        const userId = window.sessionStorage.getItem("userId");
        const nickname = window.sessionStorage.getItem("nickname");
        const avatar = window.sessionStorage.getItem("avatar");
        this.userId = userId
        this.nickname = nickname
        this.avatar = avatar
        const { sellerId, sellerAvatar, sellerNickName } = this.$route.query
        console.log(sellerId, sellerAvatar, sellerNickName);
        this.curSessionId = sellerId
        this.sellerAvatar = sellerAvatar
        this.sellerNickName = sellerNickName
        if (sellerId) {
            this.curSessionId = sellerId
            this.initWebSocket(userId, sellerId);
        }

        this.sessionListAlready()
    },
    watch: {
        list: {
            deep: true,
            immediate: true,
            handler(newvalue, oldvalue) {
                console.log('监听到', newvalue, oldvalue)
                console.log(this.$refs);
                this.$nextTick(() => {
                    this.$refs.chatBox.scrollTop = this.$refs.chatBox?.scrollHeight;
                })
            }
        }
    },
    computed: {
        textareaIsEmpty() {
            return this.textarea.length === 0;
        }
    },
    methods: {
        getUserInfo() {
            if (window.sessionStorage.getItem('userId')) {
                const userId = window.sessionStorage.getItem('userId')
                this.$API.getSelfInfoById(userId)
                    .then((res) => {
                        console.log(res);
                        if (res.code === '20000') {
                            this.userinfo = res.data.user;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

        },
        initWebSocket(userId, sessionId) {
            console.log(userId, sessionId)
            // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
            this.websock = new WebSocket(this.wsBaseUrl + userId + "/" + sessionId);
            this.websock.onopen = this.websocketOnopen;
            this.websock.onerror = this.websocketOnerror;
            this.websock.onmessage = this.websocketOnmessage;
            this.websock.onclose = this.websocketClose;
        },
        websocketOnopen() {
            console.log("WebSocket连接成功");
        },
        websocketOnerror(e) {
            console.log("WebSocket连接发生错误", e);
        },
        websocketOnmessage(e) {
            const wsMsg = (e.data).slice(17, e.data.length - 1).split(',')
            let newObj = {}
            wsMsg.forEach((item) => {
                const key = item.split('=')[0].trim()
                const value = item.split('=')[1]
                newObj[key] = value
            })
            console.log(newObj)
            if (!this.sessionList_already.find((item) => item.username === newObj.username)) {
                this.sessionListAlready()
            }
            this.list.push(newObj)
        },
        websocketClose(e) {
            console.log("connection closed", e);
        },
        async sendMsg() {
            console.log(11);
            console.log(this.curSessionId === undefined);
            if (this.curSessionId === '' || this.curSessionId === undefined) {
                return this.$message.error("请选择左边的对话框开始聊天!")
            }
            const msgObj = {
                recipientUsername: this.curSessionId,
                recipienHeadUrl: this.sellerAvatar,
                recipienName: this.sellerNickName,
                senderUsername: this.userId,
                senderName: this.nickname,
                senderHeadUrl: this.avatar,
                message: this.textarea,
            }
            console.log(msgObj);
            this.textarea = ''
            await this.$API.sendMessageApi(msgObj)
        },
        // 获取已存在的会话列表
        async sessionListAlready() {
            const res = await this.$API.getChatListApi(this.userId)
            console.log(res.data.data.chatList)
            this.sessionList_already = res.data.data.chatList.map(item => JSON.parse(item)).filter(item => !!item.recipienHeadUrl && !!item.screenName)
        },
        // 开始会话
        startSession(sessionId) {
            if (this.websock != undefined) {
                this.websock.close()
            }
            this.list = []
            this.curSessionId = sessionId
            this.initWebSocket(this.userId, sessionId)
        }
    }
}

</script>

<style lang="scss" scoped>
.wrap {
    box-sizing: border-box;
    height: calc(100vh - 50px - 34px);
    //overflow: hidden;
    width: 100%;
    /* background: linear-gradient(to left,$base,$assist-clor); */
    background: linear-gradient(to bottom, #DEF3F4, #F2F6F8);

    .main {
        display: flex;
        justify-content: center;
        align-items: start;
        height: 100%;

        .main_down {
            //width: 60%;
            //height: 750px;
            //border: 1px #1890ff solid;
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .left {
            min-width: 200px;
            height: 83vh;
            //border-right: 1px #1890ff solid;
            margin-right: 5px;

            .box-item {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .box {
                //width: 250px;
                //height: 22px;
                padding: 10px 25px 10px 25px;
                display: flex;
                justify-self: flex-end;
                margin-top: 10px;
                /* border: 1px red solid; */
            }

            .box:hover {
                background-color: #F8F8F8;
                cursor: pointer;
            }

            .box_select {
                padding: 10px 25px 10px 25px;
                display: flex;
                justify-self: flex-end;
                margin-top: 10px;
                background-color: #F2F2F2;
            }

            .box-item-name {
                width: 230px;
                height: 22px;
                margin-left: 10px;
            }

            .left_up {
                width: 100%;
                height: 450px;
                overflow-y: auto;
                /* border: 1px red solid; */

                .label_title {
                    //width: 282px;
                    //height: 25px;
                    background-color: #f8f8f8;
                    font-weight: 600;
                    padding: 8px;
                }
            }

            .left_down {
                width: 300px;
                height: 300px;
                overflow-y: auto;
                /* border: 1px green solid; */
            }
        }

        .right {
            //width: 680px;
            height: 83vh;

            /* border-right: 1px #1890ff solid; */
            .right_left {
                width: 50px;
                height: 22px;
                display: flex;
                justify-content: space-between;
                /* border: 1px red solid; */
            }

            .right_left_count {
                /* border: 1px blue solid; */
                padding-left: 10px;
                width: 20px;
            }

            .right_left_del {
                width: 20px;
                padding-left: 10px;
            }

            .right-up {
                width: 50vw;
                height: 45vh;
                overflow-y: scroll;
                overflow-x: hidden;
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;

                /* padding-bottom: 40px; */
                //border-bottom: 1px #1890ff solid;
                .msg-wrap {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-top: 50px;

                    .msg-down {
                        margin-top: 10px;

                        .msg-bubble {
                            padding: 5px 10px;
                            background-color: #eee;
                            border-radius: 10%;
                            margin: 0 10px;
                        }
                    }

                    .msg-left-down {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding-left: 5px;
                    }

                    .msg-right-down {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        padding-right: 5px;
                    }
                }
            }

            .msg_left {
                width: 675px;
                /* padding-left: 5px; */
                margin-top: 5px;
                /* border: 1px #1890ff solid; */
            }

            .msg_left_up {
                height: 25px;
                margin-top: 5px;
            }

            .msg_left_down {
                height: 25px;
                /* border: 1px #1890ff solid; */
                padding-left: 10px;
            }

            .msg_right {
                //width: 660px;
                padding-right: 20px;
                margin-top: 5px;
                /* border: 1px #1890ff solid; */
                text-align: right;
            }

            .msg-sender {
                height: 25px;

            }

            .msg_right_down {
                height: 25px;
                /* border: 1px #1890ff solid; */
                padding-right: 10px;
            }

            .right-down {

                //width: 680px;
                //height: 200px;
                /* border: 1px red solid; */
                .sendButton {
                    margin-top: 10px;
                }

                /* .sendButton-active {
                    color: #fff;

                } */
            }
        }

    }

}
</style>
