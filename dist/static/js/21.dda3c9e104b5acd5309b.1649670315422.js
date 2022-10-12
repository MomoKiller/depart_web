webpackJsonp([21],{Cl5O:function(t,e){},"S+ET":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=a("beg3"),o=a("YO/D"),r=a("Fdjv"),n={data:function(){return{queryControl:{year:new Date,company_id:"",depart_id:"",keyword:"",user_status:""},pageControl:{pageNumber:1,pageSize:10,total:0},num:0,money:0,tableData:[],visible:!1,tableDetailsData:[],pageDetailControl:{pageNumber:1,pageSize:10,total:0},details:[]}},created:function(){this.query(this.pageControl.pageNumber)},methods:{query:function(t){var e=this;this.pageControl.pageNumber=t,this.$http.get("/adminapi/cost/cost_list",{page:t,limit:this.pageControl.pageSize,company_id:this.queryControl.company_id,depart_id:this.queryControl.depart_id,year:new Date(this.queryControl.year).getFullYear(),keyword:this.queryControl.keyword,user_status:this.queryControl.user_status}).then(function(t){t&&(e.tableData=t.list.data,e.pageControl.total=t.list.total,e.num=t.total_num,e.money=t.total_money)})},handleCurrentChange:function(t){this.query(t)},handleSizeChange:function(t){this.queryControl.pageSize=t,this.query(1)},exportFile:function(){var t={company_id:this.queryControl.company_id,depart_id:this.queryControl.depart_id,year:new Date(this.queryControl.year).getFullYear(),keyword:this.queryControl.keyword};Object(r.d)("/adminapi/cost/export_cost_list",t,"费用管理数据.xls")},handleViewDetails:function(t){this.details=t,this.tableDetailsData=[],this.getCostDetailList()},getCostDetailList:function(){var t=this;this.$http.get("/adminapi/cost/cost_detail_list",{page:this.pageDetailControl.pageNumber,limit:this.pageDetailControl.pageSize,year:new Date(this.queryControl.year).getFullYear(),user_id:this.details.user_id}).then(function(e){e&&(t.tableDetailsData=e.list.data,t.pageDetailControl.total=e.list.total,t.visible=!0)})},handleDetailCurrentChange:function(t){this.pageDetailControl.pageNumber=t,this.getCostDetailList()}},components:{ComCompany:l.a,ComProject:o.a}},i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"out_wrap"},[a("div",{staticClass:"flex_between search mb22"},[a("div",{staticClass:"left"},[a("el-date-picker",{attrs:{type:"year",placeholder:"选择年份",editable:!1,clearable:!1,disabled:!1,"picker-options":t.$pickOption(1)},on:{change:function(e){return t.query(1)}},model:{value:t.queryControl.year,callback:function(e){t.$set(t.queryControl,"year",e)},expression:"queryControl.year"}}),t._v(" "),a("com-company",{staticClass:"w150 inline",attrs:{id:t.queryControl.company_id},on:{Cchange:function(e){t.queryControl.company_id=e,t.query(1)}}}),t._v(" "),a("com-project",{staticClass:"w150 inline",attrs:{id:t.queryControl.depart_id},on:{Dchange:function(e){t.queryControl.depart_id=e,t.query(1)}}}),t._v(" "),a("el-input",{staticClass:"w150 inline",attrs:{placeholder:"姓名/工号",clearable:""},on:{change:function(e){return t.query(1)}},model:{value:t.queryControl.keyword,callback:function(e){t.$set(t.queryControl,"keyword",e)},expression:"queryControl.keyword"}}),t._v(" "),a("el-select",{staticClass:"w150 inline",attrs:{clearable:"",placeholder:"请选择"},on:{change:function(e){return t.query(1)}},model:{value:t.queryControl.user_status,callback:function(e){t.$set(t.queryControl,"user_status",e)},expression:"queryControl.user_status"}},[a("el-option",{attrs:{label:"在职",value:3}}),t._v(" "),a("el-option",{attrs:{label:"离职",value:4}})],1)],1),t._v(" "),a("div",{staticClass:"right"},[a("el-button",{attrs:{type:"primary"},on:{click:t.exportFile}},[t._v("导出")])],1)]),t._v(" "),a("div",{staticClass:"fs16 bf1 mb22",staticStyle:{padding:"15px 30px"}},[a("span",[t._v("人数："),a("span",{staticClass:"bold"},[t._v(t._s(t.num||0)+"人")])]),t._v(" "),a("span",{staticClass:"ml20"},[t._v("日常团建经费："),a("span",{staticClass:"bold"},[t._v(t._s(t.money||"0.00")+"元")])])]),t._v(" "),a("el-table",{staticClass:"w100",attrs:{data:t.tableData,"tooltip-effect":"dark"}},[a("el-table-column",{attrs:{fixed:"",prop:"name",label:"姓名",width:"100","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"company_name",label:"公司","min-width":"180","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"depart_name",label:"部门","min-width":"180","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{label:"状态",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[3==e.row.user_status?a("div",[a("span",{staticClass:"ableBadge"}),t._v("在职\n        ")]):t._e(),t._v(" "),4==e.row.user_status?a("div",[a("span",{staticClass:"disBadge"}),t._v("离职\n        ")]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"entry_time",label:"入职日期",width:"120","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"leave_date",label:"离职日期",width:"120","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.leave_date||"-"))]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"last_money",label:"日常团建经费",width:"120","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.last_money))]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"70"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("a",{staticClass:"active_color",on:{click:function(a){return t.handleViewDetails(e.row)}}},[t._v("详情")])]}}])})],1),t._v(" "),t.tableData.length>0?a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next, jumper","current-page":t.pageControl.pageNumber,"page-size":t.pageControl.pageSize,"page-sizes":t.pagesizes,total:t.pageControl.total},on:{"current-change":t.handleCurrentChange,"size-change":t.handleSizeChange}}):t._e(),t._v(" "),a("el-dialog",{attrs:{title:t.details.name+" 团建费用发放及使用记录",width:"800px",visible:t.visible},on:{"update:visible":function(e){t.visible=e}}},[a("el-table",{attrs:{data:t.tableDetailsData,"row-key":"id",border:""}},[a("el-table-column",{attrs:{prop:"reason",label:"费用发放/使用记录","header-align":"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"money",label:"金额（元）",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"day",label:"时间",align:"center"}})],1),t._v(" "),t.tableDetailsData.length>0?a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":t.pageDetailControl.pageNumber,"page-size":t.pageDetailControl.pageSize,total:t.pageDetailControl.total},on:{"current-change":t.handleDetailCurrentChange}}):t._e()],1)],1)},staticRenderFns:[]};var s=a("C7Lr")(n,i,!1,function(t){a("Cl5O")},"data-v-14206930",null);e.default=s.exports}});