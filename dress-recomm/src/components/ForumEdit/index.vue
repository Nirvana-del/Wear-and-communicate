<template>
  <el-container>
    <el-header>
      <SystemBar class="newsCategory" @item-click="getCategory($event)" />
      <div class="pagehead" >
          <el-page-header @back="goBack" content="发布帖子"> </el-page-header>
        </div>
    </el-header>
    <el-main style="margin-top: 15px;">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="发帖标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="帖子类型">
          <el-select v-model="form.categoryId" placeholder="请选择发帖类型">
            <el-option v-for="item in cateOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帖子封面">
          <div class="personhead">
            <div class="person_avatarimage">
              <span class="headerSpan">
                <img :src="form.cover">
                <input @change="sendPic($event)" ref="file" type="file" accept="image/*" class="hiddenInput" />
              </span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div style="margin-top: 100px;">
        <WangEditor @change="changeWang" v-model="WangValue" />
        <el-button style="margin-top: 20px;" @click="sendForum">立即发布</el-button>
      </div>
    </el-main>
  </el-container>
</template>
 
<script>
import WangEditor from "../WangEditor/index.vue";
import SystemBar from "@/components/common/navbar/SystemBar";
export default {
  components: {
    WangEditor,
    SystemBar
  },
  data() {
    return {
      WangValue: '',
      form: {
        title: '',
        categoryId: '',
        cover: ''
      },
      cateOptions: {}
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    goBack() {
      this.$router.replace("/");
    },
    sendPic(e) {
      console.log('上传封面');
      var pictureData = new FormData();
      pictureData.append('file', e.target.files[0])
      this.$API.uploadFileApi(pictureData).then(res => {
        console.log(res);
        if (res.code === '20000') {
          this.form.cover = res.data.fileInfoVO.url
          // this.userinfo.avatar = res.data.fileInfoVO.url
          // const { username, nickname } = this.userinfo
          // this.$API.UpdateSelfInfor(this.userinfo.id, { nickname, username, avatar: res.data.fileInfoVO.url }).then(res => {
          //   if (res.code === '20000') {
          //     this.$message.success("头像修改成功！");
          //     this.getUserInfo()
          //   }
          // }).catch(err => { console.log(err) })

        } else {
          this.$message.error("图片过大，请重新上传！");
        }
      }).catch(err => { console.log(err) })
    },
    getCategory() {
      this.$API.getCategoryApi().then(res => {
        console.log(res);
        this.cateOptions = res.data.categories.map(item => ({ value: item.id, label: item.name }))

      })
    },
    changeWang(html) {
      //这里的html是带有标签的
      this.WangValue = html
    },
    sendForum() {
      console.log(this.WangValue)
      console.log(this.form);
      const author = window.sessionStorage.getItem("nickname");

      // cover
      // content
      const newObj = {
        ...this.form,
        author,
        content: this.WangValue
      }
      this.$API.addForumApi(newObj).then(res => {
        console.log(res);
        if (res.code === '20000') {
          this.$message.success('发布成功')
          this.$router.push('/')
        } else {
          this.$message.error('发布失败')

        }
      })
    }

  }

}
</script>
<style scoped>
.personhead {
  padding: 15px;
  display: flex;
  border-radius: 1px;
  background-color: #f1f1f1;
}
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
.headerSpan:before {
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
</style>