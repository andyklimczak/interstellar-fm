(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{340:function(e,t,n){"use strict";n.d(t,"a",(function(){return de}));var a=n(4),r=n.n(a),o=n(13),s=n.n(o),i=n(0),c=n.n(i),l=n(2),u=n(342),h=n(8),f=n(278),p=n(276),m=n(92),d=n(539),y=n(31),g=n(306),b=n(3),S=n(52),v=n(73),x=n(538),O=n(17),w=n.n(O),E=n(154),j=n.n(E),k=Object(S.a)((function(e){var t=e.item,n=Object(i.useContext)(de),a=Object(i.useState)(!1),r=w()(a,2);r[0],r[1];return c.a.createElement(i.Fragment,null,c.a.createElement(y.c,{bottomDivider:!0,onPress:function(){n.radioStore.playStation(t)},containerStyle:[j()(n.radioStore.playingStation,t)&&C.playing]},c.a.createElement(y.a,{source:{uri:t.favicon}}),c.a.createElement(y.c.Content,{style:C.content},c.a.createElement(y.c.Title,null,t.name),c.a.createElement(y.c.Subtitle,null,t.tags)),c.a.createElement(y.c.Chevron,{onPress:function(){n.stationsStore.deleteStation(t)},name:"minus",type:"font-awesome-5",size:24})))})),C=l.a.create({container:{flex:1,justifyContent:"center",alignItems:"center"},content:{flexGrow:60},buttonGroup:{flexGrow:1},playing:{backgroundColor:"rgba(0,175,225,.5)"},modalTitle:{flexDirection:"row",alignItems:"center",marginBottom:20},modalButton:{marginBottom:5}}),I=k,P=(n(487),n(97)),D=n.n(P),T=Object(S.a)((function(e){var t,n=e.item,a=Object(i.useContext)(de);return c.a.createElement(y.c,{bottomDivider:!0,onPress:function(){a.radioStore.playStation(n)},containerStyle:[j()(a.radioStore.playingStation,n)&&M.playing]},c.a.createElement(y.a,{source:{uri:n.favicon}}),c.a.createElement(y.c.Content,{style:M.content},c.a.createElement(y.c.Title,null,n.name),c.a.createElement(y.c.Subtitle,null,n.tags)),(t=n,D()(a.stationsStore.stations,"stationuuid").includes(t.stationuuid)?null:c.a.createElement(y.c.Chevron,{style:M.buttonGroup,onPress:function(){a.stationsStore.addStation(n)},name:"plus",type:"font-awesome-5",size:24})))})),M=l.a.create({container:{flex:1,justifyContent:"center",alignItems:"center"},content:{flexGrow:60},buttonGroup:{flexGrow:1},playing:{backgroundColor:"rgba(0,175,225,.5)"}}),A=T,N=Object(S.a)((function(e){var t=e.stations,n=e.listType,a="search"==n?A:I;return console.log("stations list stations",n,t.length),c.a.createElement(x.a,null,(function(){return c.a.createElement(v.a,{data:t,keyExtractor:function(e,t){return e.stationuuid},renderItem:function(e){var t=e.item;return c.a.createElement(a,{item:t})}})}))})),R=(l.a.create({container:{flex:1,justifyContent:"center",alignItems:"center"}}),N),q=n(22),B=n(317),_=Object(S.a)((function(){var e=Object(i.useContext)(de),t=e.radioStore.playingStation;return t?c.a.createElement(b.a,{style:z.container},c.a.createElement(q.a,{style:z.stationName},t.name),c.a.createElement(B.a,{name:"stop-circle",onPress:function(){console.log("handle stop radio"),e.radioStore.stopStation()},size:36})):null})),z=l.a.create({container:{height:50,backgroundColor:"powderblue",flexDirection:"row",justifyContent:"center",alignItems:"center"},stationName:{marginRight:15}}),G=_,F=Object(S.a)((function(){var e=Object(i.useContext)(de);return c.a.createElement(b.a,{style:U.container},c.a.createElement(b.a,{style:U.innerContainer},c.a.createElement(y.b,{centerComponent:{text:"Stations",style:{color:"#fff"}},barStyle:"light-content"}),c.a.createElement(R,{stations:e.stationsStore.stations})),c.a.createElement(b.a,null,c.a.createElement(G,null)))})),U=l.a.create({container:{flex:1,justifyContent:"center",alignItems:"stretch"},innerContainer:{flex:1}}),J=F,H=n(335),K=n.n(H),L=Object(S.a)((function(e){var t=Object(i.useContext)(de),n=Object(i.useState)(t.searchStore.query),a=w()(n,2),r=a[0],o=a[1],s=Object(i.useCallback)(K()((function(e){t.searchStore.handleSearch(e)}),1e3),[]);return c.a.createElement(b.a,{style:Q.container},c.a.createElement(b.a,{style:Q.innerContainer},c.a.createElement(y.b,{centerComponent:{text:"Search",style:{color:"#fff"}}}),c.a.createElement(y.d,{placeholder:"Search",onChangeText:function(e){o(e),s(e)},value:r,clearIcon:!0,showLoading:t.searchStore.searching,platform:"ios"}),c.a.createElement(R,{stations:t.searchStore.results,listType:"search"})),c.a.createElement(b.a,null,c.a.createElement(G,null)))})),Q=l.a.create({container:{flex:1,justifyContent:"center",alignItems:"stretch"},innerContainer:{flex:1}}),V=L,W=n(5),X=n.n(W),Y=n(14),Z=n.n(Y),$=n(24),ee=n(341),te=n(122),ne=n.n(te),ae=function(e,t){var n,a;return X.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return n=D()(t,(function(e,t){return t+"="+e})).join("&"),console.log("query params",n),console.log(e,t),r.next=5,X.a.awrap(ne.a.get("https://de1.api.radio-browser.info/json/stations/bytag/"+e+"?"+n,{headers:{"x-requested-with":"InterstellarFM"}}));case 5:return a=r.sent,r.abrupt("return",a.data);case 7:case"end":return r.stop()}}),null,null,null,Promise)},re=function(e){var t,n;return X.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return t=D()(e,(function(e,t){return t+"="+e})).join("&"),a.next=3,X.a.awrap(ne.a.get("https://de1.api.radio-browser.info/json/stations?"+t,{headers:{"x-requested-with":"InterstellarFM"}}));case 3:return n=a.sent,a.abrupt("return",n.data);case 5:case"end":return a.stop()}}),null,null,null,Promise)},oe=function(e){return X.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,X.a.awrap(ne.a.get("https://de1.api.radio-browser.info/json/url/"+e,{headers:{"x-requested-with":"InterstellarFM"}}));case 3:t.sent,t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),console.log("error clicking station",t.t0);case 9:case"end":return t.stop()}}),null,null,[[0,6]],Promise)},se=function(e){return X.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,X.a.awrap(ne.a.get("https://de1.api.radio-browser.info/json/xml/"+e,{headers:{"x-requested-with":"InterstellarFM"}}));case 3:t.sent,t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),console.log("error voting station",t.t0);case 9:case"end":return t.stop()}}),null,null,[[0,6]],Promise)},ie=function(){function e(t){s()(this,e),this.stations=[],this.andy="andy store",Object($.k)(this),this.rootStore=t}return Z()(e,[{key:"fetchStations",value:function(){var e,t=this;return X.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,X.a.awrap(ee.a.getItem("@interstellarfm.stations"));case 3:e=n.sent,Object($.m)((function(){t.stations=e?JSON.parse(e):[]})),n.next=11;break;case 7:n.prev=7,n.t0=n.catch(0),console.log("error getting stations",n.t0),Object($.m)((function(){t.stations=[]}));case 11:case"end":return n.stop()}}),null,null,[[0,7]],Promise)}},{key:"saveStations",value:function(){return X.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("save stations",this.stations.length);case 2:case"end":return e.stop()}}),null,this,null,Promise)}},{key:"addStation",value:function(e){console.log("add station",e),this.stations.push(e),this.saveStations()}},{key:"deleteStation",value:function(e){this.stations=this.stations.filter((function(t){return t!=e})),this.saveStations()}},{key:"voteStation",value:function(e){se(e.stationuuid)}}]),e}(),ce=function(){function e(t){s()(this,e),this.query="",this.searching=!1,this.results=[],Object($.k)(this),this.rootStore,this.initSearch()}return Z()(e,[{key:"initSearch",value:function(){var e,t;return X.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return e={limit:25,order:"clicktrend",hideBroken:!0},n.next=3,X.a.awrap(re(e));case 3:t=n.sent,this.results=t;case 5:case"end":return n.stop()}}),null,this,null,Promise)}},{key:"handleSearch",value:function(e){var t,n;return X.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:if(this.query=e,!(e.length>0)){a.next=11;break}return this.searching=!0,console.log("handle search",e),t={limit:25,by:"tag",searchterm:e,order:"clickcount",hideBroken:!0},a.next=7,X.a.awrap(ae(e,t));case 7:n=a.sent,this.results=n,console.log(e,n),this.searching=!1;case 11:case"end":return a.stop()}}),null,this,null,Promise)}}]),e}(),le=function e(t){s()(this,e),this.loading=!1,Object($.k)(this),this.rootStore=t},ue=n(123),he=function(){function e(t){s()(this,e),this.playingStation=null,this.radio=null,Object($.k)(this),this.rootStore=t,ue.a.setAudioModeAsync({allowsRecordingIOS:!1,staysActiveInBackground:!0,interruptionModeIOS:ue.a.INTERRUPTION_MODE_IOS_DUCK_OTHERS,playsInSilentModeIOS:!0,shouldDuckAndroid:!0,interruptionModeAndroid:ue.a.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,playThroughEarpieceAndroid:!0})}return Z()(e,[{key:"playStation",value:function(e){var t,n,a,r=this;return X.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:if(console.log("playStation",e.name),null==this.playingStation){o.next=10;break}return o.prev=2,o.next=5,X.a.awrap(this.stopStation());case 5:o.next=10;break;case 7:o.prev=7,o.t0=o.catch(2),console.log("error stopping");case 10:return o.prev=10,o.next=13,X.a.awrap(ue.a.Sound.createAsync({uri:e.url},{shouldPlay:!0}));case 13:t=o.sent,n=t.sound,a=t.status,Object($.m)((function(){r.radio=n,r.playingStation=e})),oe(e.stationuuid),console.log("playing",a,this.radio,this.playingStation),o.next=25;break;case 21:o.prev=21,o.t1=o.catch(10),console.log("error"),console.log(o.t1);case 25:case"end":return o.stop()}}),null,this,[[2,7],[10,21]],Promise)}},{key:"stopStation",value:function(){var e=this;return X.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!this.radio){t.next=4;break}return t.next=4,X.a.awrap(this.radio.stopAsync());case 4:t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),console.log("error stopping station",t.t0);case 9:Object($.m)((function(){e.playingStation=null}));case 10:case"end":return t.stop()}}),null,this,[[0,6]],Promise)}}]),e}();function fe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var pe=Object(d.a)(),me=function e(){s()(this,e),this.stationsStore=new ie(this),this.searchStore=new ce(this),this.uiStore=new le(this),this.radioStore=new he(this)},de=Object(i.createContext)(),ye={colors:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?fe(Object(n),!0).forEach((function(t){r()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):fe(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},h.a.select({default:y.f.platform.android,ios:y.f.platform.ios}))};l.a.create({container:{flex:1,backgroundColor:"#fff"}}),t.b=function(){var e="dark"===Object(u.a)();return c.a.createElement(de.Provider,{value:new me},c.a.createElement(y.e,{theme:ye,useDark:e},c.a.createElement(f.a,{theme:e?p.a:m.a},c.a.createElement(pe.Navigator,null,c.a.createElement(pe.Screen,{name:"Stations",component:J,options:{tabBarIcon:function(e){var t=e.color,n=e.size;return c.a.createElement(g.a,{name:"playlist-music",size:n,color:t})}}}),c.a.createElement(pe.Screen,{name:"Search",component:V,options:{tabBarIcon:function(e){var t=e.color,n=e.size;return c.a.createElement(g.a,{name:"search-web",size:n,color:t})}}})))))}},351:function(e,t,n){e.exports=n(529)}},[[351,1,2]]]);
//# sourceMappingURL=app.76970b11.chunk.js.map