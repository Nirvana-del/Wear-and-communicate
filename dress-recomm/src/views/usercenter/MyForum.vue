<template>
    <div>
        <div v-for="item of forumList" :style="{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            justifyContent: 'space-between',
            cursor: 'pointer'
        }">
            <img :src="item.cover" width="100" height="100" alt="" @click="goDetail(item.id)" >
            <div>{{ item.title }}</div>
            <el-button type="danger" @click="deleteForum(item.id)">删除帖子</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            forumList: []
        };
    },
    created() {
        this.getSelfForum()
    },
    methods: {
        getSelfForum() {
            this.$API.getSelfForumApi().then(res => {
                console.log(res.data.forumList);
                this.forumList = res.data.forumList
            })
        },
        goDetail(id) {
            this.$router.push('/ForumDetail?id=' + id);
        },
        deleteForum(id) {
            let _this = this
            this.$confirm('确认删除帖子?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                _this.$API.deleteForumApi(id).then(() => {
                    _this.$message.success('删除成功');
                    _this.getSelfForum();
                });
            });
        }
    }
};
</script>

<style scoped lang="scss"></style>
