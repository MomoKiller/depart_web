<template>
  <div class="w100">
    <el-cascader
      v-model="child_ids"
      clearable
      filterable
      placeholder="请选择部门/员工"
      :options="optionArr"
      :props="{
        checkStrictly: false,
        label: 'name',
        emitPath: false,
        multiple: true,
        leaf: 'last_money',
      }"
      :show-all-levels="false"
      class="w100"
      @change="userChange"
      ref="userSel"
    >
      <template slot-scope="{ node }">
        <span
          ><i class="el-icon-user" v-if="node.data.user_id"></i>
          {{ node.label }}</span
        >
      </template>
    </el-cascader>
  </div>
</template>

<script>
import { queryUser } from "@/util/api_common";

export default {
  data() {
    return {
      child_ids: this.ids,
      optionArr: [],
      money: [],
      total: 0,
    };
  },
  props: {
    ids: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    ids: {
      immediate: true,
      deep: true,
      handler(val) {
        this.child_ids = [...this.ids];
      },
    },
  },
  methods: {
    userChange(e) {
      let that = this;
      let total = 0;
      this.money = [
        ...this.$refs.userSel
          .getCheckedNodes()
          .map((d) => Number(d.data.last_money)),
      ].filter((d) => d);
      this.money.forEach((v) => {
        // total += v;
        // total = that.numAdd(total, v);
        total = parseFloat((total + v).toFixed(10));
      });
      let data = { money: total, user: e };
      this.$emit("Uchange", data);
    },
    getData() {
      queryUser().then((data) => {
        if (data) {
          this.optionArr = data;
        }
      });
    },
    // 小数精度
    numAdd(num1, num2) {
      var baseNum, baseNum1, baseNum2;
      try {
        baseNum1 = num1.toString().split(".")[1].length;
      } catch (e) {
        baseNum1 = 0;
      }
      try {
        baseNum2 = num2.toString().split(".")[1].length;
      } catch (e) {
        baseNum2 = 0;
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
      return (num1 * baseNum + num2 * baseNum) / baseNum;
    }
  },
  mounted() {
    this.getData();
  },
  updated() {
    let that = this;
    let total = 0;
    this.money = [
      ...this.$refs.userSel
        .getCheckedNodes()
        .map((d) => Number(d.data.last_money)),
    ].filter((d) => d);
    this.money.forEach((v) => {
      // total += v;
      total = that.numAdd(total, v);
    });
    let data = { money: total, user: this.child_ids };
    this.$emit("Uchange", data);
  },
};
</script>

<style lang="less" scoped></style>
