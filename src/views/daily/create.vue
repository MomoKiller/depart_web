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
        <span class="fs18 bold">发起日常团建</span>
      </el-form-item>
      <el-form-item label="团建主题" prop="name">
        <el-input
          type="text"
          v-model="leagueForm.name"
          placeholder="部门+主题+内容，例如总裁办秘书组迎新团建去聚餐"
          clearable
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="团建形式" prop="type">
        <div class="flex">
          <div class="flex1">
            <el-select
              v-model="leagueForm.type"
              class="w100"
              clearable
              filterable
              placeholder="请选择团建形式"
              @change="typeChange"
            >
              <el-option
                v-for="(item, index) in optionArr"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="flex1 ml15"
            v-show="optionArr.find((d) => d.name == '活动')
              ? leagueForm.type ==
                optionArr.find((d) => d.name == '活动').id
              : false"
          >
            <el-input
              type="text"
              v-model="leagueForm.other"
              placeholder="请标注活动内容"
              clearable
            ></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="团建人员" required>
        <com-user
          class="w100 inline"
          :ids="leagueForm.user_ids"
          @Uchange="Uchange"
        ></com-user>
      </el-form-item>
      <el-form-item label="">
        <div>
          <span style="padding-right: 50px"
            >已选团建人数：{{ leagueForm.range.length }}</span
          >
          <span>可使用团建费用：{{ totalMoney }}元</span>
        </div>
      </el-form-item>
      <el-form-item label="预估金额" prop="pay_in_advance">
        <el-input
          type="text"
          v-model="leagueForm.pay_in_advance"
          placeholder="请输入（不得高于可使用团建费）"
          clearable
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="团建地点" prop="location">
        <el-input
          type="text"
          v-model="leagueForm.location"
          placeholder="请输入地点"
          clearable
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="团建时间" prop="act_date">
        <el-date-picker
          v-model="leagueForm.act_date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :editable="false"
          clearable
          :value-format="'yyyy-MM-dd'"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="团建描述" prop="desc">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请详细描述此次团建的原因"
          v-model="leagueForm.desc"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex"> 
          <div class="label wd45">提示:</div>
          <div class="tips">
            <div>
              1、团建过程中需拍摄至少1张集体照作为团建照片，报销流程中请上传
            </div>
            <div>
              2、参与人员中若有即将离职员工，则该笔费用需在该人员离职前提交报销申请
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="w160">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
import ComUser from "@/components/user";
import { typeList, uploadFile } from "@/util/api_common";

export default {
  data() {
    const validatetype = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择团建形式"));
      } else {
        if (
          this.optionArr.find((d) => d.name == "活动") &&
          value == this.optionArr.find((d) => d.name == "活动").id &&
          !this.leagueForm.other
        ) {
          callback(new Error("请标注活动内容"));
        } else {
          callback();
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入预估花费金额"));
      }else if(!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(value)) {
        callback(new Error("金额只能输入数字"));
      }else if (value > this.totalMoney) {
        callback(new Error("可用团建经费不足"));
      } else {
        callback();
      }
    };
    return {
      leagueForm: {
        range: [],
        user_ids: [],
        location: "",
        pay_in_advance: "",
      },
      totalMoney: 0,
      rules: {
        name: [
          { required: true, message: "请输入团建主题", trigger: "change" },
        ],
        type: [{ required: true, validator: validatetype, trigger: "change" }],
        act_date: [
          { required: true, message: "请选择团建时间", trigger: "change" },
        ],
        pay_in_advance: [
          {
            required: true,
            validator: validatePass2,
            trigger: "change",
          },
        ],
        location: [
          { required: true, message: "请输入地点", trigger: "change" },
        ],
        desc: [
          { required: true, message: "请详细描述此次团建的原因", trigger: "change" },
        ],
      },
      optionArr: [],
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  created() {
    this.leagueForm.user_ids.push(
      JSON.parse(localStorage.getItem("info")).info.user_id
    );
    this.leagueForm.range.push(
      JSON.parse(localStorage.getItem("info")).info.user_id
    );
    typeList(2).then((data) => {
      if (data) {
        this.optionArr = data;
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.leagueForm.range.length) {
            this.$message("请选择团建人员");
            return false;
          }
          this.$http
            .post("/add_activity", {
              name: this.leagueForm.name,
              // act_date: this.leagueForm.act_date,
              start_date: this.leagueForm.act_date[0],
              end_date: this.leagueForm.act_date[1],
              type: this.leagueForm.type,
              other: this.leagueForm.other || "",
              user_ids: this.leagueForm.range.toString(),
              desc: this.leagueForm.desc || "",
              location: this.leagueForm.location,
              pay_in_advance: this.leagueForm.pay_in_advance,
              attachment: [
                ...this.fileList.map((d) => {
                  return { file_name: d.name, file_path: d.url };
                }),
              ],
            })
            .then((data) => {
              if (data) {
                this.$message({ type: "success", message: "发起成功" });
                this.$router.go(-1);
              }
            });
        } else {
          return false;
        }
      });
    },
    typeChange(e) {
      if (this.optionArr.find((d) => d.name == "活动")) {
        if (
          this.leagueForm.type !=
          this.optionArr.find((d) => d.name == "活动").id
        ) {
          this.leagueForm.other = "";
        }
      }
    },
    beforeUploadImg(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    uploadImage(file) {
      uploadFile(file.file).then((data) => {
        if (data) {
          let item = { name: file.file.name, url: data.path };
          this.fileList = [...this.fileList, item];
        }
      });
    },
    handleRemove(file, fileList) {
      let index = this.fileList.findIndex((d) => d.uid == file.uid);
      this.fileList.splice(index, 1);
    },
    handleChange(file, fileList) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    Uchange(val) {
      // this.totalMoney = val.money;
      this.totalMoney = parseFloat(val.money.toFixed(10));
      this.leagueForm.range = val.user;
      // console.log("user", val.user);
    },
  },
  components: {
    ComUser,
  },
};
</script>

<style lang="less" scoped>
.tips {
  color: red;
}

</style>
