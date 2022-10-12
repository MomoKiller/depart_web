<template>
  <div id="app">
    <el-container class="wh100">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import "./common.less";
#app {
  min-width: 1200px;
  font-family: Microsoft YaHei, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
