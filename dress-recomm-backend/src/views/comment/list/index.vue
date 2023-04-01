<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {UserPageVO} from '@/api/user/types';
import {deleteCommentApi, getAllCommentApi} from "@/api/comments";

const loading = ref(false);
const ids = ref([]);
const dialogVisible = ref(false)
const forumDetail = ref('')
const forumList = ref<UserPageVO[]>();
/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getAllCommentApi()
    .then(({data}) => {
      console.log(data)
      forumList.value = data.comments;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}


function handleDelete(id?: number) {
  const commentIds = [id || ids.value].join(',');
  if (!commentIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm('确认删除该评论?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteCommentApi(commentIds).then(() => {
      ElMessage.success('删除成功');
      resetQuery();
    });
  });
}
function handleGoodsView(row: any){
  dialogVisible.value = true
  forumDetail.value = row.commentContent
}
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :lg="20" :xs="24">
        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  type="danger"
                  :disabled="ids.length === 0"
                  @click="handleDelete()"
                  v-hasPerm="['sys:user:delete']"
                >
                  <i-ep-delete/>
                  删除
                </el-button
                >
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="forumList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="commentId"
            />
            <el-table-column
              label="头像"
              align="center"
              prop="cover"
            >
              <template #default="scope">
                <el-popover placement="right" :width="400" trigger="hover">
                  <img :src="scope.row.avatarUrl" width="400" height="400" alt=""/>
                  <template #reference>
                    <img
                      :src="scope.row.avatarUrl"
                      style="max-height: 60px; max-width: 60px"
                      alt=""/>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              key="username"
              label="评论者"
              align="center"
              prop="nickName"
            />
            <el-table-column
              label="评论时间"
              align="center"
              prop="commentCreateTime"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="success"
                  link
                  @click.stop="handleGoodsView(scope.row)"
                >查看详情
                </el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.commentId)"
                >
                  <i-ep-delete/>
                  删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="评论详情">
      <div v-html="forumDetail"/>
    </el-dialog>
  </div>
</template>
