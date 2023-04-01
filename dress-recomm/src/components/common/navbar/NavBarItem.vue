<template>
    <div class="nav">
        <!-- 标题列表 -->
        <div class="nav-list">
            <div v-for="(item, index) in categoryList" :key="index"
            @click="changeTitle(item,index)" :class="{ 'nav-list--active': index === active }">
                {{ item.category }}
            </div>
        </div>
        <!-- 下划线 -->
        <div class="nav-line">
            <div :style="{transform: 'translateX(' + translateX + 'px) translateX(-50%)',}"></div>
        </div>
    </div>
</template>

<script>
export default {
  name:'NavBarItem',
  data () {
    return {
        categoryList: [],
        pageNum: 1,
        active: 0,
        translateX: 0
    }
  },
  //arr.indexOf(item)
  created(){
    // this.getAllCategory()
  },
  mounted() {
    this.setUnderLine();
  },
  methods:{
    getAllCategory(){
        this.$API.getAllCategory(this.pageNum)
          .then(res =>{
            if(res.code === 20000)
            {
              this.categoryList = res.data.categories
            }
          }).catch(err =>{
              console.log(err)
          })
      },
    changeTitle(item,index) {

        this.active = index;
        window.sessionStorage.setItem("currentCategory", item.category);
        
        this.$emit('item-click',item.category);
    },

    setUnderLine() {
        let width = document.documentElement.clientWidth;
        let slidingWidth = (width / this.categoryList.length).toFixed(2);
        let halfSlidingWidth = (slidingWidth / 2).toFixed(2);
        this.translateX = Number(halfSlidingWidth) + Number(slidingWidth * this.active);
    },
    // barClick(item){
    // //发射事件：自定义事件，item-click为发送的事件
    //     this.$emit('item-click',item)
    // }
  }
}
</script>

<style  scoped>
@import url('../../../assets/css/underline.css');
</style>
