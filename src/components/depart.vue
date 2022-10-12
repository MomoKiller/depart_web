<template>
  <div class="w100">
    <el-cascader v-model="child_depart_id" clearable filterable placeholder="请选择部门" :options="optionArr" :props="{checkStrictly: true, label: 'name', emitPath: false}" :collapse-tags="false" :show-all-levels="false" class="w100" @change="departChange"></el-cascader>
  </div>
</template>

<script>
import {queryDepart} from '@/util/api_common';

export default {
  data(){
    return {
      child_depart_id: this.id,
      optionArr: []
    };
  },
  props: {
    id: {
      type: [Array, String, Number],
      default(){return [];}
    }
  },
  watch: {
    id: {
      handler(newValue){
        this.child_depart_id = newValue;
      }
    }
  },
  methods: {
    departChange(){
      this.$emit('Dchange', this.child_depart_id);
    },
    getData(){
      queryDepart().then(data => {
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
