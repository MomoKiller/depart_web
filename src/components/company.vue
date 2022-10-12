<template>
  <div class="w100">
    <el-select v-model="child_company_id" clearable filterable class="w100" placeholder="请选择公司" @change="companyChange">
      <el-option v-for="(item, index) in optionArr" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import {queryCompany} from '@/util/api_common';

export default {
  data(){
    return {
      child_company_id: this.id,
      optionArr: []
    };
  },
  props: {
    id: {
      type: [String, Number],
      default(){return '';}
    }
  },
  watch: {
    id: {
      handler(newValue){
        this.child_company_id = newValue;
      }
    }
  },
  methods: {
    companyChange(){
      this.$emit('Cchange', this.child_company_id);
    },
    getData(){
      queryCompany().then(data => {
        if(data){
          this.optionArr = data;
        }
      })
    }
  },
  mounted(){
    this.getData();
  }
}
</script>

<style lang="less" scoped></style>
