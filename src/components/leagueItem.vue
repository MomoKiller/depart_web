<template>
  <div
    class="league-item bf1"
    @click="$router.push(`/league_detail?id=${item.id}&type=${type}`)"
  >
    <el-row :gutter="20" class="item-top">
      <el-col :span="5">
        <!-- <span class="ellipsis" :title="item.name">{{ item.name }}</span> -->
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <span class="ellipsis">{{ item.name }}</span>
        </el-tooltip>
      </el-col>
      <el-col :span="5">
        <el-tag type="success" v-if="item.activity_type != '活动'">{{
          item.activity_type
        }}</el-tag>
        <el-tag type="success" v-if="item.activity_type == '活动'"
          >活动 ({{ item.other }})</el-tag
        >
      </el-col>
      <el-col :span="5" v-if="item.is_activity === 1">
        <span v-if="item.status === 0">待审核</span>
        <span v-else-if="item.status === 1">已审核</span>
        <span v-else-if="item.status === 2">已拒绝</span>
        <span v-else>已撤销</span>
      </el-col>
      <el-col :span="5" v-if="item.is_activity === 1">
        <span v-if="item.cost_status === 3">已报销</span>
        <span v-else-if="item.cost_status === 2">报销中</span>
        <el-link
          type="warning"
          :underline="false"
          v-else-if="item.cost_status === 1 && item.status === 0"
          @click.stop="revoke(item.id)"
          >撤销</el-link
        >
        <el-link
          type="primary"
          :underline="false"
          v-else-if="item.cost_status === 1 && item.status === 1"
          @click.stop="
            $router.push(`/league_reimburse?id=${item.id}&type=${type}`)
          "
          >去报销</el-link
        >
      </el-col>
      <el-col :span="4" v-if="item.is_activity === 1 && item.ava_money">
        <el-link
          type="primary"
          :underline="false"
          v-if="item.cost_status === 2 && item.status === 1"
          @click.stop="
            $router.push(
              `/reimbursementDetails?id=${item.id}&type=${type}&isChange=1`
            )
          "
          >查看报销进度</el-link
        >
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-bottom">
      <el-col :span="6">
        <span style="margin-right: 50px">{{ item.user_name }}发起</span>
        <span>{{ item.user_num || 0 }}人参与</span>
      </el-col>
      <!-- <el-col :span="6" v-if="item.ava_money">
        <span>可用团建费用：{{ item.ava_money | number }}元</span>
      </el-col> -->
      <el-col :span="6" v-if="item.pay_in_advance">
        <span>预估团建费用：{{ item.pay_in_advance | number }}元</span>
      </el-col>
      <el-col :span="6">
        <span>{{ item.start_date + "~" + item.end_date }}</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { approveRevoke } from "@/util/api_common";
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    revoke(id) {
      this.$confirm("确定撤销此次团建吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          approveRevoke({ act_id: id }).then((res) => {
            if (res) {
              this.$message.success("撤销成功");
              this.$emit("getList");
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="less">
.league-item {
  padding: 0 40px;
  margin-bottom: 20px;
  cursor: pointer;
  .item-top {
    // height: 60px;
    // line-height: 60px;
    padding-top: 15px;
    border-bottom: 1px solid #e8e8e8;
  }
  .item-bottom {
    // height: 50px;
    // line-height: 50px;
    padding: 15px 0;
  }
}

.ellipsis {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box; */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
