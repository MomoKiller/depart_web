<template>
  <div class="out_wrap">
    <div class="center mb35 hidden">
      <el-button class="fl" @click="back" size="mini" round
        ><i class="el-icon-arrow-left"></i>返回</el-button
      >
    </div>
    <el-form
      :model="leagueForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="mb35 wd700"
    >
      <el-form-item label-width="75px">
        <span class="fs18 bold">团建报销</span>
      </el-form-item>
      <el-form-item label="流程主题" prop="title">
        <el-input
          type="text"
          v-model="leagueForm.title"
          placeholder="流程主题"
          disabled
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
            @input="payPriceChange(item)"
            class="w100 mb15"
          >
            <i slot="suffix">元</i>
          </el-input>
          
          <a class="del" @click="delDetail(index)" v-if="index != 0">删除</a>
          <div style="width: 33px" v-if="index == 0"></div>
        </div>
        <a class="active_color mb15" @click="addDetail">增加明细</a>
        <div class="bf1 flex" style="padding: 6px">
          <div class="flex1">合计</div>
          <div class="flex1">{{ upcaseTotal }}</div>
          <div class="flex1">{{ numTotal }}元</div>
        </div>
      </el-form-item>

      <el-form-item label="付款公司" required>
        <div
          class="mb15"
          v-for="(item, index) in leagueForm.company_user"
          :key="index"
        >
          <el-input
            type="text"
            disabled
            v-model="item.company_name2"
            placeholder="付款公司"
            readonly
            class="w100 mb22"
          ></el-input>
          <el-popover
            placement="top"
            :width="userList.length >= 30 ? 700 : 300"
            trigger="click"
          >
            <h4 class="user_title">参与员工</h4>
            <div class="usrtlist">
              <el-tag v-for="v in userList" :key="v">{{ v }}</el-tag>
            </div>
            <div
              slot="reference"
            >
              <el-input
                type="text"
                disabled
                v-model="item.num"
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
            @input="payPriceChange1(item)"
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
        prop="file2"
        v-if="$route.query.type != 2"
      >
        <div
          class="mb22"
          v-for="(item, index) in leagueForm.company_user"
          :key="index"
        >
          <div>
            <el-upload
              action="#"
              :multiple="false"
              show-file-list
              :auto-upload="true"
              :on-preview="handlePreview2"
              :on-remove="handleRemove2"
              :on-change="handleChange2"
              :before-upload="beforeUpload2"
              :file-list="item.invoice_files"
              :http-request="uploadAttach2"
              :data="{ index: index }"
              ><a class="active_color">添加附件</a></el-upload
            >
          </div>
        </div>
      </el-form-item>
      <!-- 报销单 -->
      <el-form-item
        :label="$route.query.type == 2 ? '报销票务相关附件' : '报销单'"
        prop="file"
      >
        <div
          class="mb22 pr"
          v-for="(item, index) in leagueForm.company_user"
          :key="index"
        >
          <div>
            <el-upload
              action="#"
              :multiple="false"
              show-file-list
              :auto-upload="true"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :before-upload="beforeUpload"
              :file-list="item.voucher_files"
              :http-request="uploadAttach"
              :data="{ index: index }"
              >
              <a class="active_color">添加附件</a>
            </el-upload>
          </div>

          <div class="download-wrap pa">
            <el-button type="text" @click="downloadExcel">下载模板</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="团建图集" prop="file1">
        <div
          class="mb22"
          v-for="(item, index) in leagueForm.company_user"
          :key="index"
        >
          <el-upload
            action="#"
            :multiple="false"
            show-file-list
            :accept="'image/png, image/jpeg, image/jpg'"
            list-type="picture-card"
            :auto-upload="true"
            :on-preview="handlePictureCardPreview1"
            :on-remove="handleRemove1"
            :on-change="handleChange1"
            :before-upload="beforeUploadImg1"
            :file-list="item.attachment"
            :http-request="uploadImage1"
            ><i class="el-icon-plus"></i
          ></el-upload>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="isChange" class="w160">提交</el-button>
        <hr v-else />
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
import { convertCurrency } from "@/util/fn";
import { uploadFile } from "@/util/api_common";
import { BASE_URL } from "@/util/index";

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
    const validatePayee = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入收款人姓名"));
      } else if (!this.leagueForm.payee_card) {
        callback(new Error("请输入收款人卡号"));
      } else if (!this.leagueForm.pay_bank) {
        callback(new Error("请输入收款账号开户行"));
      } else if (!this.leagueForm.open_city) {
        callback(new Error("请输入收款城市"));
      } else {
        callback();
      }
    };
    const validateFile = (rule, value, callback) => {
      if (
        !(
          this.leagueForm.company_user[0].voucher_files &&
          this.leagueForm.company_user[0].voucher_files.length > 0
        )
      ) {
        callback(new Error("请上传附件"));
      } else {
        callback();
      }
    };
    const validateFile1 = (rule, value, callback) => {
      if (
        !(
          this.leagueForm.company_user[0].attachment &&
          this.leagueForm.company_user[0].attachment.length > 0
        )
      ) {
        callback(new Error("请上传图集"));
      } else {
        callback();
      }
    };
    const validateFile2 = (rule, value, callback) => {
      if (
        !(
          this.leagueForm.company_user[0].invoice_files &&
          this.leagueForm.company_user[0].invoice_files.length > 0
        )
      ) {
        callback(new Error("请上传发票"));
      } else {
        callback();
      }
    };

    return {
      leagueForm: {
        title: "",
        // detail: [{ use_type: "", cnt: "", total_amount: "" }],
        // 20211026 默认福利费
        detail: [{ use_type: 4, cnt: "", total_amount: "" }],
        company_user: [],
      },
      userList: [],
      rules: {
        title: [{ required: true, message: "请输入流程主题", trigger: "blur" }],
        payee_name: [
          { required: true, message: "请输入收款人姓名", trigger: "blur" }
        ],
        payee_card: [
          { required: true, message: "请输入收款卡号", trigger: "blur" }
        ],
        pay_bank: [
          { required: true, message: "请输入收款账号开户行", trigger: "blur" }
        ],
        open_city: [
          { required: true, message: "请输入收款城市", trigger: "blur" }
        ],
        file: [{ required: true, validator: validateFile, trigger: "change" }],
        file1: [
          { required: true, validator: validateFile1, trigger: "change" },
        ],
        file2: [{ required: true, validator: validateFile2, trigger: "change" }],
      },
      fileList: [],
      totalUser: 0,
      isChange: true,
      dialogVisible: false,
      dialogImageUrl: "",
      userTypeKeys: _userTypeKeys
    };
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
  },
  created() {
    if (this.$route.query.type == 1) {
      this.leagueForm.title = "日常团建报销";
    } else {
      this.leagueForm.title = "定向团建报销";
    }
    this.$http
      .get(
        this.$route.query.type == 1
          ? "/get_baoxiao_info"
          : "direction/get_baoxiao_info",
        { act_id: this.$route.query.id }
      )
      .then((data) => {
        if (data) {
          this.totalUser = 0;
          // this.leagueForm.title = data.title;
          this.userList = data.user_name;
          for (let i of data.company_user) {
            this.totalUser += Number(i.num || 0);
          }
          for (let i of data.company_user) {
            i.attachment = [];
            i.voucher_files = [];
            i.invoice_files = [];
            i.pay_money = this.calcCompanyTotal(i);
          }
          this.leagueForm.company_user = data.company_user;
        }
      });
  },
  methods: {
    back() {
      this.$confirm("确定返回吗？返回后已填写数据不会保留", "返回提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    addDetail() {
      this.leagueForm.detail = [
        ...this.leagueForm.detail,
        { use_type: "", cnt: "", total_amount: "" },
      ];
    },
    delDetail(index) {
      this.leagueForm.detail.splice(index, 1);
    },
    payPriceChange(item) {
      item.total_amount = item.total_amount.replace(/[^\d\.]/g, "");
      item.total_amount = item.total_amount.replace(/^\./g, "");
      item.total_amount = item.total_amount.replace(/\.{2,}/g, ".");
      item.total_amount = item.total_amount
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      item.total_amount = item.total_amount.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      );
      for (let i of this.leagueForm.company_user) {
        i.pay_money = this.calcCompanyTotal(i);
      }
    },
    payPriceChange1(item) {
      item.pay_money = item.pay_money.replace(/[^\d\.]/g, "");
      item.pay_money = item.pay_money.replace(/^\./g, "");
      item.pay_money = item.pay_money.replace(/\.{2,}/g, ".");
      item.pay_money = item.pay_money
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      item.pay_money = item.pay_money.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      );
    },
    calcCompanyTotal(item) {
      return (this.numTotal * (item.num / this.totalUser)).toFixed(2);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i of this.leagueForm.detail) {
            if (!i.use_type || i.cnt === "" || i.total_amount === "") {
              this.$message("报销明细请填写完整");
              return false;
            }
          }
          let url =
            this.$route.query.type == 1
              ? "/add_approve"
              : "/direction/add_approve";
          let submitData = {
            act_id: this.$route.query.id,
            payee_name: this.leagueForm.payee_name,
            payee_card: this.leagueForm.payee_card,
            payee_bank: this.leagueForm.pay_bank,
            open_city: this.leagueForm.open_city,
            total_money: this.numTotal,
            str_total_money: this.upcaseTotal,
            title: this.leagueForm.title,
            detail: this.leagueForm.detail,
            pay_company: [
              ...this.leagueForm.company_user.map((d) => {
                return {
                  pay_company_id: d.company_id,
                  pay_company_name: d.company_name,
                  pay_user_num: d.num,
                  user_ids: d.user_ids,
                  pay_money: d.pay_money,
                  remark: d.remark || "",
                  attachment: [
                    ...d.attachment.map((d) => {
                      return { file_name: d.name, file_path: d.url };
                    }),
                  ],
                  voucher_files: [
                    ...d.voucher_files.map((d) => {
                      return { file_name: d.name, file_path: d.url };
                    }),
                  ],
                  // 发票
                  invoice_files: [
                    ...d.invoice_files.map((d) => {
                      return { file_name: d.name, file_path: d.url };
                    }),
                  ]
                };
              }),
            ],
          };
          if (this.$route.query.type == 2) {
            submitData.travel_attachment = this.fileList.map((v) => {
              return { file_name: v.name, file_path: v.path };
            });
          }
          this.$http.post(url, submitData).then((data) => {
            if (data) {
              this.$message({ type: "success", message: "报销发起成功" });
              this.$router.go(-1);
            }
          });
          return true;
        } else {
          return false;
        }
      });
    },
    // 上传发票报销单
    handlePreview(file) {},
    handleRemove(file, fileList) {
      this.leagueForm.company_user[file.belong].voucher_files = [...fileList];
    },
    handleChange(file, fileList) {},
    beforeUpload(file) {},
    uploadAttach(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          // console.log(file);
          this.$refs.ruleForm.clearValidate("file");
          let item = {
            name: file.file.name,
            url: data.path,
            belong: file.data.index,
          };
          this.leagueForm.company_user[file.data.index].voucher_files = [
            ...this.leagueForm.company_user[file.data.index].voucher_files,
            item,
          ];
        }
      });
    },

    // 20211026 上传发票
    handlePreview2(file) {},
    handleRemove2(file, fileList) {
      this.leagueForm.company_user[file.belong].invoice_files = [...fileList];
    },
    handleChange2(file, fileList) {},
    beforeUpload2(file) {},
    uploadAttach2(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          this.$refs.ruleForm.clearValidate("file");
          let item = {
            name: file.file.name,
            url: data.path,
            belong: file.data.index,
          };
          this.leagueForm.company_user[file.data.index].invoice_files = [
            ...this.leagueForm.company_user[file.data.index].invoice_files,
            item,
          ];
        }
      });
    },


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
    beforeUploadImg1(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    uploadImage1(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          this.$refs.ruleForm.clearValidate("file1");
          // let item = { name: file.file.name, url: data.path };
          // this.fileList = [...this.fileList, item];
          let item = { name: file.file.name, url: data.path };
          this.leagueForm.company_user[0].attachment = [
            ...this.leagueForm.company_user[0].attachment,
            item,
          ];
        }
      });
    },
    handleRemove1(file, fileList) {
      let index = this.leagueForm.company_user[0].attachment.findIndex(
        (d) => d.uid == file.uid
      );
      this.leagueForm.company_user[0].attachment.splice(index, 1);
    },
    handleChange1(file, fileList) {},
    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 下载模板
    downloadExcel() {
      window.open(`${BASE_URL}/file/expense-template.xlsx`);
    }
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

.download-wrap {
  top: 0;
  left: 120px;
}
</style>
