<template>
  <div class="index_wrap w100 flex">
    <div class="index_wrap_box white mr15 flex1">
      <div class="head flex_between mb35">
        <span class="fs16 bold">我的费用</span>
        <span class="more c9 pointer" @click="$router.push('/myleague')">查看更多 <i class="el-icon-arrow-right"></i></span>
      </div>
      <div><span>可用团建费：</span><span class="fs18 bold">{{info.last_money || '0.00'}}元</span></div>
    </div>
    <div class="index_wrap_box white flex1">
      <div class="head flex_between mb35">
        <span class="fs16 bold">我的团建</span>
        <span class="more c9 pointer" @click="$router.push('/myleague')">查看更多 <i class="el-icon-arrow-right"></i></span>
      </div>
      <div v-if="flag && tableData.length">
        <div class="flex_between pointer" v-for="(item, index) in tableData" :key="index" @click="$router.push({path: '/league_detail', query: {id: item.id}})">
          <div class="left ellipsis flex1" :title="item.name">{{item.name}}</div>
          <div class="right ml20">
            <el-tag v-if="item.activity_type != '活动'" class="mr15">{{item.activity_type}}</el-tag>
            <el-tooltip effect="dark" :content="item.other" placement="top">
              <el-tag v-if="item.activity_type == '活动'" class="mr15">活动</el-tag>
            </el-tooltip>
            <i class="el-icon-arrow-right c9"></i>
          </div>
        </div>
      </div>
      <div v-if="flag && !tableData.length" class="flex_center c9">暂无数据</div>
    </div>
  </div>
</template>

<script>
import {myActivity} from '@/util/api_common';

export default {
  data(){
    return {
      flag: false,
      info: {},
      tableData: []
    };
  },
  created(){
    this.query();
  },
  methods: {
    query(){
      myActivity({page: 1, limit: 3, year: new Date().getFullYear()}).then(data => {
        if(data){
          this.flag = true;
          this.info = data.account;
          this.tableData = data.list.data;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.index_wrap{
  flex-wrap: wrap;
  .index_wrap_box{
    min-height: 150px;
    border-radius: 10px;
    padding: 30px;
    .head{
      .more:hover{
        color: #2d8cf0;
      }
    }
  }
}
</style>
