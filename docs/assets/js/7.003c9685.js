(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{154:function(t,e,s){},159:function(t,e,s){"use strict";var a=s(154);s.n(a).a},172:function(t,e,s){"use strict";s.r(e);var a={components:{LeoImport:s(150).LeoImport},data:function(){return{title:"导入工资表",visible:!1,template:"/leovue/static/import/employees.xls",data:"",employees:[{name:"张三",age:28,salary:4500,post:"专员",dept:"行政"},{name:"李四",age:30,salary:5300,post:"设计师",dept:"设计"},{name:"王五",age:29,salary:4200,post:"前台",dept:"行政"},{name:"麻六",age:25,salary:4600,post:"专员",dept:"行政"},{name:"吴七",age:24,salary:4400,post:"专员",dept:"设计"},{name:"赵钱孙",age:28,salary:5200,post:"设计师",dept:"设计"},{name:"郭巨侠",age:31,salary:6100,post:"经理",dept:"行政"},{name:"李大嘴",age:36,salary:8e3,post:"总经理",dept:"行政"},{name:"钱贵",age:27,salary:3900,post:"专员",dept:"设计"},{name:"孙无忌",age:26,salary:5400,post:"主管",dept:"行政"}]}},methods:{open:function(){this.visible=!0},insert:function(t){this.employees=this.employees.concat(t)}}},n=(s(159),s(0)),o=Object(n.a)(a,function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"leo-import"}},[s("leo-import",{attrs:{title:t.title,visible:t.visible,template:t.template},on:{"update:visible":function(e){t.visible=e},insert:t.insert}}),t._v(" "),s("button",{on:{click:t.open}},[t._v("导入")]),t._v(" "),s("table",[s("caption",[t._v("工资表")]),t._v(" "),t._m(0),t._v(" "),s("tbody",t._l(t.employees,function(e,a){return s("tr",{key:a},[s("td",[t._v(t._s(a+1))]),t._v(" "),s("td",[t._v(t._s(e.name))]),t._v(" "),s("td",[t._v(t._s(e.age))]),t._v(" "),s("td",[t._v(t._s(e.salary))]),t._v(" "),s("td",[t._v(t._s(e.post))]),t._v(" "),s("td",[t._v(t._s(e.dept))])])})),t._v(" "),t._m(1)])],1)},[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("tr",[s("th",[t._v("#")]),t._v(" "),s("th",[t._v("姓名")]),t._v(" "),s("th",[t._v("年龄")]),t._v(" "),s("th",[t._v("工资")]),t._v(" "),s("th",[t._v("岗位")]),t._v(" "),s("th",[t._v("部门")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("tfoot",[e("tr",[e("td",[this._v("月份：")]),this._v(" "),e("td",{attrs:{colspan:"2"}},[this._v("2018年7月")]),this._v(" "),e("td",[this._v("制表：")]),this._v(" "),e("td",{attrs:{colspan:"2"}},[this._v("张三")])])])}],!1,null,"e15761f2",null);o.options.__file="LabsLeoImport.vue";e.default=o.exports}}]);