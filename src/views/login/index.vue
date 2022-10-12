<template>
  <div class="login wh100 hidden pr flex_center">
    <i class="el-icon-loading" style="font-size: 40px;"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.login();
  },
  methods: {
    login() {
      this.$http.get("/api/ddlogin", this.$route.query).then(data => {
        if (data) {
          const path = this.$route.query.url || "daily";
          window.localStorage.setItem("info", JSON.stringify(data));
          this.$router.replace(`/${path}`);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
