<template>
  <div>
    <div>
      <h1 class="systemTitle">穿搭交流与推荐平台</h1>
    </div>
    <div>
      <el-form
        :rules="rules"
        v-loading="loading"
        element-loading-text="正在登录中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="loginForm"
        :model="loginForm"
        class="loginContainer"
      >
        <h2 class="loginTitle">用户登录</h2>
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            auto-complete="false"
            v-model="loginForm.password"
            placeholder="请输入密码"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- <img :src="captchaUrl" alt="">           -->
          <el-button
            style="width: 100%; background-color: #2794f8; color: white"
            @click="LoginUser"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <div class="optionitem">
            <span
              style="border-right: 1.5px solid #0000001a"
              @click="gotoRegister"
            >
              注册
            </span>
            <span @click="cancelLogin">取消登录</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.forgetPasswordForm.password !== '') {
            this.$refs.forgetPasswordForm.validateField('checkpassword');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
        if (value === '' ) {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.forgetPasswordForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      pageNum:1,
      captchaUrl: "",
      loginForm: {
        username: "user1",
        password: "123456",
      },
      forgetPasswordForm: {
        username: '',
        mail: '',
        captcha: '',
        password: '',
        checkpassword: ''
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      forgetRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        mail: [
          {
            required: true,
            message: "请输入邮箱号以便进行验证",
            trigger: "blur",
          },
        ],
        captcha: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
        ],
        checkpassword: [
          { validator: validatePass2, trigger: "blur" },
        ],
      },
      loading: "",
      forgetDialogVisible: false,
    };
  },
  created() {},
  methods: {
    LoginUser() {
      console.log(JSON.stringify(this.loginForm));
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.$router.replace("/Home");
          this.$API
            .LoginUser(this.loginForm)
            .then((res) => {
              console.log(res);
              if (res.code === '20000') {
                const token =res.data.tokenType + ' ' + res.data.accessToken
                window.sessionStorage.setItem("token", token);
                window.sessionStorage.setItem("username",this.loginForm.username);

              this.$router.replace("/");
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
    gotoRegister() {
      this.$router.replace("/Register");
    },
//忘记密码  邮箱 验证码
    getCaptcha() {
      console.log(JSON.stringify(this.forgetPasswordForm));
      if (this.forgetPasswordForm.mail) {
        this.$API
          .SendCaptcha(this.forgetPasswordForm.mail)
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
    forgetDialogClose() {
      this.forgetPasswordForm = {};
      this.$refs.forgetPasswordForm.clearValidate();
    },
    forgetPassword() {
      console.log(JSON.stringify(this.forgetPasswordForm));
      this.$refs.forgetPasswordForm.validate((valid) => {
        if (valid) {
          this.$API
            .ChangeThePassword(
              this.forgetPasswordForm.captcha,
              this.forgetPasswordForm.username,
              this.forgetPasswordForm.password
            )
            .then((res) => {
              console.log(res);
              if (res.code === 20000) {
                // this.$router.replace("/Login");
                this.$message.success("密码更改成功,请登录！");
                this.forgetDialogVisible = false;
              }else{
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
    cancelLogin(){
      this.$router.replace('/')
    }
  },
};
</script>

<style>
@import "../assets/css/login.css";

.systemTitle {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top: 120px;
  font-size: 50px;
  color: rgb(153, 169, 191);
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 40px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #d2d3d4;
}
.loginTitle {
  display: flex;
  align-content: center;
  justify-content: center;
  color: rgb(66, 94, 134);
}
.loginUsername,
.loginPwd {
  margin: 10px;
}
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-white {
  background-color: #ffffff;
}
.bg-purple {
  background: #2794f8;
  color: black;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.optionitem {
  text-align: center;
  color: #868686;
}
.optionitem span {
  padding: 0px 12px;
}
</style>
