<template>
  <div class="menu_wrap">
    <el-aside class="h100" :width="fold ? '64px' : '240px'">
      <el-menu
        :default-active="index"
        :collapse="fold"
        router
        background-color="#fff"
        active-text-color="#2D8CF0"
        unique-opened
      >
        <!-- 更新的导航 -->
        <el-menu-item index="/daily">
          <i class="el-icon-tickets"></i>
          <span slot="title">日常团建</span>
        </el-menu-item>
        <el-menu-item index="/direct">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">定向团建</span>
        </el-menu-item>
        <el-menu-item index="/approval" v-if="is_show_approve">
          <i class="el-icon-news"></i>
          <span slot="title">团建审核</span>
        </el-menu-item>
        <el-submenu index="/system_manage" v-if="menuArr.length">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item index="/cost" v-if="menuArr.find(d => d.id == 1)"
            >费用管理</el-menu-item
          >
          <el-menu-item index="/league" v-if="menuArr.find(d => d.id == 2)"
            >团建管理</el-menu-item
          >
          <el-menu-item index="/reimburse" v-if="menuArr.find(d => d.id == 3)"
            >报销管理</el-menu-item
          >
          <el-menu-item index="/staff" v-if="menuArr.find(d => d.id == 4)"
            >人员管理</el-menu-item
          >
          <el-menu-item index="/power" v-if="menuArr.find(d => d.id == 5)"
            >权限管理</el-menu-item
          >
          <!-- <el-menu-item index="/config" v-if="menuArr.find(d => d.id == 6)"
            >配置管理</el-menu-item
          > -->
          <el-menu-item
            index="/directManage/list"
            v-if="menuArr.find(d => d.id == 7)"
            >定向管理</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: "",
      menuArr: [], // 权限菜单数组
      is_show_approve: 0 // 是否显示团建审批
    };
  },
  created() {
    this.menuArr =
      JSON.parse(window.localStorage.getItem("info")).admin_info.node || [];
    this.is_show_approve =
      JSON.parse(window.localStorage.getItem("info")).is_show_approve || 0;
    this.setCurrentRoute();
  },
  watch: {
    $route() {
      this.setCurrentRoute();
    }
  },
  props: {
    fold: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    setCurrentRoute() {
      this.index = this.$route.meta.active;
    }
  }
};
</script>

<style lang="less">
.menu_wrap {
  background: #fff;
  padding-top: 30px;
  .el-aside {
    overflow-x: hidden;
  }
  .el-menu {
    border-right: 0;
  }
  .el-menu-item,
  .el-submenu__title {
    height: 48px;
    line-height: 48px;
    padding: 0 30px !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover,
  .el-submenu:hover,
  .el-submenu:active {
    background-color: #F0F6FF !important;
    color: #2d8cf0 !important;
    i,
    .el-submenu__title {
      color: #2d8cf0 !important;
    }
    .el-submenu__title:hover {
      background-color: #F0F6FF !important;
    }
  }
  .el-menu-item [class^="el-icon-"],
  .el-submenu [class^="el-icon-"] {
    margin-right: 10px;
  }
  .el-menu-item.is-active {
    border-right: 3px solid #2d8cf0;
    background-color: #F0F6FF !important;
  }
  .el-submenu .el-menu-item {
    padding-left: 68px !important;
  }
  .el-submenu.is-active .el-submenu__title,
  .el-submenu.is-active .el-submenu__title i {
    color: #2d8cf0 !important;
  }
  .el-submenu__icon-arrow {
    right: 30px !important;
  }
}
</style>
