<template>
  <div class="out_wrap">
    <p class="right">
      <el-button type="primary" @click="add">添加管理员</el-button>
    </p>
    <el-table :data="tableData" class="w100" tooltip-effect="dark">
      <el-table-column prop="name" label="管理员" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="权限" min-width="200">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.str_nodes" :key="index" size="small">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <a class="edit" @click="edit(scope.row)">编辑</a>
          <a class="del" @click="del(scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="tableData.length > 0" background layout="total, prev, pager, next, jumper" :current-page="pageControl.pageNumber" :page-size="pageControl.pageSize" :page-sizes="pagesizes" :total="pageControl.total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
    <el-dialog :title="mode == 1 ? '添加管理员' : '编辑管理员'" :visible.sync="visible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="管理员：" prop="user_id" v-if="mode == 1">
          <el-select v-model="ruleForm.user_id" clearable filterable placeholder="请选择管理员" class="w100">
            <el-option v-for="(item, index) in adminArr" :key="index" :label="item.name" :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员：" v-else>
          <el-input type="text" v-model="ruleForm.name" placeholder="管理员名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="power">
          <el-select v-model="ruleForm.power" clearable filterable multiple placeholder="请选择权限" class="w100">
            <el-option v-for="(item, index) in nodeArr" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {queryAdmin, queryNode, queryPreAdmin} from '@/util/api_common';

export default {
  data(){
    return {
      pageControl: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      adminArr: [],
      nodeArr: [],
      mode: 1,// 1-新建 2-编辑
      visible: false,
      ruleForm: {},
      rules: {
        user_id: [{required: true, message: '请选择管理员', trigger: 'change'}],
        power: [{required: true, message: '请选择权限', trigger: 'change'}]
      }
    };
  },
  created(){
    this.query(this.pageControl.pageNumber);
    queryNode().then(data => {
      if(data){
        this.nodeArr = data;
      }
    })
  },
  methods: {
    query(pg){
      this.pageControl.pageNumber = pg;
      queryAdmin({page: pg, limit: this.pageControl.pageSize}).then(data => {
        if(data){
          this.tableData = data.data;
          this.pageControl.total = data.total;
        }
      })
    },
    handleCurrentChange(val){
      this.query(val);
    },
    handleSizeChange(val){
      this.pageControl.pageSize = val;
      this.query(1);
    },
    add(){
      queryPreAdmin().then(data => {
        if(data){
          this.adminArr = data;
          this.mode = 1;
          this.ruleForm = {};
          this.visible = true;
          this.$nextTick(() => {
            this.$refs.ruleForm.clearValidate(['user_id', 'power']);
          })
        }
      })
    },
    edit(item){
      this.mode = 2;
      item.power = [...item.str_nodes.map(d => d.id)];
      this.ruleForm = {...item};
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(['user_id', 'power']);
      })
    },
    del(item){
      this.$confirm('确定删除该管理员吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/adminapi/role/del_admin', {id: item.id}).then(data => {
          if(data){
            this.$message({type: 'success', message: '删除成功!'});
            this.query(this.pageControl.pageNumber);
          }
        })
      }).catch(() => {});
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.$http.post(this.mode == 1 ? '/adminapi/role/add_admin' : '/adminapi/role/edit_admin', this.mode == 1 ? {
            user_id: this.ruleForm.user_id,
            node: this.ruleForm.power.toString()
          } : {
            id: this.ruleForm.id,
            node: this.ruleForm.power.toString()
          }).then(data => {
            if(data){
              this.$message({type: 'success', message: this.mode == 1 ? '添加成功' : '编辑成功'});
              this.query(this.pageControl.pageNumber);
              this.visible = false;
            }
          })
        }else{}
      });
    }
  }
}
</script>

<style lang="less" scoped></style>
