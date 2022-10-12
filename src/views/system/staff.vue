<template>
  <div class="out_wrap">
    <div class="flex mb22">
      <com-company
        class="w150 inline mr15"
        :id="queryControl.company_id"
        @Cchange="
          queryControl.company_id = $event;
          query(1);
        "
      ></com-company>
      <com-project
        class="w150 inline mr15"
        :id="queryControl.depart_id"
        @Dchange="
          queryControl.depart_id = $event;
          query(1);
        "
      ></com-project>
      <el-input
        placeholder="姓名/工号"
        class="w150 inline mr15"
        v-model="queryControl.keyword"
        clearable
        @change="query(1)"
      >
      </el-input>
      <el-select
        class="w150 inline"
        v-model="queryControl.user_status"
        clearable
        placeholder="在职状态"
        @change="query(1)"
      >
        <el-option label="在职" :value="3"> </el-option>
        <el-option label="离职" :value="4"> </el-option>
      </el-select>
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
      <el-table-column
        prop="position_name"
        label="职位"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="report_name"
        label="汇报对象"
        width="100"
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
  </div>
</template>

<script>
import ComCompany from "@/components/company";
import ComProject from "@/components/depart";
import { queryStaff } from "@/util/api_common";

export default {
  data() {
    return {
      queryControl: {
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
      tableData: []
    };
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    query(pg) {
      this.pageControl.pageNumber = pg;
      queryStaff({
        page: pg,
        limit: this.pageControl.pageSize,
        ...this.queryControl
      }).then(data => {
        if (data) {
          this.tableData = data.data;
          this.pageControl.total = data.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.query(val);
    },
    handleSizeChange(val) {
      this.pageControl.pageSize = val;
      this.query(1);
    }
  },
  components: {
    ComCompany,
    ComProject
  }
};
</script>

<style lang="less" scoped></style>
