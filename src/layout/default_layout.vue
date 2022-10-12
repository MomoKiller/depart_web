<template>
  <el-container class="wh100 is-vertical">
    <el-header height="64px" class="bg_white">
      <com-header @fold="foldChange"></com-header>
    </el-header>
    <el-container style="height: calc(100% - 65px);">
      <com-menu :fold="fold"></com-menu>
      <el-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <!-- <router-view></router-view> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ComHeader from '@/components/header';
import ComMenu from '@/components/menu';

export default {
  data(){
    return {
      fold: false
    };
  },
  methods: {
    foldChange(e){
      this.fold = e;
    }
  },
  components: {
    ComHeader,
    ComMenu
  }
}
</script>

<style lang="less" scoped>
.el-header {
  padding: 0 30px !important;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}
</style>
