<!--  --> 
<template>
  <div>
    <div class="regiterHead">
      <span>穿搭交流与推荐平台</span>
    </div>
    <div class="regiterMain">
      <div class="body">
        <div class="contianer">
          <div class="contianerTitle">
            <div class="RegiterTitle">
              <div style="float: left; font-size: 24px">
                <span>账户注册</span>
              </div>
              <div style="float: right; padding-right: 42px">
                <span style="text-align: left">已有账户，</span>
                <span class="gotoLogin" style="padding-left: 0" @click="gotoLogin">去登录></span>
              </div>
            </div>
          </div>
          <div class="contianerBody">
            <div class="loginDetail">
              <el-form :model="registerInfo" :rules="rules" ref="registerInfo" class="registerContainer" size="medium ">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="registerInfo.username" placeholder="请输入用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="username">
                  <el-input v-model="registerInfo.nickname" placeholder="请输入用户昵称" clearable></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" style="width: 390px">
                  <el-select v-model="registerInfo.gender" placeholder="性别">
                    <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input :type="passw" v-model="registerInfo.password" placeholder="请输入密码" autocomplete="off" clearable
                    show-password>
                  </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkpassword">
                  <el-input :type="passw" v-model="registerInfo.checkpassword" placeholder="请再次输入密码" autocomplete="off"
                    clearable show-password></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="registerInfo.phone" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="registerButton" style="width: 100%; background-color: #2794f8; color: white"
                    @click="RegisterUser">
                    注册
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerInfo.password !== "") {
          this.$refs.registerInfo.validateField("checkpassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
      bindEmailVisible: false,
      bindEmailClose: false,
      // canClose: false,
      //用于改变Input类型
      passw: "password",
      genderOptions,
      // 是否完成注册，完成为1，未完成为0
      ifRegister: 0,
      //用于更换Input中的图标
      icon: "el-input__icon el-icon-view",
      registerInfo: {
        username: "",
        password: "",
        checkpassword: "",
        phone: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入注册用户名", trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkpassword: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
      },
      //绑定邮箱
      emailForm: {
        mail: "",
        username: "",
        captcha: "",
        password: "",
      },
      emailRules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" },],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      loading: "",
    };
  },
  methods: {
    gotoLogin() {
      this.$router.replace("/Login");
    },
    RegisterUser() {
      console.log(JSON.stringify(this.registerInfo));
      // let regex = "1[3-9]\\d{9}";
      // if (!this.registerInfo.phone.match(regex)) {
      //   (this.registerInfo.phone = ""),
      //     this.$message.error("请正确填写用户电话号码！");
      // } else {}
      this.$refs.registerInfo.validate((valid) => {
        if (valid) {
          console.log(this.registerInfo);
          const {
            gender,
            nickname,
            username,
            phone,
            password
          } = this.registerInfo
          const newObj = {
            gender,
            nickname,
            username,
            mobile: phone,
            password
          }
          this.$API
            .RegisterUserApi(newObj)
            .then((res) => {
              console.log(res);
              if (res.code === '20000') {
                this.$message.success("用户注册成功，请前往登录！");
                this.$router.push('/Login')
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.error("请填入完整信息");
          return false;
        }
      });
    },
    // //更换图标
    // showPass() {
    //   if (this.passw == "text") {
    //     this.passw = "password";
    //     this.icon = "el-input__icon el-icon-view";
    //   } else {
    //     this.passw = "text";
    //     this.icon = "el-input__icon el-icon-minus";
    //   }
    // },
    // 邮箱
    bindEmailclose() {
      if (this.ifRegister != 1) {
        this.bindEmailVisible = ture;
        this.$message.error("请绑定邮箱！");
      }
      // this.emailForm = {};
      // this.$refs.emailForm.clearValidate();
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
                this.$message.success("邮箱绑定成功,请登录！");
                this.bindEmailVisible = false;
                this.$router.replace("/Login");
                // this.getUserInfo();

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
@import "../assets/css/login.css";

.regiterHead {
  line-height: 50px;
  height: 50px;
}

.regiterHead span {
  padding-left: 80px;
  font-size: 20px;
  font-weight: bold;
}

.regiterMain {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
}

.body {
  width: 992px;
  margin-top: 15px;
  margin-bottom: 30px;
  background: white;
}

.contianerTitle {
  width: 992px;
  height: 86px;
  border-bottom: 2px solid #f1f1f1;
}

.RegiterTitle {
  padding: 30px 0px;
}

.RegiterTitle span {
  padding-left: 52px;
}

.gotoLogin {
  color: #526ecc;
}

.gotoLogin:hover {
  color: blue;
}

.contianerBody {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form-item {
  margin-bottom: 7px;
}

.loginDetail {
  margin-top: 40px;
  margin-bottom: 40px;
  width: 432px;
}

.registerButton {
  margin-top: 20px;
}

.el-form-item {
  margin-top: 22px;
}
</style>
 


   