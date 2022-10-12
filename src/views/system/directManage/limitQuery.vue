<template>
  <div class="out_wrap direct-manage">
    <div class="flex_between">
      <div class="search mb22">
        <el-date-picker
          v-model="queryControl.year"
          type="year"
          placeholder="选择年份"
          :editable="false"
          :clearable="false"
          :disabled="false"
          :picker-options="$pickOption(1)"
          @change="changeTime"
        ></el-date-picker>
        <com-project
          class="w150 inline"
          :id="queryControl.depart_id"
          @Dchange="
            queryControl.depart_id = $event;
            getList();
          "
        ></com-project>
        <el-select
          v-model="queryControl.is_direction"
          placeholder="参与资格"
          class="w150"
          clearable
          filterable
          @change="getList()"
        >
          <el-option label="无" :value="0"></el-option>
          <el-option label="有" :value="1"></el-option>
        </el-select>
        <el-select
          v-model="queryControl.is_user"
          placeholder="使用额度"
          class="w150"
          clearable
          filterable
          @change="getList()"
        >
          <el-option label="未用" :value="0"></el-option>
          <el-option label="已用" :value="1"></el-option>
        </el-select>
        <el-select
          v-model="queryControl.user_status"
          placeholder="在职情况"
          class="w150"
          clearable
          filterable
          @change="getList()"
        >
          <el-option label="在职" :value="3"></el-option>
          <el-option label="离职" :value="4"></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="exportFile">导出</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="au_name" label="姓名"> </el-table-column>
      <el-table-column prop="user_status" label="状态"> </el-table-column>
      <el-table-column prop="entry_time" label="入职日期"> </el-table-column>
      <el-table-column prop="leave_date" label="离职日期">
        <template slot-scope="scope">
          {{ scope.row.leave_date || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="is_direction" label="参与资格"> </el-table-column>
      <el-table-column prop="is_use" label="使用额度"> </el-table-column>
    </el-table>
    <el-pagination
      v-if="tableData.length > 0"
      background
      layout="total, sizes, prev, pager, next, jumper"
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
import ComProject from "@/components/depart";
import { exportData } from "@/util/fn";
export default {
  components: {
    ComProject,
  },
  data() {
    return {
      queryControl: {
        year: new Date(),
        depart_id: "",
        is_user: "",
        is_direction: "",
        user_status: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await this.$http.get("/direction/quota_inquiry_list", {
        ...this.queryControl,
        year: this.queryControl.year.getFullYear(),
      });
      console.log("res", res);
      this.tableData = res.data;
      this.total = res.total;
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
    changeTime() {
      this.queryControl.page = 1;
      this.getList();
    },
    exportFile() {
      let queryData = {
        year: this.queryControl.year.getFullYear(),
        depart_id: this.queryControl.depart_id,
        is_user: this.queryControl.is_user,
        is_direction: this.queryControl.is_direction,
      };
      exportData(
        "/direction/export_quota_inquiry_list",
        queryData,
        "额度数据.xls"
      );
    },
  },
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
