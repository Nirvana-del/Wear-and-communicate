<template>
  <div>
    <div class="personhead">
      <div class="person_avatarimage">
        <span class="headerSpan">
          <img v-if="userinfo.avatar" :src="userinfo.avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <input @change="uploadAvatar($event)" ref="file" type="file" accept="image/*" class="hiddenInput" />
        </span>
        <!-- <SingleUpload class="text-center" v-model="userinfo.avatar"></SingleUpload> -->
        <!-- <el-upload class="avatar-uploader" action="http://10.33.36.231:8080/dress/file/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"> -->
   
        <!-- </el-upload> -->
      </div>
      <div class="person_text">
        <div class="user_text">
          <div class="user_name">
            <span>{{ userinfo.username }}</span>
          </div>
          <div>
            <i class="el-icon-data-analysis"></i>
            <span class="user-v-font">穿搭达人</span>
          </div>
          <div class="user_qianming">
            <span>相见恨晚</span>
          </div>
        </div>
      </div>
    </div>

    <el-form class="userinfo">
      <el-descriptions class="userinfoform" title="个人信息" :column="1" label="" border>
        <template slot="extra">
          <el-button type="text" size="small" @click="openEditInfo">修改个人信息</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ userinfo.username }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ userinfo.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            用户昵称
          </template>
          {{ userinfo.nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-female"></i>
            性别
          </template>
          {{ genderMap[userinfo.gender] }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-present"></i>
            年龄
          </template>
          {{ style.age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-place"></i>
            身材特征
          </template>
          {{ style.characteristics }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-thumb"></i>
            穿搭风格
          </template>
          {{ style.style }}
        </el-descriptions-item>
      </el-descriptions>
    </el-form>
    <!--修改个人信息-->
    <el-dialog title="修改个人信息" width="480px" :visible.sync="editInfoVisible" center @close="editInfoclose">
      <el-form ref="editinfoForm" :rules="editinfoRules" :model="editinfoForm" label-position="left" label-width="90px"
        size="medium">
        <el-form-item label="用户名" prop="username" style="width: 390px">
          <el-input v-model="editinfoForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile" style="width: 390px">
          <el-input v-model="editinfoForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname" style="width: 390px">
          <el-input v-model="editinfoForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" style="width: 390px">
          <el-select v-model="editinfoForm.gender" placeholder="性别">
            <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age" style="width: 390px">
          <el-input v-model="styleForm.age"></el-input>
        </el-form-item>
        <el-form-item label="身材特征" prop="characteristics" style="width: 390px">
          <el-input v-model="styleForm.characteristics"></el-input>

        </el-form-item>
        <el-form-item label="穿搭风格" prop="style" style="width: 390px">
          <el-input v-model="styleForm.style"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :plain="true" type="primary" @click="updateSelfInfor">确定</el-button>
        <el-button @click="editInfoVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/index.vue';
export default {
  components: {
    SingleUpload
  },
  data() {
    const genderMap = {
      1: '男',
      2: '女'
    }
    const genderOptions = [
      {
        value: 0,
        label: '未知'
      },
      {
        value: 1,
        label: '男'
      },
      {
        value: 2,
        label: '女'
      }
    ]
    return {
      userinfo: {
        avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      },
      emailinfo: {},
      style: {},
      avatarUrl: '',
      genderOptions,
      genderMap,
      bindEmailVisible: false,
      bindEmailClose: false,
      editInfoVisible: false,
      // emailFormtitle: "绑定邮箱",
      // // 是否已绑定邮箱，有为1，未绑定为0
      // ifEmail: 0,
      //更换邮箱
      emailForm: {
        mail: "",
        username: "",
        password: "",
        age: '',
        characteristics: '',
        style: ''
      },
      emailRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      // 修改个人信息 
      editinfoRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
      },
      editinfoForm: {
        id: "",
        username: "",
        mobile: "",
        nickname: "",
      },
      styleForm: {
        userId: '',
        age: '',
        characteristics: '',
        style: '',
        infoId: ''
      }
    };
  },
  created() {
    this.getUserInfo();
    // this.getUserEmail()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.userinfo.avatar = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getUserInfo() {
      if (window.sessionStorage.getItem('userId')) {
        const userId = window.sessionStorage.getItem('userId')
        this.$API.getSelfInfoById(userId)
          .then((res) => {
            console.log(res);
            if (res.code === '20000') {
              this.userinfo = res.data.user;
              this.style = res.data.style;
              window.sessionStorage.setItem("userId", res.data.user.id);
              window.sessionStorage.setItem("nickname", res.data.user.nickname);
              window.sessionStorage.setItem("avatar", res.data.user.avatar);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

    },
    // 修改头像
    uploadAvatar(e) {
      var pictureData = new FormData();
      pictureData.append('file', e.target.files[0])
      this.$API.uploadFileApi(pictureData).then(res => {
        console.log(res);
        if (res.code === '20000') {
          this.userinfo.avatar = res.data.fileInfoVO.url
          const { username, nickname } = this.userinfo
          this.$API.UpdateSelfInfor(this.userinfo.id, { nickname, username, avatar: res.data.fileInfoVO.url }).then(res => {
            if (res.code === '20000') {
              this.$message.success("头像修改成功！");
              this.getUserInfo()
            }
          }).catch(err => { console.log(err) })

        } else {
          this.$message.error("图片过大，请重新上传！");
        }
      }).catch(err => { console.log(err) })
    },
    // 修改个人信息
    openEditInfo() {
      this.editInfoVisible = true;
      this.editinfoForm.id = this.userinfo.id;
      this.editinfoForm.username = this.userinfo.username;
      this.editinfoForm.mobile = this.userinfo.mobile;
      this.editinfoForm.nickname = this.userinfo.nickname;
      this.editinfoForm.gender = this.userinfo.gender;
      this.styleForm.age = this.style.age;
      this.styleForm.characteristics = this.style.characteristics;
      this.styleForm.style = this.style.style;
      this.styleForm.userId = this.style.userId;
      this.styleForm.infoId = this.style.infoId;
    },
    editInfoclose() {
      this.editinfoForm = {};
      this.$refs.editinfoForm.clearValidate();
      // this.$refs.editinfoForm.resetField()
    },
    // 修改个人信息 接口
    updateSelfInfor() {
      this.$refs.editinfoForm.validate((valid) => {
        if (valid) {
          this.$API
            .UpdateSelfInfor(this.userinfo.id, this.editinfoForm)
            .then((res) => {
              console.log(res);
              if (res.code === '20000') {
                this.$message.success("修改成功");
                this.editInfoVisible = false;
                this.getUserInfo();
              }
            })
            .catch((err) => {
              console.log("err");
              console.log(err);
              this.$message.error("发送失败！");
            });
          this.$API.updateStyleApi(this.styleForm).then(res => {
            console.log(res);
          })
        } else {
          this.$message.warning("请输入信息再提交！");
          return false;
        }
      });
    },
    // 邮箱
    bindEmailclose() {
      this.emailForm = {};
      this.$refs.emailForm.clearValidate();
    },
    // 邮箱验证码
    getCaptcha() {
      console.log(JSON.stringify(this.emailForm));
      if (this.emailForm.mail) {
        this.$API
          .SendCaptcha(this.emailForm.mail)
          .then((res) => {
            if (res.code === 20000) {
              this.$message.success(res.message);
            } else {
              this.$message.error("发送失败，请检查邮箱号是否正确！");
            }
          })
          .catch((err) => {
            console.log("err");
            console.log(err);
            this.$message.error("发送失败，请检查邮箱号是否正确！");
          });
      } else {
        this.$message.warning("请输入邮箱号~");
      }
    },
    // 绑定邮箱
    bindEmail() {
      console.log(JSON.stringify(this.emailForm));
      this.$refs.emailForm.validate((valid) => {
        if (valid) {
          this.$API
            .BindingMail(
              this.emailForm.mail,
              this.emailForm.username,
              this.emailForm.captcha,
              this.emailForm.password
            )
            .then((res) => {
              console.log(res);
              if (res.code === 20000) {
                this.$message.success("邮箱绑定成功！");
                this.bindEmailVisible = false;
                this.getUserInfo();
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              console.log("err");
              console.log(err);
            });
        } else {
          this.$message.error("请填入完整信息");
          return false;
        }
      });
    },
    // 更换邮箱
    changeEmail() {
      console.log(JSON.stringify(this.emailForm));
      this.$refs.emailForm.validate((valid) => {
        if (valid) {
          this.$API
            .ReplaceTheBinding(
              this.emailForm.mail,
              this.emailForm.username,
              this.emailForm.captcha,
              this.emailForm.password
            )
            .then((res) => {
              console.log(res);
              if (res.code === 20000) {
                this.$message.success("邮箱更换成功！");
                this.bindEmailVisible = false;
                this.getUserInfo();
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              console.log("err");
              console.log(err);
            });
        } else {
          this.$message.error("请填入完整信息");
          return false;
        }
      });
    },
  },
};
</script>
<style  scoped>
.personhead {
  padding: 15px;
  display: flex;
  border-radius: 1px;
  background-color: #f1f1f1;
}

.person_text {
  height: 100px;
  width: 880px;
  display: flex;
}

.user_text {
  width: 60%;
  line-height: 29px;
  padding-top: 5px;
  margin-left: 30px;
}

.user_name {
  font-weight: bold;
  font-size: 20px;
}

.el-icon-data-analysis {
  color: rgb(54, 116, 251);
}

.user-v-font {
  font-size: 14px;
  padding-left: 4px;
}

.user_qianming {
  font-size: 14px;
  color: rgb(132, 119, 119);
}

.user_num {
  margin-left: 60px;
  display: flex;
  align-items: center;
}

.user_num>div {
  text-align: center;
  border-right: 1px dotted #999;
  box-sizing: border-box;
  width: 80px;
  height: 40px;
  line-height: 20px;
}

.num_text {
  color: #999;
}

.num_number {
  font-size: 20px;
  color: #333;
}

.el-menu-item>span {
  font-size: 16px;
  color: #999;
}

.userinfo {
  padding: 20px;
}

/* 更换头像 */
/* 鼠标悬浮时的灰膜样式设置 */
.person_avatarimage {
  margin-left: 15px;
}

.headerImg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.headerSpan {
  position: relative;
  z-index: 1;
  display: inline-block;
}

.headerSpan:after {
  content: "";
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -ms-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
  position: absolute;
  border-radius: 45px;
  top: 0px;
  right: 0;
  width: 100px;
  height: 100px;
  opacity: 0;
  filter: alpha(opacity=0);
}

.headerSpan:hover:after {
  opacity: 100;
  filter: alpha(opacity=0);
  cursor: pointer;
}

/* 更换头像字的样式设置 */
.headerSpan:before {
  content: "更换头像";
  display: inline-block;

  position: absolute;
  z-index: 5;
  top: 40px;
  right: 0.5rem;
  width: 4.5rem;
  height: 2.7rem;
  opacity: 0;
  color: white;
  filter: alpha(opacity=0);
}

.headerSpan:hover:before {
  opacity: 100;
  filter: alpha(opacity=0);
  cursor: pointer;
}

.hiddenInput {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  z-index: 6;
  opacity: 0;
  cursor: pointer;
  border-radius: 50%;
}
</style>