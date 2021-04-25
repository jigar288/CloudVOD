(()=>{"use strict";var e,t,r,n={4486:(e,t,r)=>{var n,a=r(7294),o=r(3935),i=r(9226),c=r(1411),s=r(980),l=r(1533),u=r(2775),d=r(6868),p=r(1330),E=r(3727),m=r(5977),f=r(8519),{VideosPage:v,AboutPage:h,VideoPage:g,UploadPage:y}=(0,f.R)((()=>Promise.all([r.e(404),r.e(936)]).then(r.bind(r,1826))));!function(e){e.VIDEOS_PAGE="/",e.ABOUT_PAGE="/about",e.UPLOAD_PAGE="/upload",e.VIDEO_PAGE="/watch/:id"}(n||(n={}));var b=[{path:n.VIDEOS_PAGE,exact:!0,component:v,dependent:!0},{path:n.ABOUT_PAGE,component:h},{path:n.VIDEO_PAGE,component:g,dependent:!0},{path:n.UPLOAD_PAGE,component:y,authenticated:!0,dependent:!0}],O=(e,t)=>t?"https://cloud-vod-api.clark.tw/api/user/"+(e?"login":"logout")+"?return=https://cloud-vod-client.clark.tw/":"/",P=[{name:"Videos",icon:a.createElement(d.FI4,{className:"inline-block w-5 h-5"}),href:n.VIDEOS_PAGE},{name:"Upload",icon:a.createElement(d.aBR,{className:"inline-block w-5 h-5"}),authenticated:!0,href:n.UPLOAD_PAGE},{name:"About Us",icon:a.createElement(d.ocf,{className:"inline-block w-5 h-5"}),href:n.ABOUT_PAGE}];function w(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter(Boolean).join(" ")}const R=e=>{var{user:t,sanity:r}=(0,c.CG)((e=>e)),{pathname:n}=(0,m.TH)();return a.createElement(a.Fragment,null,a.createElement(p.pJ,{as:"nav",className:"bg-gray-800"},(r=>{var{open:o}=r;return a.createElement(a.Fragment,null,a.createElement("div",{className:"max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"},a.createElement("div",{className:"relative flex items-center justify-between h-16"},a.createElement("div",{className:"absolute inset-y-0 left-0 flex items-center sm:hidden"},a.createElement(p.pJ.Button,{className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"},a.createElement("span",{className:"sr-only"},o?"Close":"Open"," main menu"),o?a.createElement(d.oHP,{className:"block h-6 w-6","aria-hidden":"true"}):a.createElement(d.qTj,{className:"block h-6 w-6","aria-hidden":"true"}))),a.createElement("div",{className:"flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"},a.createElement("div",{className:"flex-shrink-0 flex items-center"},a.createElement("div",{className:"block h-auto w-auto font-extrabold text-xl"},"CloudTube")),a.createElement("div",{className:"hidden sm:block sm:ml-6"},a.createElement("div",{className:"flex space-x-4"},e.paths.map(((e,t)=>{var{name:r,href:o,icon:i}=e;return a.createElement(E.rU,{key:t,to:o,className:w(o===n?"bg-gray-900 text-white":"text-gray-300 hover:bg-gray-700 hover:text-white","px-3 py-2 rounded-md text-sm font-medium"),"aria-current":o===n?"page":void 0},a.createElement("span",{className:"inline-flex align-middle"},i," ",r))}))))),a.createElement("div",{className:"absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"},a.createElement("div",{className:"bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"},a.createElement("a",{href:O(!t,true),className:"md:flex"},a.createElement("span",{className:"hidden md:block px-2"},t?"Logout":"Login"),t?a.createElement(d.Mqe,{className:"h-6 w-6","aria-hidden":"true"}):a.createElement(d.SPH,{className:"h-6 w-6","aria-hidden":"true"}))),t&&a.createElement("div",{className:"ml-3 relative"},a.createElement("span",{className:"sr-only"},"Open user menu"),a.createElement("img",{className:"h-8 w-8 rounded-full",src:t.picture,alt:""}))))),a.createElement(p.pJ.Panel,{className:"sm:hidden"},a.createElement("div",{className:"px-2 pt-2 pb-3 space-y-1"},e.paths.map(((e,t)=>{var{href:r,name:o,icon:i}=e;return a.createElement(p.pJ.Button,{as:E.rU,key:t,to:r,className:w(r===n?"bg-gray-900 text-white":"text-gray-300 hover:bg-gray-700 hover:text-white","block px-3 py-2 rounded-md text-base font-medium"),"aria-current":r===n?"page":void 0},a.createElement("span",{className:"inline-flex align-middle"},i," ",o))})))))})))};var I=r(234),_=r(3062),j=r(6403),S=()=>{var e=(0,c.TL)(),{user:t,sanity:r}=(0,c.CG)((e=>e));return a.useEffect((()=>{e((0,I.KH)()),e((0,_.Iq)()),e((0,j.a4)()),e((0,j.jq)())}),[]),a.createElement(E.UT,null,a.createElement(R,{paths:P}),a.createElement(a.Suspense,{fallback:a.createElement(a.Fragment,null)},a.createElement(m.rs,null,b.map(((e,t)=>{var{path:r,exact:n,component:o,authenticated:i,dependent:c}=e,s=o;return a.createElement(m.AW,{path:r,exact:n,component:s,key:t})})))))},x=(r(4463),()=>a.createElement(i.zt,{store:c.h},a.createElement(l.x,{theme:(0,u.B)({config:{initialColorMode:"dark"}})},a.createElement(s.ColorModeScript,{initialColorMode:"dark"}),a.createElement(S,null))));o.render(a.createElement(x,null),document.getElementById("root"))},6403:(e,t,r)=>{r.d(t,{Nw:()=>n,tP:()=>E,jq:()=>m,a4:()=>f,j8:()=>v});var n,a=r(7407),o=r(4976),i=r(6502),c=r(1327);function s(e,t,r,n,a,o,i){try{var c=e[o](i),s=c.value}catch(e){return void r(e)}c.done?t(s):Promise.resolve(s).then(n,a)}function l(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){s(o,n,a,i,c,"next",e)}function c(e){s(o,n,a,i,c,"throw",e)}i(void 0)}))}}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){p(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}!function(e){e.RETRIEVE_VIDEOS="RETRIEVE_VIDEOS",e.RETRIEVE_CATEGORIES="RETRIEVE_CATEGORIES",e.UPLOAD_VIDEO="UPLOAD_VIDEO"}(n||(n={}));var E=(0,a.oM)({name:"data",initialState:{videos:[],categories:[]},reducers:{set_videos:(e,t)=>d(d({},e),{},{videos:t.payload}),clear_videos:e=>d(d({},e),{},{videos:[]}),set_categories:(e,t)=>d(d({},e),{},{categories:t.payload}),clear_categories:e=>d(d({},e),{},{categories:[]})}}),m=()=>function(){var e=l((function*(e){var t;e(i.t.actions.start(n.RETRIEVE_VIDEOS)),200===(t=yield c.h.get("/data/videos")).status&&t.data?(e(E.actions.set_videos(t.data)),e(o.t.actions.remove(n.RETRIEVE_VIDEOS))):(e(E.actions.clear_videos()),e(o.t.actions.set({action:n.RETRIEVE_VIDEOS,err:"API not responding. Please try again later"}))),e(i.t.actions.stop(n.RETRIEVE_VIDEOS))}));return function(t){return e.apply(this,arguments)}}(),f=()=>function(){var e=l((function*(e){var t;e(i.t.actions.start(n.RETRIEVE_CATEGORIES)),200===(t=yield c.h.get("/data/categories")).status&&t.data?(e(E.actions.set_categories(t.data)),e(o.t.actions.remove(n.RETRIEVE_CATEGORIES))):(e(E.actions.clear_categories()),e(o.t.actions.set({action:n.RETRIEVE_CATEGORIES,err:"API not responding. Please try again later"}))),e(i.t.actions.stop(n.RETRIEVE_CATEGORIES))}));return function(t){return e.apply(this,arguments)}}(),v=e=>function(){var t=l((function*(t){var r,a;t(i.t.actions.start(n.UPLOAD_VIDEO));var s,l=new FormData;(l.append("title",e.title),l.append("description",e.description),l.append("categories",JSON.stringify(e.categories)),l.append("filetoupload",e.file,e.file.name),200===(null===(r=a=yield c.h.post("/data/video",l))||void 0===r?void 0:r.status))?t(o.t.actions.remove(n.UPLOAD_VIDEO)):t(o.t.actions.set({action:n.UPLOAD_VIDEO,err:(null===(s=a)||void 0===s?void 0:s.data.message)||"Error while uploading video"}));t(m()),t(i.t.actions.stop(n.UPLOAD_VIDEO))}));return function(e){return t.apply(this,arguments)}}()},4976:(e,t,r)=>{function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,{t:()=>i});var i=(0,r(7407).oM)({name:"error",initialState:{},reducers:{remove:(e,t)=>a(a({},e),{},{[t.payload]:void 0}),set:(e,t)=>a(a({},e),{},{[t.payload.action]:t.payload.err})}})},6502:(e,t,r)=>{function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,{t:()=>i});var i=(0,r(7407).oM)({name:"loading",initialState:{RETRIEVE_CATEGORIES:!1,RETRIEVE_USER:!1,RETRIEVE_VIDEOS:!1,CHECK_SERVICE:!1,UPLOAD_VIDEO:!1},reducers:{start:(e,t)=>a(a({},e),{},{[t.payload]:!0}),stop:(e,t)=>a(a({},e),{},{[t.payload]:!1})}})},234:(e,t,r)=>{r.d(t,{Nw:()=>n,tP:()=>l,KH:()=>u});var n,a=r(7407),o=r(4976),i=r(6502),c=r(1327);function s(e,t,r,n,a,o,i){try{var c=e[o](i),s=c.value}catch(e){return void r(e)}c.done?t(s):Promise.resolve(s).then(n,a)}!function(e){e.CHECK_SERVICE="CHECK_SERVICE"}(n||(n={}));var l=(0,a.oM)({name:"sanity",initialState:!1,reducers:{set:(e,t)=>t.payload}}),u=()=>function(){var e,t=(e=function*(e){var t;e(i.t.actions.start(n.CHECK_SERVICE)),200!==(t=yield c.h.get("/")).status?e(o.t.actions.set({action:n.CHECK_SERVICE,err:"API not responding. Please try again later"})):e(o.t.actions.remove(n.CHECK_SERVICE)),e(l.actions.set(200===t.status)),e(i.t.actions.stop(n.CHECK_SERVICE))},function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){s(o,n,a,i,c,"next",e)}function c(e){s(o,n,a,i,c,"throw",e)}i(void 0)}))});return function(e){return t.apply(this,arguments)}}()},1411:(e,t,r)=>{r.d(t,{h:()=>p,CG:()=>E,TL:()=>m});var n=r(7407),a=r(4890),o=r(6403),i=r(234),c=r(3062),s=r(4976),l=r(6502),u=r(9226),d=(0,a.UY)({data:o.tP.reducer,user:c.tP.reducer,sanity:i.tP.reducer,error:s.t.reducer,loading:l.t.reducer}),p=(0,n.xC)({reducer:d}),E=(o.Nw,c.Nw,i.Nw,u.v9),m=()=>(0,u.I0)()},3062:(e,t,r)=>{r.d(t,{Nw:()=>n,tP:()=>l,Iq:()=>u});var n,a=r(7407),o=r(4976),i=r(6502),c=r(1327);function s(e,t,r,n,a,o,i){try{var c=e[o](i),s=c.value}catch(e){return void r(e)}c.done?t(s):Promise.resolve(s).then(n,a)}!function(e){e.RETRIEVE_USER="RETRIEVE_USER"}(n||(n={}));var l=(0,a.oM)({name:"user",initialState:null,reducers:{set:(e,t)=>t.payload,clear:()=>null}}),u=()=>function(){var e,t=(e=function*(e){var t;e(i.t.actions.start(n.RETRIEVE_USER)),200===(t=yield c.h.get("/user")).status&&t.data?(e(l.actions.set(t.data)),e(o.t.actions.remove(n.RETRIEVE_USER))):(e(l.actions.clear()),401===t.status?e(o.t.actions.set({action:n.RETRIEVE_USER,err:"You are not authorized to access this service"})):e(o.t.actions.set({action:n.RETRIEVE_USER,err:"API not responding. Please try again later"}))),e(i.t.actions.stop(n.RETRIEVE_USER))},function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){s(o,n,a,i,c,"next",e)}function c(e){s(o,n,a,i,c,"throw",e)}i(void 0)}))});return function(e){return t.apply(this,arguments)}}()},1327:(e,t,r)=>{r.d(t,{h:()=>a});var n=r(9669),a=r.n(n)().create({baseURL:"https://cloud-vod-api.clark.tw/api",withCredentials:!0,validateStatus:()=>!0})}},a={};function o(e){var t=a[e];if(void 0!==t)return t.exports;var r=a[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,o),r.loaded=!0,r.exports}o.m=n,e=[],o.O=(t,r,n,a)=>{if(!r){var i=1/0;for(l=0;l<e.length;l++){for(var[r,n,a]=e[l],c=!0,s=0;s<r.length;s++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](r[s])))?r.splice(s--,1):(c=!1,a<i&&(i=a));c&&(e.splice(l--,1),t=n())}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[r,n,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.f={},o.e=e=>Promise.all(Object.keys(o.f).reduce(((t,r)=>(o.f[r](e,t),t)),[])),o.u=e=>e+"."+{404:"7cb09233881ee78149e8",936:"650b338718ff27880adf"}[e]+".js",o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),t={},r="cloud-vod:",o.l=(e,n,a,i)=>{if(t[e])t[e].push(n);else{var c,s;if(void 0!==a)for(var l=document.getElementsByTagName("script"),u=0;u<l.length;u++){var d=l[u];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==r+a){c=d;break}}c||(s=!0,(c=document.createElement("script")).charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.setAttribute("data-webpack",r+a),c.src=e),t[e]=[n];var p=(r,n)=>{c.onerror=c.onload=null,clearTimeout(E);var a=t[e];if(delete t[e],c.parentNode&&c.parentNode.removeChild(c),a&&a.forEach((e=>e(n))),r)return r(n)},E=setTimeout(p.bind(null,void 0,{type:"timeout",target:c}),12e4);c.onerror=p.bind(null,c.onerror),c.onload=p.bind(null,c.onload),s&&document.head.appendChild(c)}},o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e})(),(()=>{var e={296:0};o.f.j=(t,r)=>{var n=o.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var a=new Promise(((r,a)=>n=e[t]=[r,a]));r.push(n[2]=a);var i=o.p+o.u(t),c=new Error;o.l(i,(r=>{if(o.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var a=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;c.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",c.name="ChunkLoadError",c.type=a,c.request=i,n[1](c)}}),"chunk-"+t,t)}},o.O.j=t=>0===e[t];var t=(t,r)=>{var n,a,[i,c,s]=r,l=0;for(n in c)o.o(c,n)&&(o.m[n]=c[n]);if(s)var u=s(o);for(t&&t(r);l<i.length;l++)a=i[l],o.o(e,a)&&e[a]&&e[a][0](),e[i[l]]=0;return o.O(u)},r=self.webpackChunkcloud_vod=self.webpackChunkcloud_vod||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var i=o.O(void 0,[444],(()=>o(4486)));i=o.O(i)})();