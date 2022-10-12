<template>
  <div class="_config flex">
    <div class="config_left white mr15">
      <p class="right">
        <el-button type="primary" size="small" @click="add">新增团建类型</el-button>
      </p>
      <el-table :data="tableData" class="w100" tooltip-effect="dark">
        <el-table-column prop="name" label="团建类型" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <a class="edit" @click="edit(scope.row)">编辑</a>
            <a class="del" @click="del(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="mode == 1 ? '新增团建类型' : '编辑团建类型'" :visible.sync="visible">
        <el-input type="text" v-model="editInfo.name" placeholder="请输入团建类型名称" clearable></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="config_right white flex1">
      <p class="fs16 bold">团建费计算</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="mb35">
        <el-form-item label="入职：" prop="send_day">
          <div class="flex_middle">
            当月<el-select v-model="ruleForm.send_day" placeholder="请选择" style="width: 100px;margin: 0 5px;" clearable filterable>
              <el-option v-for="item in 31" :key="item" :label="item" :value="item"></el-option>
            </el-select> 日(含)前入职,团建费下发。次月开始1日下发
          </div>
        </el-form-item>
        <el-form-item label="离职：" required>
          <div class="flex_middle">当月离职,扣除当月团建费</div>
        </el-form-item>
        <el-form-item label="清零：" required>
          <div class="flex_middle">元旦保留上年度剩余团建费用的30%</div>
        </el-form-item>
        <el-form-item label="额度：" prop="money">
          <el-input type="text" style="width: 230px;" placeholder="请输入额度" v-model="ruleForm.money" @input="numChange"><template slot="append">元/月</template></el-input>
        </el-form-item>
      </el-form>
      <p class="center">
        <el-button type="primary" @click="sub('ruleForm')">保存</el-button>
      </p>
    </div>
  </div>
</template>

<script>
import {typeList} from '@/util/api_common';

export default {
  data(){
    return {
      tableData: [],
      mode: 1,// 1-新增 2-修改
      visible: false,
      editInfo: {},
      ruleForm: {},
      rules: {
        send_day: [{required: true, message: '请选择日期', trigger: 'change'}],
        money: [{required: true, message: '请输入额度', trigger: 'change'}]
      }
    };
  },
  created(){
    this.query();
    this.queryConfig();
  },
  methods: {
    query(){
      typeList(1).then(data => {
        if(data){
          this.tableData = data;
        }
      })
    },
    queryConfig(){
      this.$http.post('/adminapi/set/get_config').then(data => {
        if(data){
          this.ruleForm = data;
        }
      })
    },
    add(){
      this.mode = 1;
      this.editInfo = {};
      this.visible = true;
    },
    edit(item){
      this.mode = 2;
      this.editInfo = {...item};
      this.visible = true;
    },
    del(item){
      this.$confirm('确定删除该团建类型吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/adminapi/set/del_type', {id: item.id}).then(data => {
          if(data){
            this.$message({type: 'success', message: '删除成功!'});
            this.query();
          }
        })
      }).catch(() => {});
    },
    submitForm(){
      if(!this.editInfo.name){
        this.$message('请输入团建类型名称');
        return false;
      }
      this.$http.post(this.mode == 1 ? '/adminapi/set/add_type' : '/adminapi/set/edit_type', this.mode == 1 ? {
        name: this.editInfo.name
      } : {
        id: this.editInfo.id,
        name: this.editInfo.name
      }).then(data => {
        if(data){
          this.$message({type: 'success', message: this.mode == 1 ? '新增成功' : '编辑成功'});
          this.query();
          this.visible = false;
        }
      })
    },
    numChange(){
      this.ruleForm.money = this.ruleForm.money.replace(/[^\d\.]/g, '');
      this.ruleForm.money = this.ruleForm.money.replace(/^\./g, '');
      this.ruleForm.money = this.ruleForm.money.replace(/\.{2,}/g, '.');
      this.ruleForm.money = this.ruleForm.money.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      this.ruleForm.money = this.ruleForm.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    },
    sub(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$http.post('/adminapi/set/update_config', {send_day: this.ruleForm.send_day, money: this.ruleForm.money}).then(data => {
            if(data){
              this.$message({type: 'success', message: '修改成功'});
              this.queryConfig();
            }
          })
        }else{}
      });
    }
  }
}
</script>

<style lang="less" scoped>
._config{
  overflow: hidden;
  .config_left,.config_right{
    min-width: 400px;
    height: auto;
    padding: 0 20px 20px;
  }
  .config_right{
    height: 355px;
  }
}
</style>
