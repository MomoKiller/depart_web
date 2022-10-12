<template>
  <div class="com_head wh100 flex_between">
    <div class="left flex_middle">
      <img src="@/assets/image/logo.png" title="上海序言泽网络科技有限公司" />
      <!-- <i class="fs18 c3 pointer ml20" :class="{'el-icon-s-fold': !is_fold, 'el-icon-s-unfold': is_fold}" @click="foldMenu" :title="is_fold ? '展开菜单' : '收起菜单'"></i> -->
    </div>
    <div class="right flex_middle pointer">
      <span class="c3 flex_middle">
        <el-avatar class="mr15" :src="require('@/assets/image/head.png')" size="small"></el-avatar>
        <!-- <el-avatar class="mr15" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" size="small"></el-avatar> -->
        <span>{{userInfo.name}}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      is_fold: false,
      userInfo: {}
    };
  },
  created(){
    this.userInfo = JSON.parse(window.localStorage.getItem('info')).info;
  },
  methods: {
    foldMenu(){
      this.is_fold = !this.is_fold;
      this.$emit('fold', this.is_fold);
    }
  }
}
</script>

<style lang="less" scoped></style>
