<template>
  <div class="out_wrap">
    <div class="center mb35 hidden">
      <el-button class="fl" @click="$router.go(-1)" size="mini" round
        ><i class="el-icon-arrow-left"></i>返回</el-button
      >
    </div>
    <div class="mb35 flex_middle">
      <span class="fs18 bold">团建详情</span>
    </div>
    
    <div class="mb22 flex_middle">
      <div class="mr15 wd100">团建主题：</div>
      <div class="flex1 ellipsis" :title="detail.name">{{ detail.name }}</div>
    </div>
    <div class="mb22 flex_middle">
      <div class="mr15 wd100">团建形式：</div>
      <div class="flex1 ellipsis">
        {{ detail.type }}<span v-if="detail.other">{{ " - " + detail.other }}</span>
      </div>
    </div>
    <div class="mb22 flex">
      <div class="mr15 wd100">团建人员：</div>
      <div class="flex1">
        <div v-for="(item, index) in detail.departs" :key="index" :class="{'mb15': (index+1) != detail.departs.length}">
          {{ item.name }}<span>（共{{ item.users.length || 0 }}人）:</span>
          <el-tag v-for="(item1, index1) in item.users" :key="index1" size="small" effect="plain">{{item1.name}}</el-tag>
        </div>
      </div>
    </div>
    <div
      class="mb22 flex"
      v-if="detail.security_ids && detail.security_ids.length > 0"
    >
      <div class="mr15 flex_middle">安全员：</div>
      <div class="flex1">
        <span>（共{{ detail.security_name.split(",").length || 0 }}人）</span>
        <el-tag
          v-for="(user, index) in detail.security_name
            ? detail.security_name.split(',')
            : []"
          :key="index"
          >{{ user }}</el-tag
        >
      </div>
    </div>
    <div class="mb22 flex_middle">
      <div class="mr15 wd100">团建地点：</div>
      <div class="flex1">
        {{ detail.location }}
      </div>
    </div>
    <div class="mb22 flex_middle">
      <div class="mr15 wd100">团建时间：</div>
      <div class="flex1">
        {{ detail.start_date + "~" + detail.end_date }}
      </div>
    </div>
    <div class="mb22 flex">
      <div class="mr15 wd100">团建描述：</div>
      <div class="flex1" style="line-height: 180%">{{ detail.desc }}</div>
    </div>
    <!-- <div class="mb22 flex">
      <div class="mr15">团建图集：</div>
      <div class="flex1">
        <el-image
          v-for="(pic, index) in detail.atts || []"
          :key="index"
          style="width: 100px; height: 100px; margin: 0 5px 5px"
          :src="pic.file_path"
          fit="cover"
          :preview-src-list="[pic.file_path]"
        ></el-image>
      </div>
    </div> -->
    <!-- <div class="mb55 flex" v-if="type == 1"> -->
    <div class="mb55 flex_middle">
      <div class="mr15 wd100">预估花费金额：</div>
      <div class="flex1" style="line-height: 180%">
        {{ detail.pay_in_advance | number }}元
      </div>
    </div>
    <el-divider></el-divider>

    <div class="mb22 mt30 flex_between">
      <span class="left">{{ detail.user_name }} 于 {{
          $dateFormat(detail.create_time * 1000, 1)
        }} 发起</span>
    </div>

    <div
      class="mb22 flex"
      v-for="(approval, index) in detail.approve_list || []"
      :key="index"
    >
      <div>{{ approval.name }}</div>
      <div class="ml20">
        {{ $dateFormat(approval.approval_time * 1000, 1) }}
      </div>
      <div class="wait ml20" v-if="approval.approval_opinions == 0">待审批</div>
      <div class="active_color ml20" v-if="approval.approval_opinions == 1">
        已通过
      </div>
      <div class="dis ml20" v-if="approval.approval_opinions == 2">已拒绝</div>
      <div class="flex1 ml20" style="line-height: 180%">
        {{ approval.approval_reason }}
      </div>
    </div>
    <div class="mb15">
      <a
        class="right able"
        v-if="detail.cost_status == 1 && detail.status == 1"
        @click="goBs"
        >未报销</a
      >
      <a class="right wait" v-if="detail.cost_status == 2">报销中</a>
      <a class="right return" v-if="detail.cost_status == 3">已报销</a>
    </div>

  </div>
</template>

<script>
import { activityDetail, directDetail } from "@/util/api_common";

export default {
  data() {
    return {
      detail: {},
      type: "",
    };
  },
  created() {
    this.type = this.$route.query.type;
    // console.log(this.type);
    this.queryDetail();
  },
  methods: {
    queryDetail() {
      if (this.$route.query.type == 1) {
        activityDetail(this.$route.query.id).then((data) => {
          if (data) {
            this.detail = data;
          }
        });
      } else {
        directDetail(this.$route.query.id).then((data) => {
          if (data) {
            this.detail = data;
          }
        });
      }
    },
    goBs() {
      this.$router.push({
        path: "/league_reimburse",
        query: { id: this.detail.id, type: this.$route.query.type },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wd100 {
  width: 100px;
  text-align: right;
}
</style>
