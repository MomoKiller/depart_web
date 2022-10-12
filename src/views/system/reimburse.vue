<template>
  <div class="out_wrap">
    <div class="flex_between search mb22">
      <div class="left">
        <el-date-picker
          v-model="queryControl.month"
          type="month"
          placeholder="选择月份"
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
        <el-select
          v-model="queryControl.process_state"
          placeholder="请选择报销状态"
          class="w150"
          clearable
          filterable
          @change="query(1)"
        >
          <el-option label="已完成" value="1"></el-option>
          <el-option label="已撤销" value="2"></el-option>
          <el-option label="待审批" value="3"></el-option>
          <el-option label="已拒绝" value="4"></el-option>
        </el-select>
      </div>
      <div class="right">
        <el-button type="primary" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div style="padding: 15px 30px;" class="fs16 bf1 mb22">
      <span
        >报销次数：<span class="bold">{{ num || 0 }}次</span></span
      >
      <span class="ml20"
        >费用合计：<span class="bold">{{ money || "0.00" }}元</span></span
      >
    </div>
    <el-table :data="tableData" class="w100" tooltip-effect="dark">
      <el-table-column
        prop="act_name"
        label="团建活动"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="company_name"
        label="公司"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="name"
        label="申请人"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="payee_name"
        label="收款人"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="total_money"
        label="团建费用"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope"
          >{{ scope.row.total_money || "0.00" }}元</template
        >
      </el-table-column>
      <el-table-column label="申请时间" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{
          $dateFormat(scope.row.create_time * 1000, 1)
        }}</template>
      </el-table-column>
      <el-table-column label="报销状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.process_state == 1">
            <span class="ableBadge"></span>已完成
          </div>
          <div v-if="scope.row.process_state == 2">
            <span class="returnBadge"></span>已撤销
          </div>
          <div v-if="scope.row.process_state == 3">
            <span class="waitBadge"></span>待审批
          </div>
          <div v-if="scope.row.process_state == 4">
            <span class="disBadge"></span>已拒绝
          </div>
        </template>
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
  </div>
</template>

<script>
import ComCompany from "@/components/company";
import ComProject from "@/components/depart";

export default {
  data() {
    return {
      queryControl: {
        month: new Date(),
        company_id: "",
        depart_id: "",
        process_state: ""
      },
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      num: 0,
      money: 0
    };
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    query(pg) {
      this.pageControl.pageNumber = pg;
      this.$http
        .get("/adminapi/reimburse/reimburse_list", {
          month: this.$dayFormat(this.queryControl.month, 3),
          company_id: this.queryControl.company_id,
          depart_id: this.queryControl.depart_id,
          process_state: this.queryControl.process_state,
          page: pg,
          limit: this.pageControl.pageSize
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
      this.$http
        .get(
          "/adminapi/reimburse/export_reimburse_list",
          {
            month: this.$dayFormat(this.queryControl.month, 3),
            company_id: this.queryControl.company_id,
            depart_id: this.queryControl.depart_id,
            process_state: this.queryControl.process_state
          },
          null,
          { responseType: "blob" }
        )
        .then(res => {
          if (res) {
            const url = window.URL.createObjectURL(new Blob([res]), {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            const link = document.createElement("a");
            link.href = url;
            link.download = `报销列表.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        });
    },
    // 操作 查看详情
    handleViewDetails(row) {
      this.$router.push(
        `/reimbursementSituation?id=${row.id}&type=1`
      )
    },
  },
  components: {
    ComCompany,
    ComProject
  }
};
</script>

<style lang="less" scoped></style>
