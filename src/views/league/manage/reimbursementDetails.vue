<template>
  <div class="out_wrap">
    <div class="center mb35 hidden">
      <el-button class="fl" @click="back" size="mini" round
        ><i class="el-icon-arrow-left"></i>返回</el-button
      >
    </div>

    <el-form
      :model="leagueForm"
      ref="ruleForm"
      label-width="150px"
      class="mb35 wd700 pr"
    >
      <section class="pa status-img">
        <img 
          :src="formateImgUrl" 
          alt="审批状态" 
          v-show="formateImgUrl"  
        />
      </section>

      <!-- 已拒绝重提 -->
      <el-form-item label="操作"
        v-if="isReject"
      >
        <el-button 
          type="primary" 
          size="medium" 
          class="wdth100"
          @click="$router.push(`/league_reimburse?id=${$route.query.id}&type=1`)"
        >重提</el-button>
      </el-form-item>

      <!-- 审批流程 -->
      <el-form-item label="审批人" class="minH130">
        <section v-for="(approval, index) in approval_list || []" :key="index" class="process pr" >
          <el-image
            style="width: 50px; height: 50px;border-radius:50%;"
            :src="require('@/assets/image/head.png')"
            fit="cover"
            ></el-image>
          <div class="person-wrap">
            <span>{{ approval.name }}</span>
            <span :class="formateClass(approval.approval_opinions)">{{ approval.approval_opinions | statusFilter }}</span>
            <span v-show="approval.approval_time != ''">{{ $dateFormat(approval.approval_time * 1000, 1) }}</span>
            <span v-show="approval.approval_reason != ''">{{ approval.approval_reason }}</span>
          </div>
        </section>
      </el-form-item>

      <el-form-item label="流程主题" prop="title">
        <el-input
          type="text"
          v-model="leagueForm.title"
          placeholder="流程主题"
        ></el-input>
      </el-form-item>

      <el-form-item label="收款信息" prop="payee_name">
        <el-input
          type="text"
          v-model="leagueForm.payee_name"
          placeholder="请输入收款人姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="payee_card">
        <el-input
          type="text"
          v-model="leagueForm.payee_card"
          placeholder="请输入收款卡号"
          clearable
          @input="
            leagueForm.payee_card = leagueForm.payee_card.replace(/\D/g, '')
          "
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="pay_bank">
        <el-input
          type="text"
          v-model="leagueForm.pay_bank"
          placeholder="请输入收款账号开户行"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="open_city">
        <el-input
          type="text"
          v-model="leagueForm.open_city"
          placeholder="请输入收款城市"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="报销明细" required>
        <div
          v-for="(item, index) in leagueForm.detail"
          :key="index"
          class="border-item mb15"
        >
          <el-select
            v-model="item.use_type"
            class="w100 mb22"
            clearable
            filterable
            disabled
            placeholder="请选择报销明细"
          >
            <el-option
              v-for="item in userTypeKeys"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>

          <el-input
            type="text"
            v-model="item.cnt"
            placeholder="请输入发票张数"
            @input="item.cnt = item.cnt.replace(/\D/g, '')"
            class="w100 mb22"
          >
            <i slot="suffix">张</i>
          </el-input>

          <el-input
            type="text"
            v-model="item.total_amount"
            placeholder="需要报销金额（金额只能小于或等于发票上的金额/可用团建费）"
            class="w100 mb15"
          >
            <i slot="suffix">元</i>
          </el-input>
          <div style="width: 33px" v-if="index == 0"></div>
        </div>
        <div class="bf1 flex" style="padding: 6px">
          <div class="flex1">合计</div>
          <div class="flex1">{{ upcaseTotal }}</div>
          <div class="flex1">{{ numTotal }}元</div>
        </div>
      </el-form-item>

      <el-form-item label="付款公司" required>
        <div v-for="(item, index) in payer_list" :key="index">
          <el-input
            type="text"
            disabled
            v-model="item.company_name"
            placeholder="付款公司"
            readonly
            class="w100 mb22"
          ></el-input>
          <el-popover
            placement="top"
            :width="item.user_name.length >= 30 ? 700 : 300"
            trigger="click"
          >
            <h4 class="user_title">参与员工</h4>
            <div class="usrtlist">
              <el-tag v-for="v in item.user_name" :key="v">{{ v }}</el-tag>
            </div>
            <div
              slot="reference"
            >
              <el-input
                type="text"
                disabled
                v-model="item.pay_user_num"
                placeholder="参与员工"
                class="w100 mb22"
              >
                <i slot="suffix">人</i>
              </el-input>
            </div>
          </el-popover>
          <el-input
            type="text"
            disabled
            v-model="item.pay_money"
            placeholder="付款金额"
            class="w100 mb22"
          ></el-input>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="item.remark"
            resize="none"
          ></el-input>
        </div>
      </el-form-item>

      <!-- 发票 -->
      <el-form-item
        label="发票"
        v-if="$route.query.type != 2"
      >
        <div v-if="invoice_files && invoice_files.length > 0">
          <p
            v-for="(item, index) in invoice_files"
            :key="index"
            style="margin: 0"
          >
            {{ item.file_name }}
          </p>
        </div>
      </el-form-item>

      <el-form-item
        :label="$route.query.type == 2 ? '报销票务相关附件' : '报销单'"
      >
        <div v-if="voucher_files && voucher_files.length > 0">
          <p
            v-for="(item, index) in voucher_files"
            :key="index"
            style="margin: 0"
          >
            {{ item.file_name }}
          </p>
        </div>
      </el-form-item>
      <el-form-item label="团建图集">
        <div
          v-for="(item, index) in srcList"
          :key="index"
          style="display: inline-block; margin-right: 10px"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="srcList[index]"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>

    <!-- <el-divider></el-divider>
    <div
      class="mb15 flex"
      v-for="(approval, index) in approval_list || []"
      :key="index"
    >
      <div>{{ approval.name }}</div>
      <div class="wait ml20" v-if="approval.approval_opinions == 0">待审批</div>
      <div class="active_color ml20" v-if="approval.approval_opinions == 1">已通过</div>
      <div class="dis ml20" v-if="approval.approval_opinions == 2">已拒绝</div>
      <div class="ml20 c9">
        {{ $dateFormat(approval.approval_time * 1000, 1) }}
      </div>
      <div class="flex1 ml20" style="line-height: 180%">{{ approval.approval_reason }}</div>
    </div> -->

  </div>
