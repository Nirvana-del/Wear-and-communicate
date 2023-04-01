<template>
    <div class="nar-bar">
      <div class="left"><slot name="left"></slot></div>
      <div class="leftCenter"><slot name="leftCenter"></slot></div>
      <div class="rightCenter"><slot name="rightCenter"></slot></div>
      <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
    export default {
        name: "NavBar"
    }
</script>

<style scoped>
  .nar-bar {
    display: flex;
    line-height: 50px;
    height: 50px;
    font-size: 20px;
    font-family: system-ui,-apple-system,Segoe UI,Rototo,Helvetica,Arial,sans-serif;
  }

  .right,
  .rightCenter,
  .left {
    flex: 1;
  }

  .left{
    font-size: 25px;
    font-weight: 600;
    /* font-family: "Lucida Calligraphy", cursive, serif, sans-serif; */
    color:#409EFF;
  }

  .leftCenter{
    flex: 2;
  }
  .rightCenter{
    text-align: center; 
  }
  .right{
    font-size: 20px;
  }
  .right:hover{
    color: black;
  }

</style>
