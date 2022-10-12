<template>
  <div class="out_wrap">
    <div class="right mb22">
      <el-button type="primary" @click="$router.push('/system')"
        >团建制度</el-button
      >
      <el-button type="primary" @click="create">发起团建</el-button>
    </div>
    <div v-if="flag && tableData.length">
      <div
        class="item bf1 mb22 pointer"
        v-for="(item, index) in tableData"
        :key="index"
      >
        <div class="flex_between" @click="showDetail(item)">
          <div class="flex1">
            <div class="ellipsis mb15" :title="item.name">{{ item.name }}</div>
            <div class="flex_between">
              <div class="flex1">{{ item.user_name }}发起</div>
              <div class="flex1">
                {{ $dateFormat(item.create_time * 1000, 1) }}
              </div>
              <div class="flex1">
                <el-tag type="success" v-if="item.activity_type != '活动'">{{
                  item.activity_type
                }}</el-tag>
                <el-tooltip effect="dark" :content="item.other" placement="top">
                  <el-tag type="success" v-if="item.activity_type == '活动'"
                    >活动</el-tag
                  >
                </el-tooltip>
              </div>
            </div>
          </div>
          <div style="margin: 0 50px">
            <span class="wait" v-if="item.status == 0">待审核</span>
            <span class="able" v-if="item.status == 1">已同意</span>
            <span class="dis" v-if="item.status == 2">已拒绝</span>
          </div>
          <div style="width: 50px; margin: 0 50px">
            <a
              class="able"
              @click.stop="goBs(item)"
              v-if="item.cost_status == 1 && item.status == 1"
              >去报销</a
            >
            <a class="wait" v-if="item.cost_status == 2">报销中</a>
            <a class="return" v-if="item.cost_status == 3">已报销</a>
          </div>
          <i
            class="detail_ico c9 pointer"
            :class="{
              'el-icon-arrow-down': !item.show,
              'el-icon-arrow-up': item.show,
            }"
            @click.stop="openDetail(item)"
          ></i>
        </div>
        <div class="item_detail" v-if="item.show">
          <div v-if="!item.pay_detail_list.length" class="center c9">
            无报销明细
          </div>

          <div v-if="item.pay_detail_list.length">
            <!-- <el-row
              v-for="(child, eq) in item.pay_detail_list"
              :key="eq"
              :gutter="20"
            >
              <el-col :span="6">
                <div>{{ child.oa_main_id }}</div></el-col
              >
              <el-col :span="6"
                ><div>{{ child.company_name }}</div></el-col
              >
              <el-col :span="6"
                ><div class="flex1">
                  报销金额：{{ child.pay_money
                  }}<span class="ml20">报销人数：{{ child.pay_user_num }}</span>
                </div></el-col
              >
              <el-col :span="6">
                <span class="able" v-if="child.process_state == 1">已完成</span>
                <span class="return" v-if="child.process_state == 2"
                  >已撤销</span
                >
                <span class="wait" v-if="child.process_state == 3">待审批</span>
                <span class="dis" v-if="child.process_state == 4"
                  >已拒绝</span
                ></el-col
              >
              <el-col :span="6">
                <a
                  :href="child.approve_url"
                  target="_blank"
                  class="active_color"
                  >审批详情</a
                ></el-col
              >
              <el-col :span="6">
                <a
                  class="active_color"
                  v-if="child.process_state != 1"
                  @click.stop="subAgain(child)"
                  >重新提交</a
                ></el-col
              >
            </el-row> -->

            <div
              v-for="(child, eq) in item.pay_detail_list"
              :key="eq"
              class="flex_between"
            >
              <div class="flex1">{{ child.oa_main_id }}</div>
              <div class="flex1">{{ child.company_name }}</div>
              <div class="flex1">
                报销金额：{{ child.pay_money
                }}<span class="ml20">报销人数：{{ child.pay_user_num }}</span>
              </div>
              <div style="margin: 0 20px">
                <span class="able" v-if="child.process_state == 1">已完成</span>
                <span class="return" v-if="child.process_state == 2"
                  >已撤销</span
                >
                <span class="wait" v-if="child.process_state == 3">待审批</span>
                <span class="dis" v-if="child.process_state == 4">已拒绝</span>
              </div>
              <div style="width: 70px; margin-left: 120px">
                <a
                  :href="child.approve_url"
                  target="_blank"
                  class="active_color"
                  >审批详情</a
                >
              </div>
              <div style="width: 70px; margin-left: 120px" class="right">
                <a
                  class="active_color"
                  v-if="child.process_state != 1"
                  @click.stop="subAgain(child)"
                  >重新提交</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="flag && !tableData.length" class="flex_center c9">暂无数据</div>
    <el-dialog title="重新提交" :visible.sync="visible">
      <el-form :model="subData" label-width="100px">
        <el-form-item label="付款公司：">
          <el-input
            type="text"
            v-model="subData.info.company_name"
            placeholder="付款公司"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="付款人数："
          >{{ subData.info.pay_user_num || 0 }}人</el-form-item
        >
        <el-form-item label="付款金额："
          >{{ subData.info.pay_money || "0.00" }}元</el-form-item
        >
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="subData.info.remark"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件：">
          <el-upload
            action="#"
            :multiple="false"
            show-file-list
            :auto-upload="true"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            :file-list="subData.attachment"
            :http-request="uploadAttach"
            ><a class="active_color">添加附件</a></el-upload
          >
        </el-form-item>
      </el-form>
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
</template>

