<template>
  <div class="out_wrap">
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
          @change="query(1)"
        ></el-date-picker>
        <com-company
          class="w150 inline"
          :id="queryControl.company_id"
          @Cchange="
            queryControl.company_id = $event;
            query(1);
          "
        ></com-company>
        <com-project
          class="w150 inline"
          :id="queryControl.depart_id"
          @Dchange="
            queryControl.depart_id = $event;
            query(1);
          "
        ></com-project>
        <el-input
          placeholder="姓名/工号"
          class="w150 inline"
          v-model="queryControl.keyword"
          clearable
          @change="query(1)"
        >
        </el-input>
        <el-select
          class="w150 inline"
          v-model="queryControl.user_status"
          clearable
          @change="query(1)"
          placeholder="请选择"
        >
          <el-option label="在职" :value="3"> </el-option>
          <el-option label="离职" :value="4"> </el-option>
        </el-select>
      </div>
      <div class="right">
        <el-button type="primary" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div style="padding: 15px 30px;" class="fs16 bf1 mb22">
      <span
        >人数：<span class="bold">{{ num || 0 }}人</span></span
      >
      <span class="ml20"
        >日常团建经费：<span class="bold">{{ money || "0.00" }}元</span></span
      >
    </div>
    <el-table :data="tableData" class="w100" tooltip-effect="dark">
      <el-table-column
        fixed
        prop="name"
        label="姓名"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="company_name"
        label="公司"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="depart_name"
        label="部门"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.user_status == 3">
            <span class="ableBadge"></span>在职
          </div>
          <div v-if="scope.row.user_status == 4">
            <span class="disBadge"></span>离职
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="entry_time"
        label="入职日期"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="leave_date"
        label="离职日期"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{
          scope.row.leave_date || "-"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="last_money"
        label="日常团建经费"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.last_money }}</template>
      </el-table-column>
      <el-table-column label="操作" width="70">
        <template slot-scope="scope">
          <a class="active_color" @click="handleViewDetails(scope.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData.length > 0"
      background
      layout="total, prev, pager, next, jumper"
      :current-page="pageControl.pageNumber"
      :page-size="pageControl.pageSize"
      :page-sizes="pagesizes"
      :total="pageControl.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <el-dialog
      :title="`${details.name} 团建费用发放及使用记录`"
      width="800px"
      :visible.sync="visible"
    >
      <el-table
        :data="tableDetailsData"
        row-key="id"
        border
      >
        <el-table-column
          prop="reason"
          label="费用发放/使用记录"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="金额（元）"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="day"
          label="时间"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        v-if="tableDetailsData.length > 0"
        background
        layout="total, prev, pager, next"
        :current-page="pageDetailControl.pageNumber"
        :page-size="pageDetailControl.pageSize"
        :total="pageDetailControl.total"
        @current-change="handleDetailCurrentChange"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import ComCompany from "@/components/company";
import ComProject from "@/components/depart";
import { exportData } from "@/util/fn";
export default {
  data() {
    return {
      queryControl: {
        year: new Date(),
        company_id: "",
        depart_id: "",
        keyword: "",
        user_status: ""
      },
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      num: 0,
      money: 0,
      tableData: [],
      visible: false,
      tableDetailsData: [],
      pageDetailControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      details: [], // 点击表格行信息
    };
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    query(pg) {
      this.pageControl.pageNumber = pg;
      this.$http
        .get("/adminapi/cost/cost_list", {
          page: pg,
          limit: this.pageControl.pageSize,
          company_id: this.queryControl.company_id,
          depart_id: this.queryControl.depart_id,
          year: new Date(this.queryControl.year).getFullYear(),
          keyword: this.queryControl.keyword,
          user_status: this.queryControl.user_status
        })
        .then(data => {
          if (data) {
            this.tableData = data.list.data;
            this.pageControl.total = data.list.total;
            this.num = data.total_num;
            this.money = data.total_money;
          }
        });
    },
    handleCurrentChange(val) {
      this.query(val);
    },
    handleSizeChange(val) {
      this.queryControl.pageSize = val;
      this.query(1);
    },
    exportFile() {
      let queryData = {
        company_id: this.queryControl.company_id,
        depart_id: this.queryControl.depart_id,
        year: new Date(this.queryControl.year).getFullYear(),
        keyword: this.queryControl.keyword
      };
      exportData(
        "/adminapi/cost/export_cost_list",
        queryData,
        "费用管理数据.xls"
      );
    },
    // 操作 查看详情
    handleViewDetails(row) {
      this.details = row;
      this.tableDetailsData = [];
      this.getCostDetailList();
    },
    getCostDetailList() {
      this.$http
        .get("/adminapi/cost/cost_detail_list", {
          page: this.pageDetailControl.pageNumber,
          limit: this.pageDetailControl.pageSize,
          year: new Date(this.queryControl.year).getFullYear(),
          user_id: this.details.user_id,
        })
        .then(data => {
          if (data) {
            this.tableDetailsData = data.list.data;
            this.pageDetailControl.total = data.list.total;
            this.visible = true;
          }
        });
    },
    handleDetailCurrentChange(val) {
      this.pageDetailControl.pageNumber = val;
      this.getCostDetailList();
    },
  },
  components: {
    ComCompany,
    ComProject
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
}
/deep/ .el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
</style>
