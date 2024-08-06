"use strict";(self.webpackChunkbroker_dashboard=self.webpackChunkbroker_dashboard||[]).push([[9],{1968:(e,t,a)=>{a.d(t,{A:()=>c});var n=a(6338),s=a(4414);const{useState:l,useEffect:i}=a(9950);const c=function(e){let{startSeconds:t,isReverse:a,limit:c,goalTime:d,onFinish:r=(()=>{}),updateTime:o=(()=>{})}=e;const[u,h]=l();return i((()=>{h(t)}),[t]),i((()=>{const e=setInterval((()=>{u>=0&&h((e=>a?e-1:e+1))}),1e3);return o(u),c===u&&(clearInterval(e),r()),()=>clearInterval(e)}),[u]),(0,s.jsx)("span",{style:d?{color:(0,n.ve)(u,d)}:{},children:(0,n.od)(u)})}},1340:(e,t,a)=>{a.d(t,{A:()=>h});var n=a(9950),s=a(4064),l=a(8738),i=a.n(l),c=a(640),d=a(8342),r=a(6879);const o={textStyle:"DataTable_textStyle__tKKSk",itemContainer:"DataTable_itemContainer__TESDP",rowPadding:"DataTable_rowPadding__Vb9z2",headerRow:"DataTable_headerRow__2iwcE",itemRow:"DataTable_itemRow__KQavJ",itemColumn:"DataTable_itemColumn__P-GQu",phoneIcon:"DataTable_phoneIcon__GNg47",newTag:"DataTable_newTag__-tMul"};var u=a(4414);const h=function(e){let{columns:t,data:a,highlightClass:l,newTagClass:h,hoverClass:_,board:m,disableClick:x,disableNewTag:g,callBackOnOpen:f=(()=>{})}=e;const[j,v]=(0,n.useState)(),[A,N]=(0,n.useState)();return(0,u.jsxs)(s.A,{className:o.textStyle,vertical:!0,children:[(0,u.jsx)(s.A,{justify:"space-between",className:o.headerContainer,children:t.map(((e,t)=>(0,u.jsx)(s.A,{className:i()(o.headerRow,o.rowPadding),flex:0===t?1.3:.75,justify:e.align,children:e.title},e.key)))}),(0,u.jsx)(s.A,{justify:"space-between",className:o.itemContainer,vertical:!0,children:a.map(((e,a)=>(0,u.jsx)(s.A,{onClick:x?()=>{}:()=>{var t;t=e.key,N(t),f(t),v(!0)},className:i()(o.itemRow,o.rowPadding,_,{[l]:e.isNew}),align:"center",children:t.map(((t,a)=>{var n;return(0,u.jsxs)(s.A,{className:o.itemColumn,flex:0===a?1:.6,justify:t.align,align:"center",children:[0===a?(0,u.jsx)("span",{className:o.phoneIcon,children:(0,u.jsx)(c.E,{color:e.isNew?"#FFF":void 0})}):null,null!==t&&void 0!==t&&t.render?null===t||void 0===t?void 0:t.render(e[t.dataIndex],e):null===(n=e[t.dataIndex])||void 0===n?void 0:n.substring(0,t.maxLength||20),e[t.dataIndex].length>30?"...":"",0===a&&e.isNew&&!g?(0,u.jsx)(s.A,{justify:"center",align:"center",className:i()(o.newTag,h),children:d.A.Cards.new}):null]},t.key)}))},"".concat(e.key,"-").concat(a))))}),j?(0,u.jsx)(r.A,{show:j,handleClose:()=>{N(""),v(!1)},leadId:A,board:m}):null]})}},8009:(e,t,a)=>{a.r(t),a.d(t,{default:()=>re});var n=a(5465),s=a(718),l=a(4064),i=a(8871),c=a(9950),d=a(4051),r=a(326),o=a(4159),u=a.n(o),h=a(859),_=a(2746),m=a(2056);const x="Legends_legends__wL+8a",g="Legends_legendColor__J+nH6";var f=a(4414);const j=function(e){let{data:t}=e;return(0,f.jsx)(l.A,{vertical:!0,className:x,justify:"center",children:Object.entries(t).map(((e,t)=>{let[a,n]=e;return(0,f.jsxs)(l.A,{justify:"space-between",children:[(0,f.jsxs)(l.A,{align:"center",children:[(0,f.jsx)("span",{className:g,style:{backgroundColor:r._o[t]}}),a]}),(0,f.jsx)(l.A,{children:n})]})}))})};var v=a(976),A=function(){return A=Object.assign||function(e){for(var t,a=1,n=arguments.length;a<n;a++)for(var s in t=arguments[a])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e},A.apply(this,arguments)};const N=(0,c.forwardRef)((function(e,t){return c.createElement(v.c,A({},e,{chartType:"Pie",ref:t}))}));const w=function(e){let{data:t,total:a}=e;const n=Object.entries(t).map((e=>{let[t,a]=e;return{type:t,value:a}}));if(n.length>0){const e={width:300,height:300,data:n,angleField:"value",colorField:"type",paddingRight:0,innerRadius:.8,scale:{color:{palette:r._o}},label:!1,legend:!1,tooltip:!1,annotations:[{type:"text",style:{text:"Total",x:"50%",y:"35%",textAlign:"center",fontSize:15,fontStyle:"bold"}},{type:"text",style:{text:a.toString(),x:"50%",y:"50%",textAlign:"center",fontSize:70,fontStyle:"bold"}}]};return(0,f.jsx)(N,{...e})}return null},p="NewLeadsChart_card__yzgVT",{RangePicker:b}=_.A;const T=function(){const{newLeads:e,dateRange:t,handleChangeDates:a,submittedDeals:n}=(0,c.useContext)(i.r),[s,d]=(0,c.useState)({});return(0,c.useEffect)((()=>{if(!e)return;const t=null===e||void 0===e?void 0:e.reduce(((e,t)=>{const a=e,n=null===t.channel?"None":t.channel;return a[n]?a[n]+=1:a[n]=1,a}),{}),a=null===n||void 0===n?void 0:n.reduce(((e,t)=>{const a=e,n=null===t.channel?"None":t.channel;return a[n]?a[n]+=1:a[n]=1,a}),t);d(a)}),[e]),(0,f.jsx)(m.A,{className:p,title:"New Leads",extra:(0,f.jsx)(b,{value:t,placeholder:"Select Date Range",onChange:a,allowClear:!1,maxDate:u()(),format:"MM-DD-YYYY"}),children:(0,f.jsxs)(l.A,{justify:"space-around",children:[(0,f.jsx)(l.A,{children:(0,f.jsx)(w,{data:s,total:e.length+n.length})}),(0,f.jsx)(j,{data:s})]})})};var y=a(1340),D=a(6338),C=a(8738),S=a.n(C);const z={card:"NewLeadsQueue_card__OJRHa",tableContainer:"NewLeadsQueue_tableContainer__8j8jS",avgQueTitle:"NewLeadsQueue_avgQueTitle__Df7mK",avgTitle:"NewLeadsQueue_avgTitle__CaO8d",avgTime:"NewLeadsQueue_avgTime__jvxef",red:"NewLeadsQueue_red__bU1Dh",orange:"NewLeadsQueue_orange__wfttd",green:"NewLeadsQueue_green__pAAHt"};var L=a(1968);const k=(e,t)=>[{title:"Lead Name",dataIndex:"name",key:"name",maxLength:30},{title:"Time in",dataIndex:"time",key:"time",align:"center",render:(e,a)=>a.isNew?(0,f.jsx)(L.A,{startSeconds:e,limit:300,goalTime:t}):(0,D.od)(e)},{title:"Reassigned in",dataIndex:"reassingTime",key:"reassingTime",align:"center",render:(t,a)=>a.isNew?(0,f.jsx)(L.A,{startSeconds:t,isReverse:!0,limit:0,onFinish:e}):(0,D.od)(t)},{title:"Assigned To",dataIndex:"assignedTo",key:"assignedTo",align:"center"}];const P=function(){const{newLeads:e,goalTime:t,getNewLeadsData:a,dateRange:n}=(0,c.useContext)(i.r),s=e.filter((e=>e.isNew&&!e.isAllPassedTimer)),d=e.filter((e=>e.isAllPassedTimer||e.isTouched)),r=d.reduce(((e,t)=>e+=t.timeToRespond),0)/d.length;return(0,f.jsx)(m.A,{className:z.card,title:"Current Untouched Leads in Que",children:(0,f.jsxs)(l.A,{flex:1,vertical:!0,children:[(0,f.jsx)("div",{className:z.tableContainer,children:(0,f.jsx)(y.A,{columns:k((()=>{a(n)}),t),data:s,disableClick:!0,disableNewTag:!0,board:"leads"})}),(0,f.jsxs)(l.A,{vertical:!0,children:[(0,f.jsx)(l.A,{className:z.avgQueTitle,children:"Average Que Time"}),(0,f.jsxs)(l.A,{flex:1,children:[(0,f.jsxs)(l.A,{flex:.5,vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:z.avgTitle,children:"Actual for Today"}),(0,f.jsx)(l.A,{className:S()(z.avgTime,z[(0,D.ve)(r,t)]),children:d.length?(0,D.od)(r):"00:00"})]}),(0,f.jsxs)(l.A,{flex:.5,vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:z.avgTitle,children:"Goal"}),(0,f.jsx)(l.A,{className:z.avgTime,children:(0,D.od)(t)})]})]})]})]})})};const F=function(){return(0,f.jsxs)(l.A,{children:[(0,f.jsx)(T,{}),(0,f.jsx)(P,{})]})},R="NewDealsSubmitted_card__wCE4g",G="NewDealsSubmitted_dealCount__px0pk",I="NewDealsSubmitted_dealsPercent__iKYAW",E="NewDealsSubmitted_dealsGoal__90kxT";const Q=function(){const{newLeads:e,submittedDeals:t,dealGoal:a}=(0,c.useContext)(i.r),[n,s]=(0,c.useState)({});(0,c.useEffect)((()=>{if(!t)return;const e=null===t||void 0===t?void 0:t.reduce(((e,t)=>{const a=e,n=(0,D.MH)(t.column_values),s=null===n[r.zu.deals.channel]?"None":n[r.zu.deals.channel];return a[s]?a[s]+=1:a[s]=1,a}),{});s(e)}),[t]);const d=e.length>0?t.length/e.length*100:0,o=t.length/a*100;return(0,f.jsx)(m.A,{className:R,title:"New Deals Submitted",children:(0,f.jsxs)(l.A,{justify:"space-around",children:[(0,f.jsxs)(l.A,{vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:G,children:t.length}),(0,f.jsx)(l.A,{className:I,children:"".concat(d.toFixed(2),"% of Leads")}),(0,f.jsxs)(l.A,{className:E,children:["Goal:"," ",o.toFixed(2),"%"]})]}),(0,f.jsx)(l.A,{children:(0,f.jsx)(j,{data:n})})]})})},H="LeadsWithOfferToPitch_card__r55zt",M="LeadsWithOfferToPitch_dealCount__QR4e6",O="LeadsWithOfferToPitch_dealsGoal__wA+ks";const K=function(){const{submittedDeals:e}=(0,c.useContext)(i.r),t=e.filter((e=>"Offers Ready/Approved"===(0,D.MH)(e.column_values)[r.zu.deals.stage])),a=e.length>0?t.length/e.length*100:0;return(0,f.jsx)(m.A,{className:H,title:"Leads with offer to pitch",children:(0,f.jsxs)(l.A,{vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:M,children:t.length}),(0,f.jsxs)(l.A,{className:O,children:["(",a.toFixed(2),"% of Subs)"]})]})})},Y="TotalDeclines_card__-vNnE",B="TotalDeclines_dealCount__MY+xE",q="TotalDeclines_dealsGoal__St+b7";const W=function(){const{submittedDeals:e}=(0,c.useContext)(i.r),t=e.filter((e=>"DQ"===(0,D.MH)(e.column_values)[r.zu.deals.stage])),a=e.length>0?t.length/e.length*100:0;return(0,f.jsx)(m.A,{className:Y,title:"Total Declines",children:(0,f.jsxs)(l.A,{vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:B,children:t.length}),(0,f.jsxs)(l.A,{className:q,children:["(",a.toFixed(2),"% of Subs)"]})]})})};var J=a(1397),V=a.n(J);const U="NewDealsPitched_card__zEEst",X="NewDealsPitched_dealCount__fxMZ6",Z="NewDealsPitched_dealsPercent__ppbAe",$="NewDealsPitched_dealsGoal__Yo+i-";const ee=function(){const{submittedDeals:e,pitchedGoal:t}=(0,c.useContext)(i.r),[a,n]=(0,c.useState)({}),s=e.filter((e=>"v"===(0,D.MH)(e.column_values)[r.zu.deals.pitched]));(0,c.useEffect)((()=>{if(!s)return;const e=null===s||void 0===s?void 0:s.reduce(((e,t)=>{const a=e,n=(0,D.MH)(t.column_values),s=null===n[r.zu.deals.channel]?"None":n[r.zu.deals.channel];return a[s]?a[s]+=1:a[s]=1,a}),{});n(e)}),[e]);const d=e.length>0?s.length/e.length*100:0,o=s.length/t*100;return(0,f.jsx)(m.A,{className:U,title:"New Deals Pitched",children:(0,f.jsxs)(l.A,{justify:"space-around",children:[(0,f.jsxs)(l.A,{vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:X,children:s.length}),(0,f.jsx)(l.A,{className:Z,children:"".concat(d.toFixed(2),"% of Deals")}),(0,f.jsxs)(l.A,{className:$,children:["Goal:"," ",o.toFixed(2),"%"]})]}),(0,f.jsx)(l.A,{children:(0,f.jsx)(j,{data:a})})]})})},te="FundedDeals_card__YHQ+X",ae="FundedDeals_dealCount__+YXve",ne="FundedDeals_dealsGoal__CCn2A";const se=function(){const{submittedDeals:e}=(0,c.useContext)(i.r),t=e.filter((e=>e.subitems.find((e=>"Selected"===(0,D.MH)(e.column_values)[r.zu.subItem.status])))),a=e.length>0?t.length/e.length*100:0;return(0,f.jsx)(m.A,{className:te,title:"Funded",children:(0,f.jsxs)(l.A,{vertical:!0,align:"center",children:[(0,f.jsx)(l.A,{className:ae,children:t.length}),(0,f.jsxs)(l.A,{className:ne,children:["(",a.toFixed(2),"% of Subs)"]})]})})},le="FundedDealsAmount_card__qgB3J",ie="FundedDealsAmount_dealCount__mqUDs";const ce=function(){const{submittedDeals:e}=(0,c.useContext)(i.r),t=e.reduce(((e,t)=>{let a=e;const n=t.subitems.find((e=>"Selected"===(0,D.MH)(e.column_values)[r.zu.subItem.status]));if(n){const e=(0,D.MH)(n.column_values);a+=Number(e[r.zu.subItem.funding_amount])}return a}),0);return(0,f.jsx)(m.A,{className:le,title:"Funded Amount",children:(0,f.jsx)(l.A,{vertical:!0,align:"center",children:(0,f.jsxs)(l.A,{className:ie,children:["$",(0,D.qC)(t)]})})})};const de=function(){let e;const[t,a]=(0,c.useState)({}),[n,s]=(0,c.useState)([]),[o,_]=(0,c.useState)([]),[m,x]=(0,c.useState)([u()(),u()()]),g=(0,c.useRef)(),j=async e=>{const t=function(e){const t=e.map((e=>{let t=V().mapKeys(e.column_values,"id");t=V().mapValues(t,"text");const a=(0,D.oG)(e.column_values,r.zu.leads.last_lead_assigned),n=(0,D.oG)(e.column_values,r.zu.leads.creation_date),s=(0,D.oG)(e.column_values,r.zu.leads.new_lead_or_touched),l=(0,D.oG)(e.column_values,r.zu.leads.minutes_5),i="Not Touched yet"===t[r.zu.leads.new_lead_or_touched],c="Passed through all options"===t[r.zu.leads.new_lead_or_touched],d=null!==t[r.zu.leads.minutes_5],o="Touched"===t[r.zu.leads.new_lead_or_touched];let h=0;i&&null!==a&&void 0!==a&&a.changed_at&&(h=u()().diff(u()(null===a||void 0===a?void 0:a.changed_at),"seconds"));let _=0;return d?_=u()(null===l||void 0===l?void 0:l.changed_at).diff(u()(null===n||void 0===n?void 0:n.changed_at),"seconds"):o&&(_=u()(null===s||void 0===s?void 0:s.changed_at).diff(u()(null===n||void 0===n?void 0:n.changed_at),"seconds")),{key:e.id,name:e.name,stage:t[r.zu.leads.stage],isNew:i,isAllPassed:c,isAllPassedTimer:d,isTouched:o,reassingTime:h<=300?300-h:0,time:h,queueTime:t[r.zu.leads.time_in_the_que],channel:t[r.zu.leads.channel],timeToRespond:_,assignedTo:t[r.zu.leads.sales_rep]||"-"}}));return V().sortBy(t,"isNew").reverse()}(await(0,d.Hp)(e));s(t)},v=async e=>{const t=function(e){const t=e.map((e=>{let t=V().mapKeys(e.column_values,"id");return t=V().mapValues(t,"text"),{key:e.id,name:e.name,stage:t[r.zu.deals.stage],channel:t[r.zu.deals.channel],...t,...e}}));return V().sortBy(t,"isNew").reverse()}(await(0,d.Wr)(e));_(t)},A=async()=>{const e=await(0,d.C)();a(e)};return(0,c.useEffect)((()=>(A(),e=h.A.listen("events",A),()=>{e&&e()})),[]),(0,c.useEffect)((()=>{g.current=[u()(),u()()],j(m);const e=setInterval((()=>{j(g.current)}),1e3*r._K.performanceRefetchTime);return()=>{clearInterval(e)}}),[]),(0,c.useEffect)((()=>{v(m);const e=setInterval((()=>{v(g.current)}),1e3*r._K.performanceRefetchTime);return()=>{clearInterval(e)}}),[]),(0,f.jsx)(i.r.Provider,{value:{goalTime:+t[r.zu.metrics.leadGoal],dealGoal:+t[r.zu.metrics.leadSubmissionGoal],pitchedGoal:+t[r.zu.metrics.dealPitchGoal],newLeads:n,submittedDeals:o,dateRange:m,getNewLeadsData:j,getSubmittedDeals:v,handleChangeDates:e=>{x(e),j(e),v(e),g.current=e}},children:(0,f.jsxs)(l.A,{justify:"center",align:"center",vertical:!0,children:[(0,f.jsx)(F,{}),(0,f.jsxs)(l.A,{children:[(0,f.jsx)(l.A,{children:(0,f.jsx)(Q,{})}),(0,f.jsx)(l.A,{children:(0,f.jsx)(K,{})}),(0,f.jsx)(l.A,{children:(0,f.jsx)(W,{})})]}),(0,f.jsxs)(l.A,{children:[(0,f.jsx)(l.A,{children:(0,f.jsx)(ee,{})}),(0,f.jsx)(l.A,{children:(0,f.jsx)(se,{})}),(0,f.jsx)(l.A,{children:(0,f.jsx)(ce,{})})]})]})})};const re=function(){return(0,f.jsx)(n.Ay,{theme:{token:{fontFamily:"Poppins"},components:{Layout:{bodyBg:"#E1EFF2",headerBg:"#E1EFF2"}}},children:(0,f.jsxs)(s.A,{style:{padding:"0 8px 24px"},children:[(0,f.jsx)(de,{})," "]})})}}}]);