<script>
import { activityList, uploadFile } from "@/util/api_common";

export default {
  data() {
    return {
      flag: false,
      tableData: [],
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0,
      },
      subData: {
        info: {},
        attachment: [],
      },
      visible: false,
    };
  },
  created() {
    this.query(this.pageControl.pageNumber);
  },
  methods: {
    query(pg) {
      this.pageControl.pageNumber = pg;
      activityList({ page: pg, limit: this.pageControl.pageSize }).then(
        (data) => {
          if (data) {
            this.flag = true;
            for (let i of data.data) {
              i.show = false;
            }
            this.tableData = data.data;
            this.tableData[0].show = true;
            this.pageControl.total = data.total;
          }
        }
      );
    },
    handleCurrentChange(val) {
      this.query(val);
    },
    handleSizeChange(val) {
      this.pageControl.pageSize = val;
      this.query(1);
    },
    create() {
      this.$router.push({ path: "/league_create" });
    },
    showDetail(item) {
      this.$router.push({ path: "/league_detail", query: { id: item.id } });
    },
    goBs(item) {
      this.$router.push({ path: "/league_reimburse", query: { id: item.id } });
    },
    openDetail(item) {
      item.show = !item.show;
    },
    subAgain(item) {
      this.$http.get("/get_pay_detail", { id: item.id }).then((data) => {
        if (data) {
          for (let i of data.attachment || []) {
            i.name = i.file_name;
            i.url = i.file_path;
          }
          this.subData = data;
          this.visible = true;
        }
      });
    },
    submitForm() {
      this.$http
        .post("/add_pay_detail", {
          old_pay_detail_id: this.subData.info.id,
          pay_company: [
            {
              pay_company_id: this.subData.info.pay_company_id,
              pay_company_name: this.subData.info.company_name,
              pay_user_num: this.subData.info.pay_user_num,
              user_ids: this.subData.info.user_ids,
              pay_money: this.subData.info.pay_money,
              remark: this.subData.info.remark || "",
              attachment: [
                ...this.subData.attachment.map((d) => {
                  return { file_name: d.name, file_path: d.url };
                }),
              ],
            },
          ],
        })
        .then((data) => {
          if (data) {
            this.$message({ type: "success", message: "重新提交成功" });
            this.visible = false;
            this.query(this.pageControl.pageNumber);
          }
        });
    },
    handlePreview(file) {
      window.open(file.url);
    },
    handleRemove(file, fileList) {
      let index = fileList.findIndex((d) => d.uid == file.uid);
      this.subData.attachment.splice(index, 1);
    },
    handleChange(file, fileList) {},
    beforeUpload(file) {},
    uploadAttach(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          let item = { name: file.file.name, url: data.path };
          this.subData.attachment = [...this.subData.attachment, item];
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.item {
  padding: 15px 30px;
  .detail_ico {
    padding: 10px;
    display: inline-block;
    background-color: #e8e8e8;
  }
  .item_detail {
    line-height: 35px;
    border-top: 1px solid #e8e8e8;
    margin-top: 10px;
    padding-top: 10px;
  }
}
</style>
