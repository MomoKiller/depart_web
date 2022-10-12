<template>
  <div class="out_wrap">
    <div class="flex_between search mb22">
      <div class="left">
        <!-- <el-date-picker
          v-model="queryControl.month"
          type="month"
          placeholder="选择月份"
          :editable="false"
          :clearable="false"
          :disabled="false"
          :picker-options="$pickOption(1)"
          @change="query(1)"
        ></el-date-picker> -->
        <el-date-picker
          v-model="queryControl.year"
          type="year"
          placeholder="选择年份"
          :editable="false"
          clearable
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
          v-model="queryControl.status"
          placeholder="请选择团建状态"
          class="w150"
          clearable
          filterable
          @change="query(1)"
        >
          <el-option label="待审核" value="0"></el-option>
          <el-option label="已同意" value="1"></el-option>
          <el-option label="已拒绝" value="2"></el-option>
          <el-option label="已撤销" value="3"></el-option>
        </el-select>

        <el-input 
          v-model="queryControl.keywords" 
          class="w150 inline"
          placeholder="关键字搜索" 
          title="关键字搜索"
          @input="query(1)" 
        ></el-input>
      </div>
      <div class="right">
        <el-button type="primary" @click="exportFile">导出</el-button>
      </div>
    </div>
    <div style="padding: 15px 30px;" class="fs16 bf1 mb22">
      <span
        >团建次数：<span class="bold">{{ num || 0 }}次</span></span
      >
      <span class="ml20"
        >涉及人数：<span class="bold">{{ user || 0 }}人</span></span
      >
    </div>
    <el-table :data="tableData" class="w100" tooltip-effect="dark">
      <el-table-column
        prop="name"
        label="团建活动"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="user_name"
        label="申请人"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="depart_name"
        label="申请部门"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="user_num"
        label="参与人数"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="activity_type"
        label="团建形式"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="other"
        label="申请时间"
        width="170"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="scope">{{ scope.row.other || "-" }}</template> -->
        <template slot-scope="scope">{{ scope.row.create_time | formateDate }}</template>
      </el-table-column>
      <el-table-column
        prop="act_date"
        label="团建时间"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.start_date + "至" + scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 0">
            <span class="waitBadge"></span>待审核
          </div>
          <div v-if="scope.row.status == 1">
            <span class="ableBadge"></span>已同意
          </div>
          <div v-if="scope.row.status == 2">
            <span class="disBadge"></span>已拒绝
          </div>
          <div v-if="scope.row.status == 3">
            <span class="disBadge"></span>已撤销
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <a class="active_color" @click="dumpDetail(scope.row)">详情</a>
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
        // month: new Date(),
        company_id: "",
        depart_id: "",
        status: "",
        year: '',
        keywords: ''
      },
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      num: 0,
      user: 0
    };
  },

  filters: {
    formateDate(inputTime) {
      var date = new Date(inputTime * 1000);
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? ('0' + m) : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;  
      second = second < 10 ? ('0' + second) : second; 
      return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
    }
  },

  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    query(pg) {
      this.pageControl.pageNumber = pg;
      this.$http
        .get("/adminapi/activity/activity_list", {
          // month: this.$dayFormat(this.queryControl.month, 3),
          year: this.queryControl.year ? new Date(this.queryControl.year).getFullYear() : '',
          company_id: this.queryControl.company_id,
          depart_id: this.queryControl.depart_id,
          status:
            this.queryControl.status === "" ? -1 : this.queryControl.status,
          page: pg,
          limit: this.pageControl.pageSize,
          keywords: this.queryControl.keywords,
        })
        .then(data => {
          if (data) {
            this.tableData = data.list.data;
            this.pageControl.total = data.list.total;
            this.num = data.total_num;
            this.user = data.total_user;
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
          "/adminapi/activity/export_activity_list",
          {
            // month: this.$dayFormat(this.queryControl.month, 3),
            year: this.queryControl.year ? new Date(this.queryControl.year).getFullYear() : '',
            company_id: this.queryControl.company_id,
            depart_id: this.queryControl.depart_id,
            status:
              this.queryControl.status === "" ? -1 : this.queryControl.status,
            keywords: this.queryControl.keywords,
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
            link.download = `团建列表.xls`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }
        });
    },
    dumpDetail(item) {
      const { id, act_type } = item;
      this.$router.push({ path: "/league_detail", query: { id, type: act_type } });
    }
  },
  components: {
    ComCompany,
    ComProject
  }
};
</script>

<style lang="less" scoped></style>