</template>

<script>
import { convertCurrency } from "@/util/fn";

const _statusOption = [
  {
    key: 0,
    name: '待审批',
    class: 'wait',
    imgUrl: require('@/assets/image/img_examine.png')
  },{
    key: 1,
    name: '已通过',
    class: 'active_color',
    imgUrl: require('@/assets/image/img_pass.png')
  },{
    key: 2,
    name: '已拒绝',
    class: 'dis',
    imgUrl: require('@/assets/image/img_rejecte.png')
  },
];

const _userTypeKeys = [
  {
    key: 1,
    value: "招待费：餐饮、礼品发票、烟酒发票等"
  },
  {
    key: 2,
    value: "交通费：打车租车票、地铁票、公交票"
  },
  {
    key: 3,
    value: "差旅费：住宿、火车票、飞机票、长途汽车票"
  },
  {
    key: 4,
    value: "福利费：餐饮、食品发票等"
  },
  {
    key: 5,
    value: "通讯费：电话费、手机费"
  },
  {
    key: 6,
    value: "办公费：办公用品发票、图书发票、日用品发票"
  },
  {
    key: 7,
    value: "培训费：培训费发票、培训费收据"
  },
  {
    key: 8,
    value: "会议费：会议费发票"
  },
  {
    key: 9,
    value: "快递费：快递费发票"
  },
  {
    key: 10,
    value: "咨询费：中介服务发票"
  },
  {
    key: 11,
    value: "业务宣传费（印刷传单费用发票等）"
  },
  {
    key: 12,
    value: "车辆费：停车、洗车、保养、加油发票"
  },
  {
    key: 13,
    value: "保险费：保险发票"
  },
  {
    key: 14,
    value: "服务费：个人垫付对公付款"
  },
  {
    key: 15,
    value: "固定资产"
  },
];

