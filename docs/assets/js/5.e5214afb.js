(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{152:function(t,e,n){},157:function(t,e,n){"use strict";var o=n(152);n.n(o).a},167:function(t,e,n){"use strict";n.r(e);var o={components:{LeoDialog:n(150).LeoDialog},data:function(){return{title:"Hello",content:"LeoVue",visible:!1}},methods:{open:function(){this.visible=!0},close:function(){this.visible=!1}}},i=(n(157),n(0)),l=Object(i.a)(o,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("leo-dialog",{attrs:{visible:t.visible,title:t.title},on:{close:t.close}},[n("div",{staticClass:"main"},[t._v(t._s(t.content))])]),t._v(" "),n("div",[n("label",{attrs:{for:"title"}},[t._v("标题")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:"text",name:"title"},domProps:{value:t.title},on:{input:function(e){e.target.composing||(t.title=e.target.value)}}})]),t._v(" "),n("div",[n("label",{attrs:{for:"content"}},[t._v("内容")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.content,expression:"content"}],attrs:{type:"text",name:"content"},domProps:{value:t.content},on:{input:function(e){e.target.composing||(t.content=e.target.value)}}})]),t._v(" "),n("button",{on:{click:t.open}},[t._v("开启对话框")])],1)},[],!1,null,"31b1ca07",null);l.options.__file="LabsLeoDialog.vue";e.default=l.exports}}]);