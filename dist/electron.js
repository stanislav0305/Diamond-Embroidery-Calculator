(()=>{"use strict";var e={298:e=>{e.exports=require("electron")}},o={};function r(t){var n=o[t];if(void 0!==n)return n.exports;var i=o[t]={exports:{}};return e[t](i,i.exports,r),i.exports}(()=>{const{app:e,BrowserWindow:o}=r(298);e.on("ready",(function(){let e=new o({width:800,height:600});e.loadFile("index.html"),e.on("closed",(()=>{e=null}))})),e.on("window-all-closed",(()=>{"darwin"!==process.platform&&e.quit()})),e.on("activate",(()=>{}))})()})();