export default {
  data() {
    return {
      leagueForm: {
        title: "",
        detail: [{ use_type: "", cnt: "", total_amount: "" }],
        company_user: [],
      },
      payer_list: [],
      voucher_files: [],
      invoice_files: [],
      userList: [],
      fileList: [],
      totalUser: 0,
      dialogVisible: false,
      dialogImageUrl: "",
      approval_list: [],
      reverse: false,
      srcList: [],
      userTypeKeys: _userTypeKeys,
      process_state: ''
    };
  },
  filters: {
    statusFilter(val) {
      const statusObj = _statusOption.find(item => item.key == val);
      return statusObj.name;
    },
  },
  computed: {
    numTotal() {
      let total = 0;
      for (let i of this.leagueForm.detail) {
        total += Number(i.total_amount || 0);
      }
      return total;
    },
    upcaseTotal() {
      return convertCurrency(this.numTotal) || "零元";
    },
    // 获取图片
    formateImgUrl() {
      let res = '';
      if(this.process_state === 4){ // 审批过程被拒绝
        res = require('@/assets/image/img_rejecte.png');
      } else if(JSON.stringify(this.approval_list) != '[]'){
        const stateKey = this.approval_list[this.approval_list.length -1].approval_opinions;
        const statusObj = _statusOption.find(item => item.key == stateKey);
        res = statusObj.imgUrl;
      }
      return res;
    },
    // 展示重提按钮
    isReject() {
      let res = false;
      if(this.process_state === 4){ // 审批过程被拒绝
        res = true;
      }else if(JSON.stringify(this.approval_list) != '[]'){
        res = this.approval_list[this.approval_list.length -1].approval_opinions === 2 ? true : false;
      }
      return res;
    }
  },
  created() {
    this.$http
      .get("/approve_detail", { act_id: this.$route.query.id })
      .then((data) => {
        if (data) {
          // console.log("data", data);
          this.leagueForm.title = data.info.title;
          this.leagueForm.payee_name = data.info.payee_name;
          this.leagueForm.payee_city = data.info.payee_city;
          this.leagueForm.payee_card = data.info.payee_card;
          this.leagueForm.pay_bank = data.info.payee_bank;
          this.leagueForm.open_city = data.info.open_city;
          this.leagueForm.detail = data.detail_list;
          this.payer_list = data.payer_list;
          this.voucher_files = data.voucher_files;
          this.invoice_files = data.invoice_files;
          this.totalUser = 0;
          this.process_state = data.info.process_state;
          // this.leagueForm.title = data.title;
          // this.userList = data.user_name;
          for (let i of data.payer_list) {
            this.totalUser += Number(i.num || 0);
          }
          for (let i of data.attachments) {
            this.srcList.push(i.file_path);
          }
          // console.log(this.srcList);
          // if (data.attachments && data.attachments.length > 0) {
          //   this.url = data.attachments[0].file_path;
          // }
          this.leagueForm.company_user = data.company_user;
          this.approval_list = data.approval_list;
        }
      });
  },
  methods: {
    // 获取样式
    formateClass(val) {
      const statusObj = _statusOption.find(item => item.key == val);
      return statusObj.class;
    },
    

    back() {
      this.$router.go(-1);
    },
    // 上传发票报销单
    // 上传游记
    uploadAttach1(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          this.fileList.push({
            name: file.file.name,
            path: data.path,
          });
        }
      });
    },
    // 上传图鉴图集
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.user_title {
  margin: 0;
  text-align: center;
  margin-bottom: 10px;
}
.usrtlist {
  display: flex;
  flex-wrap: wrap;
  height: 200px;
  overflow: auto;
}
.border-item {
  border: 1px dashed #999;
  border-radius: 4px;
  padding: 5px;
}

// 审批流程样式
.process {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 66px;
  &::after {
    content: '';
    width: 0px;
    height: 48px;
    border-left: 1px solid #DEDEDE;
    position: absolute;
    top: calc(100% + 10px);
    left: 25px;
  }
  &:last-child {
    margin-bottom: 30px;
    &::after {
      display: none;
    }
  }
}
.person-wrap {
  width: 225px;
  margin-left: 40px;
  span {
    display: block;
    height: 20px;
    line-height: 20px;
  }
}
.minH130 {
  min-height: 130px;
}
.status-img {
  width:126px;
  height:126px;
  right:110px;
}
.wdth100 {
  width: 100px;
}
</style>
