<template>
  <div class="out_wrap direct-manage">
    <div class="flex_between search mb22">
      <div class="left">
        <el-date-picker
          v-model="queryControl.year"
          type="year"
          placeholder="选择年份"
          :editable="false"
          :clearable="false"
          :disabled="false"
          :picker-options="$pickOption(1)"
          @change="changeSelect"
        ></el-date-picker>

        <el-select
          v-model="queryControl.activity_status"
          placeholder="审批状态"
          class="w150"
          clearable
          filterable
          @change="changeSelect"
        >
          <el-option
            v-for="v in approvalList"
            :key="v.id"
            :label="v.title"
            :value="v.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="queryControl.apply_status"
          placeholder="报销状态"
          class="w150"
          clearable
          filterable
          @change="changeSelect"
        >
          <el-option
            v-for="v in applyList"
            :key="v.id"
            :label="v.title"
            :value="v.id"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <el-button
          type="primary"
          @click="$router.push('/directManage/limitQuery')"
          >额度查询</el-button
        >
        <el-button type="primary" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div class="info">
      <span>团建次数</span>
      <span class="bold">{{ total }}</span>
      <span> 涉及人次</span>
      <span class="bold">{{ total_user }}</span>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="定向团建">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="$router.push(`/league_detail?id=${scope.row.id}&type=2`)"
            >{{ scope.row.name }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="申请人"> </el-table-column>
      <el-table-column prop="user_num" label="参与人数"> </el-table-column>
      <el-table-column prop="activity_type" label="团建形式"> </el-table-column>
      <el-table-column prop="address" label="团建日期">
        <template slot-scope="scope">
          {{ scope.row.start_date }}至{{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发起时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="审批状态">
        <template slot-scope="scope">
          {{
            approvalList[scope.row.status]
              ? approvalList[scope.row.status].title
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="报销状态">
        <template slot-scope="scope">
          {{ applyList.find(v => v.id == scope.row.cost_status).title || "" }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData.length > 0"
      background
      layout="total, prev, pager, next, jumper"
      :current-page="queryControl.page"
      :page-size="queryControl.limit"
      :page-sizes="pagesizes"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>
<script>
import { directList } from "@/util/api_common";
import { BASE_URL } from "@/util";
import { exportData } from "@/util/fn";
export default {
  data() {
    return {
      queryControl: {
        year: new Date(),
        activity_status: "",
        apply_status: "",
        page: 1,
        limit: 10
      },

      total: 0,
      total_user: 0,
      tableData: [],
      approvalList: [
        { id: 1, title: "待审核" },
        { id: 2, title: "已同意 " },
        { id: 3, title: "已拒绝" },
        { id: 4, title: "已撤销" }
      ],
      applyList: [
        { id: 1, title: "未报销" },
        { id: 2, title: "报销中 " },
        { id: 3, title: "已报销" }
      ]
    };
  },
  created() {
    this.getList();
  },
  filters: {
    filterTime: time => {
      let date = new Date(time * 1000);
      let y = date.getFullYear();
      let m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate();
      let str = y + "-" + m + "-" + d;
      return str;
    }
  },
  methods: {
    // 获取列表
    async getList() {
      const data = await this.$http.get("/direction/direction_list", {
        ...this.queryControl,
        year: this.queryControl.year.getFullYear()
      });
      this.tableData = data.list ? data.list.data : [];
      this.info = data.list ? { depart: data.info } : {};
      this.total = data.list ? data.list.total : 0;
      this.total_user = data.list ? data.total_user : 0;
    },
    handleCurrentChange(val) {
      this.queryControl.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryControl.page = 1;
      this.queryControl.limit = val;
      this.getList();
    },
    changeSelect() {
      this.queryControl.page = 1;
      this.getList();
    },
    exportFile() {
      let queryData = {
        year: this.queryControl.year.getFullYear(),
        activity_status: this.queryControl.activity_status,
        apply_status: this.queryControl.apply_status
      };
      exportData("/direction/export_reimburse_list", queryData, "定向列表.xls");
    }
  }
};
</script>
<style scoped lang="less">
.direct-manage {
  .info {
    height: 50px;
    line-height: 50px;
    background-color: #f1f1f1;
    margin-bottom: 20px;
    span {
      margin: 0 40px;
    }
  }
}
</style>
