(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{164:function(t,o,e){},170:function(t,o,e){"use strict";e(164)},183:function(t,o,e){"use strict";e.r(o);e(34);var i={components:{LeoLodop:e(159).LeoLodop},data:function(){return{visible:!1,lodop:"http://localhost:8000/CLodopfuncs.js",newLodop:"",data:[{id:1,name:"西阁码农",site:"www.woodso.com"},{id:2,name:"Vue.js",site:"cn.vuejs.org"},{id:3,name:"GitHub",site:"www.github.com"}],templates:[{id:1,label:"accounts",name:"A4竖版",bio:"自适应纸张",url:"/leovue/static/lodop/site-a4.html",engine:"dot",format:"TABLE",params:{left:"7.5%",top:"7.5%",width:"RightMargin:7.5%",height:"BottomMargin:7.5%"},default:!1},{id:2,label:"accounts",name:"POS小票",bio:"80mm热敏纸",url:"/leovue/static/lodop/site-80mm.html",engine:"dot",format:"HTM",params:{left:"5%",top:"1.0cm",width:"RightMargin:5%",height:"BottomMargin:1.0cm"},default:!0}]}},mounted:function(){this.newLodop=this.lodop},methods:{print:function(){this.lodop=this.newLodop,this.visible=!0}}},n=(e(170),e(0)),s=Object(n.a)(i,(function(){var t=this,o=t._self._c;return o("div",{attrs:{id:"leo-lodop"}},[o("table",[t._m(0),t._v(" "),o("tbody",t._l(t.data,(function(e){return o("tr",{key:e.id},[o("td",[t._v(t._s(e.id))]),t._v(" "),o("td",[t._v(t._s(e.name))]),t._v(" "),o("td",[t._v(t._s(e.site))])])})),0)]),t._v(" "),o("div",[o("small",[t._v("LODOP：")]),o("input",{directives:[{name:"model",rawName:"v-model",value:t.newLodop,expression:"newLodop"}],staticClass:"new-lodop",attrs:{type:"text"},domProps:{value:t.newLodop},on:{input:function(o){o.target.composing||(t.newLodop=o.target.value)}}}),t._v(" "),o("button",{on:{click:t.print}},[t._v("打印")])]),t._v(" "),o("leo-lodop",{attrs:{visible:t.visible,title:"网站列表",data:t.data,templates:t.templates,lodop:t.lodop},on:{"update:visible":function(o){t.visible=o}}})],1)}),[function(){var t=this._self._c;return t("thead",[t("tr",[t("th",[this._v("编号")]),this._v(" "),t("th",[this._v("名称")]),this._v(" "),t("th",[this._v("网址")])])])}],!1,null,"258de983",null);o.default=s.exports}}]);