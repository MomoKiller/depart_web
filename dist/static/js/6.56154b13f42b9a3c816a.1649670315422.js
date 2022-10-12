webpackJsonp([6],{"9fM8":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("IHPB"),n=a.n(r),i=a("dNAe"),o={data:function(){return{child_ids:this.ids,optionArr:[],money:[],total:0}},props:{ids:{type:Array,default:function(){return[]}}},watch:{ids:{immediate:!0,deep:!0,handler:function(e){this.child_ids=[].concat(n()(this.ids))}}},methods:{userChange:function(e){var t=0;this.money=[].concat(n()(this.$refs.userSel.getCheckedNodes().map(function(e){return Number(e.data.last_money)}))).filter(function(e){return e}),this.money.forEach(function(e){t=parseFloat((t+e).toFixed(10))});var a={money:t,user:e};this.$emit("Uchange",a)},getData:function(){var e=this;Object(i.o)().then(function(t){t&&(e.optionArr=t)})},numAdd:function(e,t){var a,r,n;try{r=e.toString().split(".")[1].length}catch(e){r=0}try{n=t.toString().split(".")[1].length}catch(e){n=0}return(e*(a=Math.pow(10,Math.max(r,n)))+t*a)/a}},mounted:function(){this.getData()},updated:function(){var e=this,t=0;this.money=[].concat(n()(this.$refs.userSel.getCheckedNodes().map(function(e){return Number(e.data.last_money)}))).filter(function(e){return e}),this.money.forEach(function(a){t=e.numAdd(t,a)});var a={money:t,user:this.child_ids};this.$emit("Uchange",a)}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"w100"},[a("el-cascader",{ref:"userSel",staticClass:"w100",attrs:{clearable:"",filterable:"",placeholder:"请选择部门/员工",options:e.optionArr,props:{checkStrictly:!1,label:"name",emitPath:!1,multiple:!0,leaf:"last_money"},"show-all-levels":!1},on:{change:e.userChange},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.node;return[a("span",[r.data.user_id?a("i",{staticClass:"el-icon-user"}):e._e(),e._v("\n        "+e._s(r.label))])]}}]),model:{value:e.child_ids,callback:function(t){e.child_ids=t},expression:"child_ids"}})],1)},staticRenderFns:[]};var s={data:function(){var e=this;return{leagueForm:{range:[],user_ids:[],location:"",pay_in_advance:""},totalMoney:0,rules:{name:[{required:!0,message:"请输入团建主题",trigger:"change"}],type:[{required:!0,validator:function(t,a,r){a?e.optionArr.find(function(e){return"活动"==e.name})&&a==e.optionArr.find(function(e){return"活动"==e.name}).id&&!e.leagueForm.other?r(new Error("请标注活动内容")):r():r(new Error("请选择团建形式"))},trigger:"change"}],act_date:[{required:!0,message:"请选择团建时间",trigger:"change"}],pay_in_advance:[{required:!0,validator:function(t,a,r){""===a?r(new Error("请输入预估花费金额")):/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(a)?a>e.totalMoney?r(new Error("可用团建经费不足")):r():r(new Error("金额只能输入数字"))},trigger:"change"}],location:[{required:!0,message:"请输入地点",trigger:"change"}],desc:[{required:!0,message:"请详细描述此次团建的原因",trigger:"change"}]},optionArr:[],fileList:[],dialogVisible:!1,dialogImageUrl:""}},created:function(){var e=this;this.leagueForm.user_ids.push(JSON.parse(localStorage.getItem("info")).info.user_id),this.leagueForm.range.push(JSON.parse(localStorage.getItem("info")).info.user_id),Object(i.p)(2).then(function(t){t&&(e.optionArr=t)})},methods:{back:function(){var e=this;this.$confirm("确定返回吗？返回后已填写数据不会保留","返回提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$router.go(-1)}).catch(function(){})},submitForm:function(e){var t=this;this.$refs[e].validate(function(e){return!!e&&(t.leagueForm.range.length?void t.$http.post("/add_activity",{name:t.leagueForm.name,start_date:t.leagueForm.act_date[0],end_date:t.leagueForm.act_date[1],type:t.leagueForm.type,other:t.leagueForm.other||"",user_ids:t.leagueForm.range.toString(),desc:t.leagueForm.desc||"",location:t.leagueForm.location,pay_in_advance:t.leagueForm.pay_in_advance,attachment:[].concat(n()(t.fileList.map(function(e){return{file_name:e.name,file_path:e.url}})))}).then(function(e){e&&(t.$message({type:"success",message:"发起成功"}),t.$router.go(-1))}):(t.$message("请选择团建人员"),!1))})},typeChange:function(e){this.optionArr.find(function(e){return"活动"==e.name})&&this.leagueForm.type!=this.optionArr.find(function(e){return"活动"==e.name}).id&&(this.leagueForm.other="")},beforeUploadImg:function(e){var t=e.size/1024/1024<2;return t||this.$message.error("上传图片大小不能超过 2MB!"),t},uploadImage:function(e){var t=this;Object(i.q)(e.file).then(function(a){if(a){var r={name:e.file.name,url:a.path};t.fileList=[].concat(n()(t.fileList),[r])}})},handleRemove:function(e,t){var a=this.fileList.findIndex(function(t){return t.uid==e.uid});this.fileList.splice(a,1)},handleChange:function(e,t){},handlePictureCardPreview:function(e){this.dialogImageUrl=e.url,this.dialogVisible=!0},Uchange:function(e){this.totalMoney=parseFloat(e.money.toFixed(10)),this.leagueForm.range=e.user}},components:{ComUser:a("C7Lr")(o,l,!1,function(e){a("Bmgc")},"data-v-d98ae92a",null).exports}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"out_wrap"},[a("div",{staticClass:"center mb35 hidden"},[a("el-button",{staticClass:"fl",attrs:{size:"mini",round:""},on:{click:e.back}},[a("i",{staticClass:"el-icon-arrow-left"}),e._v("返回")])],1),e._v(" "),a("el-form",{ref:"ruleForm",staticClass:"mb35 wd700",attrs:{model:e.leagueForm,rules:e.rules,"label-width":"150px"}},[a("el-form-item",{attrs:{"label-width":"75px"}},[a("span",{staticClass:"fs18 bold"},[e._v("发起日常团建")])]),e._v(" "),a("el-form-item",{attrs:{label:"团建主题",prop:"name"}},[a("el-input",{attrs:{type:"text",placeholder:"部门+主题+内容，例如总裁办秘书组迎新团建去聚餐",clearable:"","show-word-limit":""},model:{value:e.leagueForm.name,callback:function(t){e.$set(e.leagueForm,"name",t)},expression:"leagueForm.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"团建形式",prop:"type"}},[a("div",{staticClass:"flex"},[a("div",{staticClass:"flex1"},[a("el-select",{staticClass:"w100",attrs:{clearable:"",filterable:"",placeholder:"请选择团建形式"},on:{change:e.typeChange},model:{value:e.leagueForm.type,callback:function(t){e.$set(e.leagueForm,"type",t)},expression:"leagueForm.type"}},e._l(e.optionArr,function(e,t){return a("el-option",{key:t,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!!e.optionArr.find(function(e){return"活动"==e.name})&&e.leagueForm.type==e.optionArr.find(function(e){return"活动"==e.name}).id,expression:"optionArr.find((d) => d.name == '活动')\n            ? leagueForm.type ==\n              optionArr.find((d) => d.name == '活动').id\n            : false"}],staticClass:"flex1 ml15"},[a("el-input",{attrs:{type:"text",placeholder:"请标注活动内容",clearable:""},model:{value:e.leagueForm.other,callback:function(t){e.$set(e.leagueForm,"other",t)},expression:"leagueForm.other"}})],1)])]),e._v(" "),a("el-form-item",{attrs:{label:"团建人员",required:""}},[a("com-user",{staticClass:"w100 inline",attrs:{ids:e.leagueForm.user_ids},on:{Uchange:e.Uchange}})],1),e._v(" "),a("el-form-item",{attrs:{label:""}},[a("div",[a("span",{staticStyle:{"padding-right":"50px"}},[e._v("已选团建人数："+e._s(e.leagueForm.range.length))]),e._v(" "),a("span",[e._v("可使用团建费用："+e._s(e.totalMoney)+"元")])])]),e._v(" "),a("el-form-item",{attrs:{label:"预估金额",prop:"pay_in_advance"}},[a("el-input",{attrs:{type:"text",placeholder:"请输入（不得高于可使用团建费）",clearable:"","show-word-limit":""},model:{value:e.leagueForm.pay_in_advance,callback:function(t){e.$set(e.leagueForm,"pay_in_advance",t)},expression:"leagueForm.pay_in_advance"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"团建地点",prop:"location"}},[a("el-input",{attrs:{type:"text",placeholder:"请输入地点",clearable:"","show-word-limit":""},model:{value:e.leagueForm.location,callback:function(t){e.$set(e.leagueForm,"location",t)},expression:"leagueForm.location"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"团建时间",prop:"act_date"}},[a("el-date-picker",{attrs:{type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",editable:!1,clearable:"","value-format":"yyyy-MM-dd"},model:{value:e.leagueForm.act_date,callback:function(t){e.$set(e.leagueForm,"act_date",t)},expression:"leagueForm.act_date"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"团建描述",prop:"desc"}},[a("el-input",{attrs:{type:"textarea",rows:5,placeholder:"请详细描述此次团建的原因",resize:"none"},model:{value:e.leagueForm.desc,callback:function(t){e.$set(e.leagueForm,"desc",t)},expression:"leagueForm.desc"}})],1),e._v(" "),a("el-form-item",[a("div",{staticClass:"flex"},[a("div",{staticClass:"label wd45"},[e._v("提示:")]),e._v(" "),a("div",{staticClass:"tips"},[a("div",[e._v("\n            1、团建过程中需拍摄至少1张集体照作为团建照片，报销流程中请上传\n          ")]),e._v(" "),a("div",[e._v("\n            2、参与人员中若有即将离职员工，则该笔费用需在该人员离职前提交报销申请\n          ")])])])]),e._v(" "),a("el-form-item",[a("el-button",{staticClass:"w160",attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("提交")])],1)],1),e._v(" "),a("el-dialog",{attrs:{visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("img",{attrs:{width:"100%",src:e.dialogImageUrl}})])],1)},staticRenderFns:[]};var u=a("C7Lr")(s,c,!1,function(e){a("fkSO")},"data-v-7ac825bb",null);t.default=u.exports},Bmgc:function(e,t){},fkSO:function(e,t){}});