(this.webpackJsonpvizsurvey=this.webpackJsonpvizsurvey||[]).push([[0],{161:function(t,e,n){},162:function(t,e,n){},170:function(t,e,n){"use strict";n.r(e);var a=n(0),i=n.n(a),r=n(38),o=n.n(r),c=n(67),s=n(2),l=n(34),u=n(14),h=n.n(u),m=n(60),d=n(7),b=n(39),j=n(5),p=n(27),x=n(29),v=n(28),w=function(t){Object(p.a)(n,t);var e=Object(x.a)(n);function n(){return Object(d.a)(this,n),e.apply(this,arguments)}return n}(v.Enumify);w.word=new w,w.barchart=new w,w.calendar=new w,w._=w.closeEnum();var f=function(t){Object(p.a)(n,t);var e=Object(x.a)(n);function n(){return Object(d.a)(this,n),e.apply(this,arguments)}return n}(v.Enumify);f.none=new f,f.earlierAmount=new f,f.laterAmount=new f,f._=f.closeEnum();var g=function(t){Object(p.a)(n,t);var e=Object(x.a)(n);function n(){return Object(d.a)(this,n),e.apply(this,arguments)}return n}(v.Enumify);g.none=new g,g.drag=new g,g.titration=new g,g._=g.closeEnum();var O=function t(e){var n=e.treatmentId,a=e.position,i=e.viewType,r=e.interaction,o=e.variableAmount,c=e.amountEarlier,s=e.timeEarlier,l=e.dateEarlier,u=e.amountLater,h=e.timeLater,m=e.dateLater,b=e.maxAmount,j=e.maxTime,p=e.horizontalPixels,x=e.verticalPixels,v=e.leftMarginWidthIn,w=e.bottomMarginHeightIn,f=e.graphWidthIn,g=e.graphHeightIn,O=e.width,y=e.height,_=e.comment;Object(d.a)(this,t),this.treatmentId=n,this.position=a,this.viewType=i,this.interaction=r,this.variableAmount=o,this.amountEarlier=c,this.timeEarlier=s,this.dateEarlier=l,this.amountLater=u,this.timeLater=h,this.dateLater=m,this.maxAmount=b,this.maxTime=j,this.horizontalPixels=p,this.verticalPixels=x,this.leftMarginWidthIn=v,this.bottomMarginHeightIn=w,this.graphWidthIn=f,this.graphHeightIn=g,this.width=O,this.height=y,this.comment=_,this.highup=null,this.lowdown=null};var y=function(){function t(){Object(d.a)(this,t),this.fetchQuestions=function(t){return t=+t,Object(j.c)('treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,horizontal_pixels,vertical_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,comment\n1,1,word,none,none,500,2,,1000,3,,,10,,,,,,,,,"Read 2001 example, absolute size"\n2,1,barchart,none,none,500,2,,1000,3,,1000,10,480,480,0.5,0.5,6,6,6.5,6.5,"Read 2001 example, absolute size"\n3,1,barchart,drag,laterAmount,500,2,,1000,10,,1500,10,480,480,0.5,0.5,6,6,6.5,6.5,"Read 2001 example, absolute size"\n4,1,word,titration,laterAmount,500,2,,1000,3,,,10,,,,,,,,,"Read 2001 example, absolute size"\n5,1,barchart,titration,laterAmount,500,2,,1000,10,,1500,10,480,480,0.5,0.5,6,6,6.5,6.5,"Read 2001 example, absolute size"\n',(function(t){return new O({treatmentId:+(e=t).treatment_id,position:+e.position,viewType:w.enumValueOf(e.view_type),interaction:g.enumValueOf(e.interaction),variableAmount:f.enumValueOf(e.variable_amount),amountEarlier:+e.amount_earlier,timeEarlier:e.time_earlier?+e.time_earlier:void 0,dateEarlier:e.date_earlier?new Date(e.date_earlier):void 0,amountLater:+e.amount_later,timeLater:e.time_later?+e.time_later:void 0,dateLater:e.date_later?new Date(e.date_later):void 0,maxAmount:+e.max_amount,maxTime:+e.max_time,horizontalPixels:+e.horizontal_pixels,verticalPixels:+e.vertical_pixels,leftMarginWidthIn:+e.left_margin_width,bottomMarginHeightIn:+e.bottom_margin_height,graphWidthIn:+e.graph_width_in,graphHeightIn:+e.graph_height_in,width:+e.width,height:+e.height,comment:e.comment});var e})).filter((function(e){return e.treatmentId===t}))},this.writeAnswers=function(){var t=Object(m.a)(h.a.mark((function t(e,n){var a,i;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=n.getState,i=a(),console.log(e),console.log(JSON.stringify(i));case 4:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}return Object(b.a)(t,[{key:"convertToCSV",value:function(t){var e=t.map((function(t){return"".concat(t.treatmentId,", ").concat(t.position,", ").concat(t.viewType,", ").concat(t.interaction,", ").concat(t.variableAmount,", ").concat(t.amountEarlier,", ").concat(t.timeEarlier,", ").concat(t.dateEarlier,", ").concat(t.amountLater,", ").concat(t.timeLater,", ").concat(t.dateLater,", ").concat(t.maxAmount,", ").concat(t.maxTime,", ").concat(t.verticalPixels,", ").concat(t.horizontalPixels,", ").concat(t.choice,", ").concat(t.shownTimestamp,", ").concat(t.choiceTimestamp,", ").concat(t.highup,", ").concat(t.lowdown,", ").concat(t.participantCode)}));return["treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code"].concat(e).join("\n")}}]),t}(),_="Unitialized",A="Fetched",T="Complete",E={unitialized:"unitialized",earlier:"earlier",later:"later"},L=function t(e){var n=e.treatmentId,a=e.position,i=e.viewType,r=e.interaction,o=e.variableAmount,c=e.amountEarlier,s=e.timeEarlier,l=e.dateEarlier,u=e.amountLater,h=e.timeLater,m=e.dateLater,b=e.maxAmount,j=e.maxTime,p=e.verticalPixels,x=e.horizontalPixels,v=e.choice,w=e.shownTimestamp,f=e.choiceTimestamp,g=e.highup,O=e.lowdown,y=e.participantCode;Object(d.a)(this,t),this.treatmentId=n,this.position=a,this.viewType=i,this.interaction=r,this.variableAmount=o,this.amountEarlier=c,this.timeEarlier=s,this.dateEarlier=l,this.amountLater=u,this.timeLater=h,this.dateLater=m,this.maxAmount=b,this.maxTime=j,this.verticalPixels=p,this.horizontalPixels=x,this.choice=v,this.shownTimestamp=w,this.choiceTimestamp=f,this.highup=g,this.lowdown=O,this.participantCode=y},I=new(function(){function t(){Object(d.a)(this,t)}return Object(b.a)(t,[{key:"currentTreatment",value:function(t){return t.questions[t.currentQuestionIdx]}},{key:"currentTreatmentAndLatestAnswer",value:function(t){return{treatment:this.currentTreatment(t),latestAnswer:this.latestAnswer(t)}}},{key:"latestAnswer",value:function(t){return 0===t.answers.length?null:t.answers[t.answers.length-1]}},{key:"createNextAnswer",value:function(t,e,n,a,i,r){var o=new L({treatmentId:t.id,position:t.position,viewType:t.viewType,interaction:t.interaction,variableAmount:t.variableAmount,amountEarlier:n,timeEarlier:t.timeEarlier,dateEarlier:t.dateEarlier,amountLater:a,timeLater:t.timeLater,dateLater:t.dateLater,maxAmount:t.maxAmount,maxTime:t.maxTime,verticalPixels:t.verticalPixels,horizontalPixels:t.horizontalPixels,choice:E.unitialized,highup:i,lowdown:r});e.push(o)}},{key:"allQuestions",value:function(t){return t.answers}},{key:"startSurvey",value:function(t){t.currentQuestionIdx=0;var e=this.currentTreatment(t);t.highup=e.variableAmount===f.laterAmount?e.amountEarlier:e.amountLater,t.lowdown=void 0,this.createNextAnswer(e,t.answers,e.amountEarlier,e.amountLater,t.highup,t.lowdown)}},{key:"setLatestAnswerShown",value:function(t,e){this.latestAnswer(t).shownTimestamp=e.payload}},{key:"isLastTreatment",value:function(t){return t.currentQuestionIdx===t.questions.length-1}},{key:"incNextQuestion",value:function(t){if(this.isLastTreatment(t))t.status=T;else{t.currentQuestionIdx+=1;var e=this.currentTreatment(t);this.createNextAnswer(e,t.answers,e.amountEarlier,e.amountLater)}}},{key:"updateHighupOrLowdown",value:function(t){var e=this.currentTreatmentAndLatestAnswer(t),n=e.treatment,a=e.latestAnswer;switch(a.choice){case E.earlier:var i=n.variableAmount===f.laterAmount?a.amountLater:a.amountEarlier;(!t.highup||i>t.highup)&&(t.highup=i);break;case E.later:var r=n.variableAmount===f.laterAmount?a.amountLater:a.amountEarlier;(!t.lowdown||r<t.lowdown)&&(t.lowdown=r);break;default:console.assert(!0,"Invalid value for current answer in setAnswerCurrentQuestion")}}},{key:"calcTitrationAmount",value:function(t,e,n){return(n||t-e)/2}},{key:"calcNewAmount",value:function(t,e){var n,a=this.currentTreatmentAndLatestAnswer(t),i=a.treatment,r=a.latestAnswer;switch(i.variableAmount){case f.laterAmount:return console.assert(r.choice&&r.choice!==E.unitialized),n=r.choice===E.earlier?e:-1*e,10*parseInt((r.amountLater+n)/10);case f.earlierAmount:return n=r.choice===E.earlier?-1*e:e,10*parseInt((r.amountEarlier+n)/10);default:console.assert(!0,"Invalid value for question titration type in calcEarlierAndLaterAmounts")}}},{key:"answerCurrentQuestion",value:function(t,e){var n=this.currentTreatmentAndLatestAnswer(t),a=n.treatment,i=n.latestAnswer;if(i.choice=e.payload.choice,i.choiceTimestamp=e.payload.choiceTimestamp.toFormat("MM/dd/yyyy H:mm:ss:SSS ZZZZ"),a.interaction===g.none||a.interaction===g.drag)this.incNextQuestion(t);else if(a.interaction===g.titration){var r=this.calcTitrationAmount(a.variableAmount===f.laterAmount?i.amountLater:i.amountEarlier,t.highup,1===i.length?t.highup:null);if(this.updateHighupOrLowdown(t),t.lowdown-t.highup<=10)this.incNextQuestion(t);else{var o=this.calcNewAmount(t,r);a.variableAmount===f.laterAmount?this.createNextAnswer(a,t.answers,a.amountEarlier,o):a.variableAmount===f.earlierAmount?this.createNextAnswer(a,t.answers,o,a.amountLater):console.assert(!0,"Titration not set to amountEarlier or amountLater before calling answerCurrentQuestion")}}}}]),t}()),k=new y,z=Object(l.b)("survey/writeAnswers",k.writeAnswers),S=Object(l.c)({name:"questions",initialState:{treatmentId:null,participantId:null,questions:[],answers:[],currentQuestionIdx:0,highup:void 0,lowdown:void 0,status:_,error:null},reducers:{setParticipant:function(t,e){return t.participantId=e.payload,t},setTreatmentId:function(t,e){return t.treatmentId=e.payload,t},fetchQuestions:function(t){return t.questions=k.fetchQuestions(t.treatmentId),t.status=A,t},startSurvey:function(t){return I.startSurvey(t),t},setQuestionShownTimestamp:function(t,e){return I.setLatestAnswerShown(t,e),t},answer:function(t,e){I.answerCurrentQuestion(t,e)}}}),P=function(t){return I.allQuestions(t.questions)},q=function(t){return I.currentTreatment(t.questions)},C=function(t){return I.latestAnswer(t.questions)},Q=function(t){return t.questions.status},D=function(t){return t.questions.treatmentId},M=S.actions,N=M.fetchQuestions,F=M.startSurvey,W=M.setQuestionShownTimestamp,R=M.answer,H=M.setParticipant,V=M.setTreatmentId,B=S.reducer,J=Object(l.a)({reducer:{questions:B},middleware:function(t){return t()}}),U=(n(161),n(25)),Z=n(3),$=n(35),Y=n(175),G=n(176),K=(n(162),n(172)),X=n(173),tt=n(174),et=n(30),nt=n(16),at=n(1);var it=function(){var t=Object(s.b)(),e=Object(s.c)(C),n=Object(s.c)(Q);function a(){return"$".concat(e.amountEarlier," ").concat(0===(t=e.timeEarlier)?"today":"in ".concat(t," weeks"));var t}var i=Object(at.jsx)(nt.d,{initialValues:{choice:E.unitialized},validate:function(t){var e={};return t.choice&&t.choice!==E.unitialized||(e.choice="Please choose a selection to continue."),e},onSubmit:function(e,n){var a=n.setSubmitting,i=n.resetForm;setTimeout((function(){t(R({choice:e.choice,choiceTimestamp:et.DateTime.now()})),a(!1),i()}),400)},children:function(t){var n=t.isSubmitting;return Object(at.jsxs)(nt.c,{children:[Object(at.jsxs)("div",{role:"group","aria-labelledby":"my-radio-group",className:"radio-choice-label",children:[Object(at.jsxs)("label",{children:[Object(at.jsx)(nt.b,{type:"radio",name:"choice",value:E.earlier}),"\xa0",a()]}),Object(at.jsx)("br",{}),Object(at.jsxs)("label",{children:[Object(at.jsx)(nt.b,{type:"radio",name:"choice",value:E.later}),"\xa0","$".concat(e.amountLater," in ").concat(e.timeLater," weeks")]}),Object(at.jsx)("span",{style:{color:"red",fontWeight:"bold"},children:Object(at.jsx)(nt.a,{name:"choice",component:"div"})})]}),Object(at.jsx)(G.a,{type:"submit",disabled:n,children:"Submit"})]})}});return n===T?Object(at.jsx)(Z.a,{to:"/thankyou"}):(t(W(Date.now())),i)},rt=function(t,e){var n=i.a.useRef();return i.a.useEffect((function(){return t(j.h(n.current)),function(){}}),e),n};var ot=function(t){var e=Object(s.b)(),n=Object(s.c)(C),a=Object(s.c)(Q),i=n.verticalPixels,r=n.horizontalPixels,o={top:t.top_margin,right:t.right_margin,bottom:t.bottom_margin,left:t.left_margin},c=i+parseInt(o.top)+parseInt(o.bottom),l=r+parseInt(o.left)+parseInt(o.right),u=Array.from(Array(n.maxTime+1).keys()),h=u.map((function(t){return t===n.timeEarlier?{time:t,amount:n.amountEarlier,barType:f.earlierAmount}:t===n.timeLater?{time:t,amount:n.amountLater,barType:f.laterAmount}:{time:t,amount:0,barType:f.none}})),m=Object(at.jsxs)(K.a,{fluid:!0,children:[Object(at.jsx)(X.a,{children:Object(at.jsx)(tt.a,{children:Object(at.jsx)("svg",{width:"".concat(l),height:"".concat(c),ref:rt((function(t){var a=t.selectAll(".plot-area").data([null]).join("g").attr("class","plot-area").attr("transform","translate(".concat(o.left,",").concat(o.top,")")),c=Object(j.g)().domain([0,n.maxTime]).range([0,r]),s=[0,n.maxAmount],l=Object(j.g)().domain(s).range([i,0]);a.selectAll(".x-axis").data([null]).join("g").attr("transform","translate(0,".concat(i,")")).attr("class","x-axis").call(Object(j.a)(c).tickValues(u).tickFormat(Object(j.e)(",.0f")));var m=Object(j.f)(s[0],s[1],s[1]/5);m.push(s[1]),a.selectAll(".y-axis").data([null]).join("g").attr("class","y-axis").call(Object(j.b)(l).tickValues(m).tickFormat(Object(j.e)("$,.0f"))),a.selectAll(".bar").data(h).join("rect").attr("fill","steelblue").attr("class","bar").attr("x",(function(t){return c(t.time)-7.5})).attr("width",15).attr("y",(function(t){return l(t.amount)})).attr("id",(function(t){return"id"+t.time})).on("click",(function(t){n.interaction===g.titration&&(t.target.__data__.amount===n.amountEarlier?e(R({choice:E.earlier,choiceTimestamp:et.DateTime.now()})):t.target.__data__.amount===n.amountLater&&e(R({choice:E.later,choiceTimestamp:et.DateTime.now()})))})).attr("height",(function(t){return l(0)-l(t.amount)})),Object(j.d)().on("drag",(function(t){n.interaction===g.drag&&t.subject.barType===n.variableAmount&&Object(j.h)(this).attr("y",t.y).attr("height",l(0)-t.y)}))(a.selectAll(".bar"))}),[n])})})}),Object(at.jsx)(X.a,{children:Object(at.jsx)(tt.a,{children:n.interaction===g.drag?Object(at.jsx)(nt.d,{initialValues:{choice:E.Unitialized},validate:function(){return{}},onSubmit:function(t,n){var a=n.setSubmitting,i=n.resetForm;setTimeout((function(){e(R({choice:E.earlier,choiceTimestamp:et.DateTime.now()})),a(!1),i()}),400)},children:function(t){var e=t.isSubmitting;return Object(at.jsx)(nt.c,{children:Object(at.jsx)(G.a,{type:"submit",disabled:e,children:"Submit"})})}}):""})})]});return a===T?Object(at.jsx)(Z.a,{to:"/thankyou"}):(e(W(Date.now())),m)},ct=n(167);var st=function(t){var e=Object(s.c)(C),n=e.question.verticalPixels,a=e.question.horizontalPixels,i={top:t.top_margin,right:t.right_margin,bottom:t.bottom_margin,left:t.left_margin},r={height:n+parseInt(i.top)+parseInt(i.bottom),width:a+parseInt(i.left)+parseInt(i.right),marginLeft:i.left+"px",marginRight:i.right+"px"};return Object(at.jsx)("table",{id:"calendar",ref:rt((function(t){var n=ct(e.question.dateEarlier),a=["January","February","March","April","May","June","July","August","September","October","November","December"][e.question.dateEarlier.getMonth()];t.html("<thead>\n                <tr>\n                    <td span='7'>\n                        <h2 id='currentMonth'></h2>\n                    </td>\n                </tr>\n                <tr>\n                    <td style='text-align: center;'>Sunday</td>\n                    <td style='text-align: center;'>Monday</td>\n                    <td style='text-align: center;'>Tuesday</td>\n                    <td style='text-align: center;'>Wednesday</td>\n                    <td style='text-align: center;'>Thursday</td>\n                    <td style='text-align: center;'>Friday</td>\n                    <td style='text-align: center;'>Saturday</td>\n                </tr>\n            </thead>\n            <tbody id='calendarBody'></tbody>");var i=j.h("#calendar");i.select("#currentMonth").data([a]).join("h2").text((function(t){return t}));var r=i.select("#calendarBody").selectAll("tbody").data(n).join("tr"),o=e.question.dateEarlier.getDate(),c=e.question.dateLater.getDate();r.selectAll("td").data((function(t){return t})).join("td").attr("class",(function(t){return t>0?"calendarDay":"calendarDayEmpty"})).attr("id",(function(t){return"calendarDay-"+t})).html((function(t){return t===o||t===c?"<div>".concat(t,"</div><svg id='").concat(t===o?"earlierAmount":"laterAmount","'></svg>"):t>0?t:""})),r.select("#earlierAmount").select("text").data([e.question.amountEarlier]).join("text").attr("text-anchor","middle").attr("class","earlier-amount").text((function(t){return t}))}),e),style:r})};var lt=function(){var t=Object(s.c)(C);return Object(at.jsx)(K.a,{fluid:!0,children:Object(at.jsx)(X.a,{children:Object(at.jsx)(tt.a,{children:t.viewType===w.barchart?Object(at.jsx)(ot,{top_margin:"20",right_margin:"30",bottom_margin:"30",left_margin:"80"}):t.viewType===w.word?Object(at.jsx)(it,{}):Object(at.jsx)(st,{top_margin:"20",right_margin:"20",bottom_margin:"30",left_margin:"30"})})})})};function ut(){var t=Object(s.b)(),e=Object(Z.g)().search,n=new URLSearchParams(e).get("treatment_id");return t(V(n)),""}var ht=function(){return Object(at.jsx)("div",{children:Object(at.jsx)(U.a,{children:Object(at.jsxs)("div",{className:"App",children:[Object(at.jsx)(ut,{}),Object(at.jsxs)(Z.d,{children:[Object(at.jsx)(Z.b,{exact:!0,path:"/",component:mt}),Object(at.jsx)(Z.b,{exact:!0,path:"/instructions",component:dt}),Object(at.jsx)(Z.b,{path:"/survey",component:lt}),Object(at.jsx)(Z.b,{path:"/thankyou",component:bt}),Object(at.jsx)(Z.b,{path:"/*",component:mt})]})]})})})},mt=function(){var t=Object(s.c)(D);return Object(at.jsx)("div",{id:"home-text",children:null===t?Object(at.jsxs)("div",{children:[Object(at.jsx)("p",{children:"We shouldn not see this page since the participants will be provided a link with the treatment id in the URL."}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{href:"https://github.com/pcordone/vizsurvey",children:"Github README.md"})}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{href:"https://github.com/pcordone",children:"public website"})}),Object(at.jsx)("p",{children:"Click a link below to launc one of the experiments."}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{id:"word-no-titration",href:"/instructions?treatment_id=1",children:"Worded with no titration and not draggable."})}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{id:"barchart-no-titration",href:"/instructions?treatment_id=2",children:"Barchart with no titration and not draggable."})}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{id:"barchart-drag",href:"/instructions?treatment_id=3",children:"Barchart draggable."})}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{id:"word-titration",href:"/instructions?treatment_id=4",children:"Word titration."})}),Object(at.jsx)("p",{children:Object(at.jsx)("a",{id:"barchart-titration",href:"/instructions?treatment_id=5",children:"Barchart titration."})})]}):Object(at.jsx)(Z.a,{to:"/instructions?treatment_id=".concat(t)})})},dt=function(){var t=Object($.b)(),e=Object(s.b)();e(N());var n=Object(s.c)(q);return Object(at.jsxs)("div",{id:"home-text",children:[n.viewType===w.barchart?Object(at.jsx)("div",{children:"Click on the bar that represents the amount that you would like to receive."}):n.viewType===w.word?Object(at.jsx)("div",{children:"Click on the radio button that contains the amount you would like to receive."}):n.viewType===w.calendar?Object(at.jsx)("div",{children:"Click on the day that contains the amount that you would like to receive."}):Object(at.jsxs)("div",{children:["Cannot display ",Object(at.jsx)("b",{children:"specific"})," instructions since a treatment has not been selected. Please select a treatment"]}),Object(at.jsx)($.a,{handle:t,children:Object(at.jsx)(U.b,{to:"/survey",children:Object(at.jsx)(G.a,{size:"lg",onClick:function(){e(F()),t.enter()},children:"Start Survey"})})})]})},bt=function(){var t=Object(s.b)(),e=Object(Y.a)();t(H(e));var n=Object(s.c)(P),a=(new y).convertToCSV(n);t(z(a));var i=Object($.b)();return Object(at.jsx)($.a,{handle:i,children:Object(at.jsxs)("div",{children:[Object(at.jsx)("p",{children:"Your answers have been submitted. Thank you for taking this survey!"}),Object(at.jsxs)("p",{children:["Your unique ID is: ",e,". Please go back to Amazon Turk and present this unique ID in the form."]}),Object(at.jsx)(G.a,{size:"lg",onClick:function(){i.enter(),setTimeout((function(){i.exit()}),400)},children:"Exit Fullscreen"})]})})},jt=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,177)).then((function(e){var n=e.getCLS,a=e.getFID,i=e.getFCP,r=e.getLCP,o=e.getTTFB;n(t),a(t),i(t),r(t),o(t)}))};Object(c.a)(),o.a.render(Object(at.jsx)(i.a.StrictMode,{children:Object(at.jsx)(s.a,{store:J,children:Object(at.jsx)(ht,{})})}),document.getElementById("root")),jt()}},[[170,1,2]]]);
//# sourceMappingURL=main.eae55b53.chunk.js.map