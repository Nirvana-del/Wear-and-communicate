<template class="UserCenterPage">
  <div >
    <el-container class="UserCenter">
      <el-header>
        <div class="pagehead">
          <el-page-header @back="goBack" content="个人中心"> </el-page-header>
        </div>
      </el-header>
      <el-container class="personInfo" >
        <el-aside width="230px">
          <el-menu
            :default-active="this.$router.path"
            router
            active-text-color="#00c3ff"
            class="el-menu-vertical-demo"
          >
            <el-menu-item index="/UserInfo">
              <i class="el-icon-user"></i>
              <span slot="title">个人信息</span>
            </el-menu-item>
            <!-- <el-menu-item index="/MyConcern">
              <i class="el-icon-circle-plus-outline"></i>
              <span slot="title">我的关注</span>
            </el-menu-item>
            <el-menu-item index="/MyCollect">
              <i class="el-icon-document"></i>
              <span slot="title">我的收藏</span>
            </el-menu-item> -->
            <el-menu-item index="/MessageCenter">
              <i class="el-icon-document"></i>
              <span slot="title">我的消息</span>
            </el-menu-item>
            <el-menu-item index="/MyForum">
              <i class="el-icon-document"></i>
              <span slot="title">我的帖子</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container style="padding-right:2px; background-color: #f1f1f1; ">
          <el-main >
            <div class="personmain">
              <div class="person_body_right">
                <router-view />
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  created() {},
  methods: {
    goBack() {
      this.$router.replace("/");
    },
  },
};
</script>

<style  scoped>
.UserCenter {
  /*margin: 0 auto;
  display: flex;
   width: 1500px; */
  background-color: #f1f1f1;
}
.pagehead {
  padding: 20px;
  font-weight: bold;
 /* background-color: white;
   margin-bottom: 10px; */
}

.personInfo {
  /*margin: 0 auto;
  display: flex;
  margin-top: 10px;
  */ 
  background-color: #ffffff; 
  
}
.el-aside {
  margin: 0 auto;
  display: flex;
  background-color: #f1f1f1;
}
.el-menu-vertical-demo {
  width: 200px;
  margin-left: 20px;
  text-align: center;
}

.el-main {
  margin-right: 10px;
  /* width: 1000px; */
  background-color: #ffffff;
} 
.person_body_right {
  width: auto;
  /* height: 600px; */
  border-radius: 5px;
  /* background-color: rgb(70, 58, 58); */
}

/* .box-card {
  height: 500px;
} */
</style>