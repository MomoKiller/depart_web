<template>
  <div class="wrap">
    <section class="out_wrap">
      <div class="search mb22 flex_between">
        <div class="daily-title fs14 bold">经费情况</div>
        <div>
          <el-date-picker
            v-model="queryControl.year"
            type="year"
            placeholder="选择年份"
            :editable="false"
            :clearable="false"
            :disabled="false"
            :picker-options="$pickOption(1)"
            @change="query(1)"
            style="margin-right:10px;"
          ></el-date-picker>
          <el-button type="primary" @click="$router.push('/league_create')">发起团建</el-button>
          <el-button plain @click="$router.push('/system')">团建制度</el-button>
        </div>
      </div>
      <div class="top-tips">根据目前疫情情况，2021年度剩余经费暂定延长至2022年5月31日</div>
      <div class="center fs16 bold">{{ info.depart }}</div>
      <ul class="money-wrap">
        <li>
          <div class="price bold">{{ info.last_money || "0.00" }}</div>
          <div class="desc">部门可用金额(元)</div>
        </li>
        <li>
          <div class="price bold">{{ info.total_money || "0.00" }}</div>
          <div class="desc">累计金额(元)</div>
        </li>
        <li>
          <div class="price bold">{{ info.use_money || "0.00" }}</div>
          <div class="desc">已用金额(元)</div>
        </li>
      </ul>
    </section>

    <section class="out_wrap" v-if="departAccounts && departAccounts.length > 0">
      <div class="search mb22 flex_between">
        <div class="daily-title fs14 bold">经费情况</div>
      </div>
      <el-table
        :data="departAccounts"
        class="w100"
        row-key="id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        tooltip-effect="dark"
      >
        <el-table-column
          fixed
          prop="name"
          label="部门名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="company_name"
          label="部门层级"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.level }}级部门</template>
        </el-table-column>
        <el-table-column
          prop="user_count"
          label="部门人数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="total_money"
          label="部门产生经费"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="last_money" label="可用经费" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.last_money | number
          }}</template>
        </el-table-column>
        <el-table-column prop="use_money" label="已用经费" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.use_money | number
          }}</template>
        </el-table-column>
        <el-table-column
          prop="avg_ava_money"
          label="人均可用经费"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.avg_ava_money | number
          }}</template>
        </el-table-column>
      </el-table>
    </section>



    <section class="out_wrap mt20">
      <div class="search mb22 flex_between" style="height:36px;">
        <div class="daily-title fs14 bold">活动明细</div>
      </div>
      <el-table
        :data="tableData"
        class="w100"
        row-key="id"
        tooltip-effect="dark"
        v-if="flag && tableData.length"
        @row-click="rowClick"
      >
        <el-table-column
          fixed
          prop="name"
          label="活动主题"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="user_name"
          label="发起人"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.user_name }}</template>
        </el-table-column>
        <el-table-column
          prop="user_count"
          label="时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.start_date + "~" + scope.row.end_date }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.status | statusFilter }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.cost_status === 3">已报销</span> -->
            <!-- <span v-else-if="scope.row.cost_status === 2">报销中</span> -->
            <el-link
              type="primary"
              :underline="false"
              v-if="scope.row.cost_status === 3"
              @click.stop="$router.push(`/reimbursementDetails?id=${scope.row.id}&type=1&isChange=1`)"
              >已报销</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              v-if="scope.row.cost_status === 2 && scope.row.status === 1"
              @click.stop="$router.push(`/reimbursementDetails?id=${scope.row.id}&type=1&isChange=1`)"
              >查看报销进度</el-link
            >
            <el-link
              type="warning"
              :underline="false"
              v-else-if="scope.row.cost_status === 1 && scope.row.status === 0"
              @click.stop="revoke(scope.row.id)"
              >撤销备案</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              v-else-if="scope.row.cost_status === 1 && scope.row.status === 1"
              @click.stop="$router.push(`/league_reimburse?id=${scope.row.id}&type=1`)"
              >去报销</el-link
            >

            <el-link
              type="danger"
              :underline="false"
              v-else-if="scope.row.cost_status === 4 && scope.row.status === 1"
              @click.stop="$router.push(`/reimbursementDetails?id=${scope.row.id}&type=1&isChange=1`)"
              >已拒绝</el-link
            >

          </template>
        </el-table-column>
      </el-table>
      <div v-if="flag && !tableData.length" class="flex_center c9">暂无数据</div>
      <el-pagination
        v-if="tableData.length > 0"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageControl.pageNumber"
        :page-size="pageControl.pageSize"
        :page-sizes="pagesizes"
        :total="pageControl.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </section>

  </div>
