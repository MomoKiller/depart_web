<template>
<div class="wrap">
  <div class="out_wrap">
    <!-- <section class="radio-wrap">
      <el-radio-group v-model="activeTab" @change="handleChange">
        <el-radio-button label="pending">待审批</el-radio-button>
        <el-radio-button label="finish">已审批</el-radio-button>
      </el-radio-group>
    </section> -->
    <section>
      <el-select v-model="activeTab" placeholder="请选择" @change="handleChange" title="审批状态">
        <el-option label="待审批" value="pending">待审批</el-option>
        <el-option label="已审批" value="finish">已审批</el-option>
      </el-select>
      <el-input v-model="keyword" placeholder="搜索团建主题、发起人、团建地点" 
      @change="handleChange" title="搜索团建主题、发起人、团建地点" style="width: 250px;margin-left: 10px;"></el-input>
    </section>
  </div>

  <div class="out_wrap mt20">
    <el-table
      :data="tableData"
      class="w100"
      row-key="id"
      lazy
      tooltip-effect="dark"
    >
      <el-table-column
        prop="name"
        label="团建主题"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="company_name"
        label="团建形式"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.activity_type != '活动'">
            {{ scope.row.activity_type }}
          </span>
          <el-tooltip
            effect="dark"
            :content="scope.row.other"
            placement="top"
          >
            <span v-if="scope.row.activity_type == '活动'">活动</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="发起人"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="create_time"
        label="发起时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{$dateFormat(scope.row.create_time * 1000, 1)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date"
        label="团建时间"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.start_date + "~" + scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="团建地点"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="pay_in_advance"
        label="预估团建费"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="user_num"
        label="团建人员"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="approval_status"
        label="审批状态"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="">
          {{ activeTab == 'pending' ? '待审批' : '已审批' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="60">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="handleApproval(scope.row)"
            >
            {{ activeTab == 'pending' ? '审批' : '查看' }}
            </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="团建详情"
      width="70%"
      :visible.sync="detailsVisible"
    >
      <el-card
        class="box-card"
        v-for="(item, index) in detailsData"
        :key="index"
        style="margin-bottom: 20px"
        shadow="never"
      >
        <el-row class="lh30 mb5">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">团建主题：</span>{{ item.name }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">团建形式：</span>
              <span v-if="item.activity_type != '活动'">
                {{ item.activity_type }}
              </span>
              <el-tooltip
                effect="dark"
                :content="item.other"
                placement="top"
              >
                <span v-if="item.activity_type == '活动'">活动</span>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">发起人：</span>{{ item.user_name }}
              <span style="margin-left:5px;">({{$dateFormat(item.create_time * 1000, 1)}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh30 mb5">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">团建时间：</span>{{ item.start_date + "~" + item.end_date }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">团建地点：</span>{{ item.location }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">团建描述：</span>{{ item.desc }}
            </div>
          </el-col>
        </el-row>
        <el-row class="lh30 mb5">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <span class="grid-label">预估团建费：</span>{{ item.pay_in_advance }} 元
            </div>
          </el-col>
        </el-row>

        <el-row class="lh30 mb5">
          <el-col :span="24" class="flex">
            <span class="grid-label">团建人员：</span>
            <el-collapse v-model="activeNames" class="left90">
              <el-collapse-item :title="`共${item.user_num}人`" name="1">
                <div class="flex1">
                  <div
                    v-for="(itemDepart, index1) in item.departs || []"
                    :key="index1"
                    class="mb15"
                  >
                    {{ itemDepart.name }}：
                    <el-tag
                      v-for="(itemUser, index2) in itemDepart.users || []"
                      :key="index2"
                      size="small" 
                      effect="plain"
                      >{{ itemUser.name }}</el-tag
                    >
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <!-- 审批人 -->
        <section class="between">
          <div>
            <div
              class="mb15 flex"
              v-for="(approval, index) in item.approve_list || []"
              :key="index"
            >
              <div>{{ approval.name }}</div>
              <div class="ml20" :class="statusClass(approval.approval_opinions)">{{ approval.approval_opinions | statusFilter }}</div>
              <div class="ml20 c9">
                {{ $dateFormat(approval.approval_time * 1000, 1) }}
              </div>
              <div class="flex1 ml20" style="line-height: 180%">
                {{ approval.approval_reason }}
              </div>
            </div>
          </div>
          <div class="grid-content bg-purple flex_middle" v-if="activeTab == 'pending'">
            <el-button type="primary" @click.stop="pass(item)">通过</el-button>
            <el-button plain @click.stop="refuse(item)">驳回</el-button>
          </div>
        </section>
      </el-card>
    </el-dialog>

    <el-dialog
      :title="mode == 1 ? '审批通过' : '审批驳回'"
      :visible.sync="visible"
    >
      <el-input
        type="textarea"
        v-model="reason"
        placeholder="请输入内容"
        :rows="5"
        resize="none"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

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
  </div>

    <section v-if="activeTab == 'pending' && false">
      <div v-if="flag && tableData.length">
        <el-card
          class="box-card"
          v-for="(item, index) in tableData"
          :key="index"
          style="margin-bottom: 20px"
          shadow="never"
        >
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建主题：</span>{{ item.name }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建形式：</span>
                <span v-if="item.activity_type != '活动'">
                  {{ item.activity_type }}
                </span>
                <el-tooltip
                  effect="dark"
                  :content="item.other"
                  placement="top"
                >
                  <span v-if="item.activity_type == '活动'">活动</span>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">发起人：</span>{{ item.user_name }}
                <span style="margin-left:5px;">({{$dateFormat(item.create_time * 1000, 1)}})</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建时间：</span>{{ item.start_date + "~" + item.end_date }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建地点：</span>{{ item.location }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建描述：</span>{{ item.desc }}
              </div>
            </el-col>
          </el-row>
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">预估团建费：</span>{{ item.pay_in_advance }} 元
              </div>
            </el-col>
          </el-row>

          <el-row class="lh30 mb5">
            <el-col :span="24" class="flex">
              <span class="grid-label">团建人员：</span>
              <el-collapse v-model="activeNames" class="left90">
                <el-collapse-item :title="`共${item.user_num}人`" name="1">
                  <div class="flex1">
                    <div
                      v-for="(itemDepart, index1) in item.departs || []"
                      :key="index1"
                      class="mb15"
                    >
                      {{ itemDepart.name }}：
                      <el-tag
                        v-for="(itemUser, index2) in itemDepart.users || []"
                        :key="index2"
                        size="small" 
                        effect="plain"
                        >{{ itemUser.name }}</el-tag
                      >
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>

          <el-divider></el-divider>
          <!-- 审批人 -->
          <section class="between">
            <div>
              <div
                class="mb15 flex"
                v-for="(approval, index) in item.approve_list || []"
                :key="index"
              >
                <div>{{ approval.name }}</div>
                <div class="ml20" :class="statusClass(approval.approval_opinions)">{{ approval.approval_opinions | statusFilter }}</div>
                <div class="ml20 c9">
                  {{ $dateFormat(approval.approval_time * 1000, 1) }}
                </div>
                <div class="flex1 ml20" style="line-height: 180%">
                  {{ approval.approval_reason }}
                </div>
              </div>
            </div>
            <div class="grid-content bg-purple flex_middle">
              <el-button type="primary" @click.stop="pass(item)">通过</el-button>
              <el-button plain @click.stop="refuse(item)">驳回</el-button>
            </div>
          </section>
        </el-card>
      </div>

      <div class="flex_center c9" v-if="flag && !tableData.length">
        暂无数据
      </div>
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
      <el-dialog
        :title="mode == 1 ? '审批通过' : '审批驳回'"
        :visible.sync="visible"
      >
        <el-input
          type="textarea"
          v-model="reason"
          placeholder="请输入内容"
          :rows="5"
          resize="none"
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </el-dialog>
    </section>


    <section v-if="activeTab == 'finish' && false">
      <div v-if="flag && tableData.length">
        <el-card
          class="box-card"
          v-for="(item, index) in tableData"
          :key="index"
          style="margin-bottom: 20px"
          shadow="never"
        >
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建主题：</span>{{ item.name }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建形式：</span>
                <span v-if="item.activity_type != '活动'">
                  {{ item.activity_type }}
                </span>
                <el-tooltip
                  effect="dark"
                  :content="item.other"
                  placement="top"
                >
                  <span v-if="item.activity_type == '活动'">活动</span>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">发起人：</span>{{ item.user_name }} 
                <span style="margin-left:5px;">({{$dateFormat(item.create_time * 1000, 1)}})</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建时间：</span>{{ item.start_date + "~" + item.end_date }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建地点：</span>{{ item.location }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">团建描述：</span>{{ item.desc }}
              </div>
            </el-col>
          </el-row>
          <el-row class="lh30 mb5">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <span class="grid-label">预估团建费：</span>{{ item.pay_in_advance }} 元
              </div>
            </el-col>
          </el-row>
          <el-row class="lh30 mb5">
            <el-col :span="24" class="flex">
              <span class="grid-label">团建人员：</span>
              <el-collapse v-model="activeNames" class="left90">
                <el-collapse-item :title="`共${item.user_num}人`" name="1">
                  <div class="flex1">
                    <div
                      v-for="(itemDepart, index1) in item.departs || []"
                      :key="index1"
                      class="mb15"
                    >
                      {{ itemDepart.name }}：
                      <el-tag
                        v-for="(itemUser, index2) in itemDepart.users || []"
                        :key="index2"
                        size="small" 
                        effect="plain"
                        >{{ itemUser.name }}</el-tag
                      >
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <!-- 审批人 -->
          <section class="between">
            <div>
              <div
                class="mb15 flex"
                v-for="(approval, index) in item.approve_list || []"
                :key="index"
              >
                <div>{{ approval.name }}</div>
                <div class="ml20" :class="statusClass(approval.approval_opinions)">{{ approval.approval_opinions | statusFilter }}</div>
                <div class="ml20 c9">
                  {{ $dateFormat(approval.approval_time * 1000, 1) }}
                </div>
                <div class="flex1 ml20" style="line-height: 180%">
                  {{ approval.approval_reason }}
                </div>
              </div>
            </div>
          </section>
        </el-card>
      </div>

      <div class="flex_center c9" v-if="flag && !tableData.length">
        暂无数据
      </div>
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

const _statusKey = [
  {
    key: 0,
    value: '待审批',
    class: 'wait'
  },
  {
    key: 1,
    value: '已通过',
    class: 'active_color'
  },
  {
    key: 2,
    value: '已拒绝',
    class: 'dis'
  },
];

export default {
  data() {
    return {
      activeTab: "pending",
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      mode: 1, // 1-通过 2-驳回
      visible: false,
      reason: "",
      obj: {},
      flag: false,

      activeNames: [],
      detailsVisible: false,
      detailsData: [],
      keyword: '',
    };
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  filters: {
    statusFilter(status) {
      let [ resStatus ] = _statusKey.filter(a => a.key == status);
      return resStatus.value;
    },
  },
  methods: {
    // 不同状态对应的class
    statusClass(status) {
      let [ resClass ] = _statusKey.filter(a => a.key == status);
      return resClass.class;
    },
    query(pg) {
      if (this.activeTab == "pending") {
        this.$http
          .post("/act_approve_list", {
            page: pg,
            limit: this.pageControl.pageSize,
            keyword: this.keyword,
          })
          .then((data) => {
            if (data) {
              this.flag = true;
              this.tableData = data.data;
              this.pageControl.total = data.total;
            }
          });
      } else {
        this.$http
          .post("/act_approved_list", {
            page: pg,
            limit: this.pageControl.pageSize,
            keyword: this.keyword,
          })
          .then((data) => {
            if (data) {
              this.flag = true;
              this.tableData = data.data;
              this.pageControl.total = data.total;
            }
          });
      }
    },
    handleChange() {
      this.flag = false;
      this.query(1);
    },
    handleCurrentChange(val) {
      this.query(val);
    },
    handleSizeChange(val) {
      this.pageControl.pageSize = val;
      this.query(1);
    },
    pass(item) {
      this.mode = 1;
      this.obj = { ...item };
      this.reason = "";
      this.visible = true;
    },
    refuse(item) {
      this.mode = 2;
      this.obj = { ...item };
      this.reason = "";
      this.visible = true;
    },
    submitForm() {
      this.$http
        .post("/deal_approve", {
          id: this.obj.id,
          operate_type: this.mode,
          approval_reason: this.reason,
        })
        .then((data) => {
          if (data) {
            this.visible = false;
            this.detailsVisible = false;
            this.$message({
              type: "success",
              message: this.mode == 1 ? "通过成功" : "驳回成功",
            });
            this.query(this.pageControl.pageNumber);
          }
        });
    },
    showDetail(item) {
      this.$router.push({ path: "/league_detail", query: { id: item.id } });
    },
    // 审批按钮
    handleApproval(row) {
      this.detailsData = [row];
      this.detailsVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.el-collapse-item__arrow {
  padding: 10px;
  background-color: #e8e8e8;
}
.radio-wrap {
  margin: 10px auto 30px;
  text-align: center;
}
// /deep/ .el-card__body {
//   padding: 30px !important;
// }
.grid-label {
  display: inline-block;
  width: 90px;
  color: #999;
}
.el-collapse {
  border: none;
}
/deep/ .el-collapse-item__wrap {
  border: none !important;
}
/deep/ .el-collapse-item__header{
  border: none !important;
  display: block;
  height: 30px;
  line-height: 30px;
  margin-bottom: 5px;
}
/deep/ .el-collapse-item__arrow {
  background: none;
  color: #2d8cf0;
  transform: rotate(90deg);
}
/deep/ .el-collapse-item__arrow.is-active{
  transform: rotate(0deg);
}
/deep/ .el-collapse-item__content {
  padding-bottom: 5px;
}

.left90{
  width: calc(100% - 90px);
}

</style>
