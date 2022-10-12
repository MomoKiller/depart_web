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
        <span class="fs18 bold">发起定向团建</span>
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
        <el-select
          v-model="leagueForm.type"
          class="w100"
          clearable
          filterable
          placeholder="请选择团建形式"
          @change="typeChange"
        >
          <el-option
            v-for="v in optionArr"
            :key="v.id"
            :label="v.name"
            :value="v.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团建人员" prop="user_ids">
        <el-cascader
          v-model="leagueForm.user_ids"
          class="w100 inline"
          :options="userList"
          :props="props"
          clearable
          :show-all-levels="false"
          ref="cascader"
          @change="changeSelect"
          @remove-tag="removeTag"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        v-if="leagueForm.type == 11"
        label="安全员"
        prop="security_ids"
      >
        <el-select
          class="w100 inline"
          v-model="leagueForm.security_ids"
          clearable
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in securityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <div>
          <span style="padding-right: 50px"
            >已选团建人数：{{ leagueForm.user_ids.length }}</span
          >
          <!-- <span>可使用团建费用：{{ totalMoney }}元</span> -->
        </div>
      </el-form-item>
      <el-form-item label="地点" prop="location">
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
      <el-form-item label="团建描述">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入团建描述"
          v-model="leagueForm.desc"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="w160">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { directTypeList, directUserList } from "@/util/api_common";
export default {
  data() {
    return {
      leagueForm: {
        name: "",
        type: "",
        user_ids: [],
        security_ids: [],
        act_date: "",
        desc: "",
        location: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入团建主题", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择团建形式", trigger: "change" },
        ],
        act_date: [
          { required: true, message: "请选择团建时间", trigger: "change" },
        ],
        user_ids: [
          { required: true, message: "请选择团建人员", trigger: "change" },
        ],
        security_ids: [
          { required: true, message: "请选择安全员", trigger: "change" },
        ],
        location: [
          { required: true, message: "请输入地点", trigger: "change" },
        ],
      },
      optionArr: [],
      userList: [],
      securityList: [],
      props: {
        checkStrictly: false,
        label: "name",
        emitPath: false,
        multiple: true,
      },
      // totalMoney: 0,
    };
  },
  created() {
    this.leagueForm.user_ids.push(
      JSON.parse(localStorage.getItem("info")).info.user_id
    );
    // console.log("this.leagueForm.user_ids", this.leagueForm.user_ids);
    directTypeList().then((data) => {
      if (data) {
        this.optionArr = data;
      }
    });
    directUserList().then((data) => {
      if (data) {
        this.userList = data;
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
        if (this.leagueForm.type == 11) {
          let num =
            this.leagueForm.user_ids.length % 30 === 0
              ? parseInt(this.leagueForm.user_ids.length / 30)
              : parseInt(this.leagueForm.user_ids.length / 30) + 1;
          if (this.leagueForm.security_ids.length !== num) {
            this.$message.warning("每30个参与者就需要1个安全员");
            return false;
          }
        }
        if (valid) {
          const submitData = {
            ...this.leagueForm,
            start_date: this.leagueForm.act_date[0],
            end_date: this.leagueForm.act_date[1],
            user_ids: this.leagueForm.user_ids.toString(),
            security_ids: this.leagueForm.security_ids.toString(),
            location: this.leagueForm.location,
          };
          delete submitData.act_date;

          this.$http
            .post("/direction/add_activity", submitData)
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
      if (e != 11) {
        this.leagueForm.security_ids = [];
        this.securityList = [];
        return false;
      }
      let list = this.$refs["cascader"]
        .getCheckedNodes()
        .filter((v) => !v.hasChildren);
      this.securityList = list.map((v) => ({
        label: v.label,
        value: v.value,
      }));
    },
    changeSelect(e) {
      let list = [];
      e.forEach((v) => {
        if (
          this.$refs["cascader"]
            .getCheckedNodes()
            .findIndex((item) => item.value === v) > -1
        ) {
          list.push(
            this.$refs["cascader"]
              .getCheckedNodes()
              .find((v1) => v1.value === v)
          );
          this.totalMoney += Number(
            this.$refs["cascader"]
              .getCheckedNodes()
              .find((v1) => v1.value === v).data.last_money
          );
        }
      });

      this.securityList = list.map((v) => ({
        label: v.label,
        value: v.value,
      }));
    },
    removeTag(e) {
      this.leagueForm.security_ids = this.leagueForm.security_ids.filter(
        (v) => v !== e
      );
    },
  },
  // updated() {
  //   let total = 0;
  //   this.leagueForm.user_ids.forEach((v) => {
  //     this.$refs["cascader"].getCheckedNodes().forEach((v1) => {
  //       // console.log("v1", v1);
  //       if (v1.value === v) {
  //         total += Number(v1.data.last_money);
  //       }
  //     });
  //   });
  //   this.totalMoney = total;
  // },
};
</script>

<style lang="less" scoped></style>
