<template>
    <!-- 上传组件 -->
    <el-upload class="single-uploader" v-model="imgUrl" :show-file-list="false" list-type="picture-card"
        :before-upload="handleBeforeUpload" :http-request="uploadFile">
        <img v-if="imgUrl" :src="imgUrl" class="single" alt="" />
        <el-icon v-else class="single-uploader-icon"><i-ep-plus /></el-icon>
    </el-upload>
</template>
  

<script>
export default {
    props: {
        modelValue: {
            type: String,
            default: "https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png"
        }
    },
    computed: {
        imgUrl: {
            get() {
                console.log(this.modelValue);
                return this.modelValue;
            },
            set(val) {
                console.log(val);
                // imgUrl改变时触发修改父组件绑定的v-model的值
                this.$emit('update:modelValue', val)
            }
        }
    },
    methods: {
        async uploadFile(options) {
            console.log(options);
            const { data } = await this.$API.uploadFileApi(options.file);
            console.log(data);
            this.imgUrl = data.fileInfoVO.url;
        },
        handleBeforeUpload(file) {
            if (file.size > 2 * 1048 * 1048) {
                this.$message.warning('上传图片不能大于2M');
                return false;
            }
            return true;
        }
    }
}
</script>

  
<style scoped>
.single-uploader .single {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
  
<style>
.single-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.single-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.single-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
  