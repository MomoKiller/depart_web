webpackJsonp([4],{"9/IN":function(t,e){},EzFG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("KH7x"),i=a.n(r),n=a("dNAe"),s=[{key:0,value:"待审核"},{key:1,value:"已审核"},{key:2,value:"已拒绝"},{key:3,value:"已撤销"}],o={components:{LeagueItem:a("d17n").a},data:function(){return{queryControl:{year:new Date},pageControl:{pageNumber:1,pageSize:10,total:0},info:{},tableData:[],departActivities:[],flag:!1}},filters:{statusFilter:function(t){var e=s.filter(function(e){return e.key==t});return i()(e,1)[0].value}},created:function(){this.query(this.pageControl.pageNumber)},methods:{getList:function(){this.query(this.pageControl.pageNumber)},query:function(t){var e=this;this.pageControl.pageNumber=t,Object(n.e)({page:this.pageControl.pageNumber,limit:this.pageControl.pageSize,year:new Date(this.queryControl.year).getFullYear()}).then(function(t){t&&(e.flag=!0,e.tableData=t.list?t.list.data:[],e.departActivities=t.departActivities?t.departActivities:[],e.info=t.list?{depart:t.info}:{},e.pageControl.total=t.list?t.list.total:0)})},handleCurrentChange:function(t){this.query(t)},handleSizeChange:function(t){this.pageControl.pageSize=t,this.query(1)},showDetail:function(){this.$router.push({path:"/myleague_detail",query:{year:new Date(this.queryControl.year).getFullYear()}})},revoke:function(t){var e=this;this.$confirm("确定撤销此次团建吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(n.c)({act_id:t}).then(function(t){t&&(e.$message.success("撤销成功"),e.getList())})}).catch(function(){})},rowClick:function(t){this.$router.push("/league_detail?id="+t.id+"&type=1")}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrap"},[a("section",{staticClass:"out_wrap"},[a("div",{staticClass:"search mb22 flex_between"},[a("div",{staticClass:"daily-title fs14 bold"}),t._v(" "),a("div",[a("el-date-picker",{staticStyle:{"margin-right":"10px"},attrs:{type:"year",placeholder:"选择年份",editable:!1,clearable:!1,disabled:!1,"picker-options":t.$pickOption(1)},on:{change:function(e){return t.query(1)}},model:{value:t.queryControl.year,callback:function(e){t.$set(t.queryControl,"year",e)},expression:"queryControl.year"}}),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.$router.push("/direct_create")}}},[t._v("发起团建")]),t._v(" "),a("el-button",{attrs:{plain:""},on:{click:function(e){return t.$router.push("/system")}}},[t._v("团建制度")])],1)]),t._v(" "),t.departActivities&&t.departActivities.length>0?a("el-table",{staticClass:"w100",attrs:{data:t.departActivities,"row-key":"id",border:"",lazy:"","tree-props":{children:"children",hasChildren:"hasChildren"},"tooltip-effect":"dark"}},[a("el-table-column",{attrs:{fixed:"",prop:"name",label:"部门名称","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"company_name",label:"部门层级","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.level)+"级部门")]}}],null,!1,823388231)}),t._v(" "),a("el-table-column",{attrs:{prop:"user_count",label:"部门人数","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"ava_direction_user_count",label:"可定向团建人数","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"activity_user_count",label:"已团建人数","show-overflow-tooltip":""}})],1):t._e()],1),t._v(" "),a("section",{staticClass:"out_wrap mt20"},[t._m(0),t._v(" "),t.flag&&t.tableData.length?a("el-table",{staticClass:"w100",attrs:{data:t.tableData,"row-key":"id","tooltip-effect":"dark"},on:{"row-click":t.rowClick}},[a("el-table-column",{attrs:{fixed:"",prop:"name",label:"活动主题","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"user_name",label:"发起人","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.user_name))]}}],null,!1,3593318068)}),t._v(" "),a("el-table-column",{attrs:{prop:"user_count",label:"时间","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(e.row.start_date+"~"+e.row.end_date))]}}],null,!1,2305235788)}),t._v(" "),a("el-table-column",{attrs:{prop:"status",label:"审核状态","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(t._s(t._f("statusFilter")(e.row.status)))]}}],null,!1,2840606276)}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[3===e.row.cost_status?a("el-link",{attrs:{type:"primary",underline:!1},on:{click:function(a){return a.stopPropagation(),t.$router.push("/reimbursementDetails?id="+e.row.id+"&type=2&isChange=1")}}},[t._v("已报销")]):t._e(),t._v(" "),2===e.row.cost_status&&1===e.row.status?a("el-link",{attrs:{type:"primary",underline:!1},on:{click:function(a){return a.stopPropagation(),t.$router.push("/reimbursementDetails?id="+e.row.id+"&type=2&isChange=1")}}},[t._v("查看报销进度")]):1===e.row.cost_status&&0===e.row.status?a("el-link",{attrs:{type:"warning",underline:!1},on:{click:function(a){return a.stopPropagation(),t.revoke(e.row.id)}}},[t._v("撤销备案")]):1===e.row.cost_status&&1===e.row.status?a("el-link",{attrs:{type:"primary",underline:!1},on:{click:function(a){return a.stopPropagation(),t.$router.push("/league_reimburse?id="+e.row.id+"&type=2")}}},[t._v("去报销")]):t._e()]}}],null,!1,93561622)})],1):t._e(),t._v(" "),t.flag&&!t.tableData.length?a("div",{staticClass:"flex_center c9"},[t._v("暂无数据")]):t._e(),t._v(" "),t.tableData.length>0?a("el-pagination",{attrs:{background:"",layout:"total, sizes, prev, pager, next, jumper","current-page":t.pageControl.pageNumber,"page-size":t.pageControl.pageSize,"page-sizes":t.pagesizes,total:t.pageControl.total},on:{"current-change":t.handleCurrentChange,"size-change":t.handleSizeChange}}):t._e()],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"search mb22 flex_between"},[e("div",{staticClass:"daily-title fs14 bold"},[this._v("活动明细")])])}]};var u=a("C7Lr")(o,l,!1,function(t){a("9/IN")},"data-v-5d9c811d",null);e.default=u.exports},d17n:function(t,e,a){"use strict";var r=a("dNAe"),i={props:{item:{type:Object,default:function(){return{}}},type:{type:Number,default:1}},methods:{revoke:function(t){var e=this;this.$confirm("确定撤销此次团建吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(r.c)({act_id:t}).then(function(t){t&&(e.$message.success("撤销成功"),e.$emit("getList"))})}).catch(function(){})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"league-item bf1",on:{click:function(e){return t.$router.push("/league_detail?id="+t.item.id+"&type="+t.type)}}},[a("el-row",{staticClass:"item-top",attrs:{gutter:20}},[a("el-col",{attrs:{span:5}},[a("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.item.name,placement:"top"}},[a("span",{staticClass:"ellipsis"},[t._v(t._s(t.item.name))])])],1),t._v(" "),a("el-col",{attrs:{span:5}},["活动"!=t.item.activity_type?a("el-tag",{attrs:{type:"success"}},[t._v(t._s(t.item.activity_type))]):t._e(),t._v(" "),"活动"==t.item.activity_type?a("el-tag",{attrs:{type:"success"}},[t._v("活动 ("+t._s(t.item.other)+")")]):t._e()],1),t._v(" "),1===t.item.is_activity?a("el-col",{attrs:{span:5}},[0===t.item.status?a("span",[t._v("待审核")]):1===t.item.status?a("span",[t._v("已审核")]):2===t.item.status?a("span",[t._v("已拒绝")]):a("span",[t._v("已撤销")])]):t._e(),t._v(" "),1===t.item.is_activity?a("el-col",{attrs:{span:5}},[3===t.item.cost_status?a("span",[t._v("已报销")]):2===t.item.cost_status?a("span",[t._v("报销中")]):1===t.item.cost_status&&0===t.item.status?a("el-link",{attrs:{type:"warning",underline:!1},on:{click:function(e){return e.stopPropagation(),t.revoke(t.item.id)}}},[t._v("撤销")]):1===t.item.cost_status&&1===t.item.status?a("el-link",{attrs:{type:"primary",underline:!1},on:{click:function(e){return e.stopPropagation(),t.$router.push("/league_reimburse?id="+t.item.id+"&type="+t.type)}}},[t._v("去报销")]):t._e()],1):t._e(),t._v(" "),1===t.item.is_activity&&t.item.ava_money?a("el-col",{attrs:{span:4}},[2===t.item.cost_status&&1===t.item.status?a("el-link",{attrs:{type:"primary",underline:!1},on:{click:function(e){return e.stopPropagation(),t.$router.push("/reimbursementDetails?id="+t.item.id+"&type="+t.type+"&isChange=1")}}},[t._v("查看报销进度")]):t._e()],1):t._e()],1),t._v(" "),a("el-row",{staticClass:"item-bottom",attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("span",{staticStyle:{"margin-right":"50px"}},[t._v(t._s(t.item.user_name)+"发起")]),t._v(" "),a("span",[t._v(t._s(t.item.user_num||0)+"人参与")])]),t._v(" "),t.item.pay_in_advance?a("el-col",{attrs:{span:6}},[a("span",[t._v("预估团建费用："+t._s(t._f("number")(t.item.pay_in_advance))+"元")])]):t._e(),t._v(" "),a("el-col",{attrs:{span:6}},[a("span",[t._v(t._s(t.item.start_date+"~"+t.item.end_date))])])],1)],1)},staticRenderFns:[]};var s=a("C7Lr")(i,n,!1,function(t){a("r3Gb")},"data-v-d8124e68",null);e.a=s.exports},r3Gb:function(t,e){}});