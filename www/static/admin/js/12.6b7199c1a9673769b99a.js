webpackJsonp([12],{DShp:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("gyMJ"),i=n("UC6W"),o={components:{Button:i.Button,Table:i.Table,Page:i.Page,Form:i.Form,FormItem:i.FormItem,Input:i.Input},data:function(){var t=this;return{loading:!0,columns:[{title:"文章名称",key:"title"},{title:"分类",key:"category",render:function(t,e){return t("span",e.row.category.name)}},{title:"阅读量",key:"view",width:100,align:"center"},{title:"发布时间",key:"create_time",width:200,align:"center",render:function(t,e){return e.row.create_time?t("span",new Date(1e3*e.row.create_time).toLocaleString()):""}},{title:"操作",key:"action",width:150,align:"center",render:function(e,n){return e("div",[e("Button",{props:{type:"primary",size:"small",icon:"edit"},style:{marginRight:"5px"},on:{click:function(){t.$router.push({path:"/content/save",query:{slug:n.row.slug}})}}}),e("Button",{props:{type:"error",size:"small",icon:"trash-a"},on:{click:function(){confirm("确定要删除吗？")&&t.delete(n.row.id,n.index)}}})])}}],data:{},map:{page:1,key:"",all:1,pageSize:10,contentType:"post"}}},methods:{getList:function(){var t=this;this.loading=!0,a.d.getList(this.map).then(function(e){t.data=e.data,t.loading=!1})},delete:function(t,e){var n=this;a.d.delete(t).then(function(t){n.data.splice(e,1)})},changePage:function(t){this.map.page=t,this.getList()},add:function(){this.$router.push("/content/save")}},mounted:function(){this.getList()}},r={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Form",{ref:"formInline",attrs:{model:t.map,inline:""}},[n("div",{staticClass:"search"},[n("Button",{staticClass:"fl",attrs:{type:"primary",icon:"plus"},on:{click:t.add}},[t._v("发布文章")]),t._v(" "),n("FormItem",[n("Input",{attrs:{type:"text",placeholder:"关键字"},model:{value:t.map.key,callback:function(e){t.$set(t.map,"key",e)},expression:"map.key"}})],1),t._v(" "),n("FormItem",[n("Button",{attrs:{type:"primary"},on:{click:t.getList}},[t._v("查询")])],1)],1)]),t._v(" "),n("Table",{attrs:{border:"",loading:t.loading,columns:t.columns,data:t.data.data}}),t._v(" "),n("Page",{staticClass:"page",attrs:{total:t.data.count,"page-size":t.data.pagesize,"show-total":""},on:{"on-change":t.changePage}})],1)},staticRenderFns:[]},s=n("Z0/y")(o,r,!1,null,null,null);e.default=s.exports}});
//# sourceMappingURL=12.6b7199c1a9673769b99a.js.map