</template>

<script>
import { myActivity, activityList } from "@/util/api_common";
import LeagueItem from "@/components/leagueItem";
import { approveRevoke } from "@/util/api_common";
const _statusKey = [
  {
    key: 0,
    value: '待审核'
  },
  {
    key: 1,
    value: '已审核'
  },
  {
    key: 2,
    value: '已拒绝'
  },
  {
    key: 3,
    value: '已撤销'
  },
];
export default {
  components: {
    LeagueItem,
  },
  data() {
    return {
      queryControl: {
        year: new Date(),
      },
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
      },
      info: {},
      tableData: [],
      departAccounts: [],
      flag: false,
    };
  },
  filters: {
    statusFilter(status) {
      let [ resStatus ] = _statusKey.filter(a => a.key == status);
      return resStatus.value;
    }
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    getList() {
      this.query(this.pageControl.pageNumber);
    },
    query(pg) {
      this.pageControl.pageNumber = pg;
      activityList({
        page: this.pageControl.pageNumber,
        limit: this.pageControl.pageSize,
        year: new Date(this.queryControl.year).getFullYear(),
      }).then((data) => {
        if (data) {
          console.log("data", data);
          this.flag = true;
          this.tableData = data.list.data;
          this.departAccounts = data.departAccounts;
          this.info = { ...data.account, depart: data.depart };
          this.pageControl.total = data.list.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.query(val);
    },
    handleSizeChange(val) {
      this.pageControl.pageSize = val;
      this.query(1);
    },
    showDetail() {
      this.$router.push({
        path: "/myleague_detail",
        query: { year: new Date(this.queryControl.year).getFullYear() },
      });
    },
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
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    rowClick(item){
      this.$router.push(`/league_detail?id=${item.id}&type=1`)
    }
  },
};
</script>

<style lang="less" scoped>
.depart {
  margin-left: 40px;
}
.item {
  padding: 15px 30px;
  .item_main {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
}
.money {
  .label {
    color: #999;
    margin-right: 20px;
  }
  .money-top {
    line-height: 45px;
    margin-bottom: 15px;
    padding-left: 120px;
    border-bottom: 1px solid #e8e8e8;
    .num {
      font-size: 22px;
      font-weight: bold;
    }
  }
  .money-bottom {
    padding-left: 40px;
    .num {
      margin-right: 60px;
    }
  }
}

.daily-title {
  position: relative;
}
.daily-title::after{
  content: '';
  position: absolute;
  background: rgba(#2d8cf0, .6);
  width: 100%;
  height: 4px;
  bottom: 2px;
  left: 0;
}

.money-wrap {
  min-width: 830px;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 30px;
  li {
    width: 33.33%;
    height: 70px;
    text-align: center;
    .price{
      height: 30px;
      line-height: 30px;
      font-size: 26px;
      color: #4286F6;
      margin-top: 6px;
    }
    .desc {
      height: 21px;
      line-height: 21px;
      font-size: 16px;
      color: #333333;
      margin-top: 8px;
    }
    &:nth-child(2) {
      border-left: 1px solid #EDEDED;
      border-right: 1px solid #EDEDED;
    }
  }
}
.out_wrap {
  position: relative;
  .top-tips {
    position: absolute;
    top: 28px;
    left: 130px;
    color: #666;
  }
}
</style>
