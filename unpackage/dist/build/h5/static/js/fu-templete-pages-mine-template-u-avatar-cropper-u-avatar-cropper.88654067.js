(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["fu-templete-pages-mine-template-u-avatar-cropper-u-avatar-cropper"],{"1d6a":function(t,n,e){"use strict";var r;e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return r}));var o=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"content"},[e("v-uni-view",{staticClass:"cropper-wrapper",style:{height:t.cropperOpt.height+"px"}},[e("v-uni-canvas",{staticClass:"cropper",style:{width:t.cropperOpt.width,height:t.cropperOpt.height,backgroundColor:"rgba(0, 0, 0, 0.8)"},attrs:{"disable-scroll":!0,"canvas-id":"cropper"},on:{touchstart:function(n){arguments[0]=n=t.$handleEvent(n),t.touchStart.apply(void 0,arguments)},touchmove:function(n){arguments[0]=n=t.$handleEvent(n),t.touchMove.apply(void 0,arguments)},touchend:function(n){arguments[0]=n=t.$handleEvent(n),t.touchEnd.apply(void 0,arguments)}}}),e("v-uni-canvas",{staticClass:"cropper",style:{position:"fixed",top:"-"+t.cropperOpt.width*t.cropperOpt.pixelRatio+"px",left:"-"+t.cropperOpt.height*t.cropperOpt.pixelRatio+"px",width:t.cropperOpt.width*t.cropperOpt.pixelRatio+"px",height:""+t.cropperOpt.height*t.cropperOpt.pixelRatio},attrs:{"disable-scroll":!0,"canvas-id":"targetId"}})],1),e("v-uni-view",{staticClass:"cropper-buttons safe-area-padding",style:{height:t.bottomNavHeight+"px"}},[e("v-uni-view",{staticClass:"upload",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.uploadTap.apply(void 0,arguments)}}},[t._v("选择图片")]),e("v-uni-view",{staticClass:"getCropperImage",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.getCropperImage(!1)}}},[t._v("确定")])],1)],1)},i=[]},"406f":function(t,n,e){"use strict";var r=e("47d2"),o=e.n(r);o.a},"47d2":function(t,n,e){var r=e("fc31");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var o=e("4f06").default;o("29f9ee89",r,!0,{sourceMap:!1,shadowMode:!1})},6559:function(t,n,e){"use strict";e.r(n);var r=e("1d6a"),o=e("d2a5");for(var i in o)"default"!==i&&function(t){e.d(n,t,(function(){return o[t]}))}(i);e("406f");var a,c=e("f0c5"),u=Object(c["a"])(o["default"],r["b"],r["c"],!1,null,"38ccaed8",null,!1,r["a"],a);n["default"]=u.exports},a7e8:function(t,n,e){(function(n){e("99af"),e("cb29"),e("4160"),e("c975"),e("fb6a"),e("b64b"),e("d3b7"),e("acd8"),e("ac1f"),e("25f0"),e("466d"),e("5319"),e("159b"),
/**
 * we-cropper v1.3.9
 * (c) 2020 dlhandsome
 * @license MIT
 */
function(n,e){t.exports=e()}(0,(function(){"use strict";var t=void 0,e=["touchstarted","touchmoved","touchended"];function r(t){return t.charAt(0).toUpperCase()+t.slice(1)}function o(t){var n=[],r=arguments.length-1;while(r-- >0)n[r]=arguments[r+1];e.forEach((function(e,r){void 0!==n[r]&&(t[e]=n[r])}))}function i(t,n){Object.defineProperties(t,n)}function a(){return t||(t=uni.getSystemInfoSync()),t}var c={},u=a(),s=u.pixelRatio,d={id:{default:"cropper",get:function(){return c.id},set:function(t){"string"!==typeof t&&console.error("id："+t+" is invalid"),c.id=t}},width:{default:750,get:function(){return c.width},set:function(t){"number"!==typeof t&&console.error("width："+t+" is invalid"),c.width=t}},height:{default:750,get:function(){return c.height},set:function(t){"number"!==typeof t&&console.error("height："+t+" is invalid"),c.height=t}},pixelRatio:{default:s,get:function(){return c.pixelRatio},set:function(t){"number"!==typeof t&&console.error("pixelRatio："+t+" is invalid"),c.pixelRatio=t}},scale:{default:2.5,get:function(){return c.scale},set:function(t){"number"!==typeof t&&console.error("scale："+t+" is invalid"),c.scale=t}},zoom:{default:5,get:function(){return c.zoom},set:function(t){"number"!==typeof t?console.error("zoom："+t+" is invalid"):(t<0||t>10)&&console.error("zoom should be ranged in 0 ~ 10"),c.zoom=t}},src:{default:"",get:function(){return c.src},set:function(t){"string"!==typeof t&&console.error("src："+t+" is invalid"),c.src=t}},cut:{default:{},get:function(){return c.cut},set:function(t){"object"!==typeof t&&console.error("cut："+t+" is invalid"),c.cut=t}},boundStyle:{default:{},get:function(){return c.boundStyle},set:function(t){"object"!==typeof t&&console.error("boundStyle："+t+" is invalid"),c.boundStyle=t}},onReady:{default:null,get:function(){return c.ready},set:function(t){c.ready=t}},onBeforeImageLoad:{default:null,get:function(){return c.beforeImageLoad},set:function(t){c.beforeImageLoad=t}},onImageLoad:{default:null,get:function(){return c.imageLoad},set:function(t){c.imageLoad=t}},onBeforeDraw:{default:null,get:function(){return c.beforeDraw},set:function(t){c.beforeDraw=t}}},h=a(),p=h.windowWidth;function l(){var t=this;t.attachPage=function(){var n=getCurrentPages(),e=n[n.length-1];Object.defineProperty(e,"wecropper",{get:function(){return console.warn("Instance will not be automatically bound to the page after v1.4.0\n\nPlease use a custom instance name instead\n\nExample: \nthis.mycropper = new WeCropper(options)\n\n// ...\nthis.mycropper.getCropperImage()"),t},configurable:!0})},t.createCtx=function(){var n=t.id,e=t.targetId;n?(t.ctx=t.ctx||uni.createCanvasContext(n),t.targetCtx=t.targetCtx||uni.createCanvasContext(e)):console.error("constructor: create canvas context failed, 'id' must be valuable")},t.deviceRadio=p/750}var f="undefined"!==typeof window?window:"undefined"!==typeof n?n:"undefined"!==typeof self?self:{};function g(t,n){return n={exports:{}},t(n,n.exports),n.exports}var v=g((function(t,n){n.isStr=function(t){return"string"===typeof t},n.isNum=function(t){return"number"===typeof t},n.isArr=Array.isArray,n.isUndef=function(t){return void 0===t},n.isTrue=function(t){return!0===t},n.isFalse=function(t){return!1===t},n.isFunc=function(t){return"function"===typeof t},n.isObj=n.isObject=function(t){return null!==t&&"object"===typeof t};var e=Object.prototype.toString;n.isPlainObject=function(t){return"[object Object]"===e.call(t)};var r=Object.prototype.hasOwnProperty;n.hasOwn=function(t,n){return r.call(t,n)},n.noop=function(t,n,e){},n.isValidArrayIndex=function(t){var n=parseFloat(String(t));return n>=0&&Math.floor(n)===n&&isFinite(t)}})),b=v.isFunc,w=v.isPlainObject,y=["ready","beforeImageLoad","beforeDraw","imageLoad"];function x(){var t=this;t.on=function(n,e){return y.indexOf(n)>-1?b(e)&&("ready"===n?e(t):t["on"+r(n)]=e):console.error("event: "+n+" is invalid"),t}}function m(t){return function(n){var e=[],r=arguments.length-1;while(r-- >0)e[r]=arguments[r+1];return void 0===n&&(n={}),new Promise((function(r,o){n.success=function(t){r(t)},n.fail=function(t){o(t)},t.apply(void 0,[n].concat(e))}))}}function C(t,n){return void 0===n&&(n=!1),new Promise((function(e){t.draw(n,e)}))}var S=m(uni.getImageInfo),I=m(uni.canvasToTempFilePath),O=g((function(t,n){
/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
(function(e){var r=n,o=t&&t.exports==r&&t,i="object"==typeof f&&f;i.global!==i&&i.window!==i||(e=i);var a=function(t){this.message=t};a.prototype=new Error,a.prototype.name="InvalidCharacterError";var c=function(t){throw new a(t)},u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=/[\t\n\f\r ]/g,d=function(t){t=String(t).replace(s,"");var n=t.length;n%4==0&&(t=t.replace(/==?$/,""),n=t.length),(n%4==1||/[^+a-zA-Z0-9/]/.test(t))&&c("Invalid character: the string to be decoded is not correctly encoded.");var e,r,o=0,i="",a=-1;while(++a<n)r=u.indexOf(t.charAt(a)),e=o%4?64*e+r:r,o++%4&&(i+=String.fromCharCode(255&e>>(-2*o&6)));return i},h=function(t){t=String(t),/[^\0-\xFF]/.test(t)&&c("The string to be encoded contains characters outside of the Latin1 range.");var n,e,r,o,i=t.length%3,a="",s=-1,d=t.length-i;while(++s<d)n=t.charCodeAt(s)<<16,e=t.charCodeAt(++s)<<8,r=t.charCodeAt(++s),o=n+e+r,a+=u.charAt(o>>18&63)+u.charAt(o>>12&63)+u.charAt(o>>6&63)+u.charAt(63&o);return 2==i?(n=t.charCodeAt(s)<<8,e=t.charCodeAt(++s),o=n+e,a+=u.charAt(o>>10)+u.charAt(o>>4&63)+u.charAt(o<<2&63)+"="):1==i&&(o=t.charCodeAt(s),a+=u.charAt(o>>2)+u.charAt(o<<4&63)+"=="),a},p={encode:h,decode:d,version:"0.1.0"};if(r&&!r.nodeType)if(o)o.exports=p;else for(var l in p)p.hasOwnProperty(l)&&(r[l]=p[l]);else e.base64=p})(f)}));function T(t,n){return"data:"+n+";base64,"+t}function k(t){t=t.toLowerCase().replace(/jpg/i,"jpeg");var n=t.match(/png|jpeg|bmp|gif/)[0];return"image/"+n}function W(t){var n="";if("string"===typeof t)n=t;else for(var e=0;e<t.length;e++)n+=String.fromCharCode(t[e]);return O.encode(n)}function M(t,n,e,r,o,i){uni.canvasGetImageData({canvasId:t,x:n,y:e,width:r,height:o,success:function(t){i(t,null)},fail:function(t){i(null,t)}})}function j(t){var n=t.width,e=t.height,r=n*e*3,o=r+54,i=[66,77,255&o,o>>8&255,o>>16&255,o>>24&255,0,0,0,0,54,0,0,0],a=[40,0,0,0,255&n,n>>8&255,n>>16&255,n>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,1,0,24,0,0,0,0,0,255&r,r>>8&255,r>>16&255,r>>24&255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],c=(4-3*n%4)%4,u=t.data,s="",d=n<<2,h=e,p=String.fromCharCode;do{for(var l=d*(h-1),f="",g=0;g<n;g++){var v=g<<2;f+=p(u[l+v+2])+p(u[l+v+1])+p(u[l+v])}for(var b=0;b<c;b++)f+=String.fromCharCode(0);s+=f}while(--h);var w=W(i.concat(a))+W(s);return w}function _(t,n,e,r,o,i,a){void 0===a&&(a=function(){}),void 0===i&&(i="png"),i=k(i),/bmp/.test(i)?M(t,n,e,r,o,(function(t,n){var e=j(t);b(a)&&a(T(e,"image/"+i),n)})):console.error("暂不支持生成'"+i+"'类型的base64图片")}var A={convertToImage:_,convertToBMP:function(t,n){void 0===t&&(t={});var e=t.canvasId,r=t.x,o=t.y,i=t.width,a=t.height;return void 0===n&&(n=function(){}),_(e,r,o,i,a,"bmp",n)}};function L(){var t=this,n=t.width,e=t.height,r=t.id,o=t.targetId,i=t.pixelRatio,a=t.cut,c=a.x;void 0===c&&(c=0);var u=a.y;void 0===u&&(u=0);var s=a.width;void 0===s&&(s=n);var d=a.height;void 0===d&&(d=e),t.updateCanvas=function(n){return t.croperTarget&&t.ctx.drawImage(t.croperTarget,t.imgLeft,t.imgTop,t.scaleWidth,t.scaleHeight),b(t.onBeforeDraw)&&t.onBeforeDraw(t.ctx,t),t.setBoundStyle(t.boundStyle),t.ctx.draw(!1,n),t},t.pushOrigin=t.pushOrign=function(n){return t.src=n,b(t.onBeforeImageLoad)&&t.onBeforeImageLoad(t.ctx,t),S({src:n}).then((function(n){var e=n.width/n.height,r=s/d;return t.croperTarget=n.path,e<r?(t.rectX=c,t.baseWidth=s,t.baseHeight=s/e,t.rectY=u-Math.abs((d-t.baseHeight)/2)):(t.rectY=u,t.baseWidth=d*e,t.baseHeight=d,t.rectX=c-Math.abs((s-t.baseWidth)/2)),t.imgLeft=t.rectX,t.imgTop=t.rectY,t.scaleWidth=t.baseWidth,t.scaleHeight=t.baseHeight,t.update(),new Promise((function(n){t.updateCanvas(n)}))})).then((function(){b(t.onImageLoad)&&t.onImageLoad(t.ctx,t)}))},t.removeImage=function(){return t.src="",t.croperTarget="",C(t.ctx)},t.getCropperBase64=function(t){void 0===t&&(t=function(){}),A.convertToBMP({canvasId:r,x:c,y:u,width:s,height:d},t)},t.getCropperImage=function(n,e){var a=n,h={canvasId:r,x:c,y:u,width:s,height:d},p=function(){return Promise.resolve()};return w(a)&&a.original&&(p=function(){return t.targetCtx.drawImage(t.croperTarget,t.imgLeft*i,t.imgTop*i,t.scaleWidth*i,t.scaleHeight*i),h={canvasId:o,x:c*i,y:u*i,width:s*i,height:d*i},C(t.targetCtx)}),p().then((function(){w(a)&&(h=Object.assign({},h,a)),b(a)&&(e=a);var t=h.componentContext?[h,h.componentContext]:[h];return I.apply(null,t)})).then((function(n){var r=n.tempFilePath;return b(e)?e.call(t,r,null):r})).catch((function(n){if(!b(e))throw n;e.call(t,null,n)}))}}var P=function(t,n,e,r,o){var i,a,c;return i=Math.round(o.x-r.x),a=Math.round(o.y-r.y),c=Math.round(Math.sqrt(i*i+a*a)),t+.001*e*(c-n)};function R(){var t=this;t.src&&(t.__oneTouchStart=function(n){t.touchX0=Math.round(n.x),t.touchY0=Math.round(n.y)},t.__oneTouchMove=function(n){var e,r;if(t.touchended)return t.updateCanvas();e=Math.round(n.x-t.touchX0),r=Math.round(n.y-t.touchY0);var o=Math.round(t.rectX+e),i=Math.round(t.rectY+r);t.outsideBound(o,i),t.updateCanvas()},t.__twoTouchStart=function(n,e){var r,o,i;t.touchX1=Math.round(t.rectX+t.scaleWidth/2),t.touchY1=Math.round(t.rectY+t.scaleHeight/2),r=Math.round(e.x-n.x),o=Math.round(e.y-n.y),i=Math.round(Math.sqrt(r*r+o*o)),t.oldDistance=i},t.__twoTouchMove=function(n,e){var r=t.oldScale,o=t.oldDistance,i=t.scale,a=t.zoom;t.newScale=P(r,o,a,n,e),t.newScale<=1&&(t.newScale=1),t.newScale>=i&&(t.newScale=i),t.scaleWidth=Math.round(t.newScale*t.baseWidth),t.scaleHeight=Math.round(t.newScale*t.baseHeight);var c=Math.round(t.touchX1-t.scaleWidth/2),u=Math.round(t.touchY1-t.scaleHeight/2);t.outsideBound(c,u),t.updateCanvas()},t.__xtouchEnd=function(){t.oldScale=t.newScale,t.rectX=t.imgLeft,t.rectY=t.imgTop})}var E={touchStart:function(t){var n=this,e=t.touches,r=e[0],i=e[1];n.src&&(o(n,!0,null,null),n.__oneTouchStart(r),t.touches.length>=2&&n.__twoTouchStart(r,i))},touchMove:function(t){var n=this,e=t.touches,r=e[0],i=e[1];n.src&&(o(n,null,!0),1===t.touches.length&&n.__oneTouchMove(r),t.touches.length>=2&&n.__twoTouchMove(r,i))},touchEnd:function(t){var n=this;n.src&&(o(n,!1,!1,!0),n.__xtouchEnd())}};function H(){var t=this,n=t.width,e=t.height,r=t.cut,o=r.x;void 0===o&&(o=0);var i=r.y;void 0===i&&(i=0);var a=r.width;void 0===a&&(a=n);var c=r.height;void 0===c&&(c=e),t.outsideBound=function(n,e){t.imgLeft=n>=o?o:t.scaleWidth+n-o<=a?o+a-t.scaleWidth:n,t.imgTop=e>=i?i:t.scaleHeight+e-i<=c?i+c-t.scaleHeight:e},t.setBoundStyle=function(r){void 0===r&&(r={});var u=r.color;void 0===u&&(u="#04b00f");var s=r.mask;void 0===s&&(s="rgba(0, 0, 0, 0.3)");var d=r.lineWidth;void 0===d&&(d=1);var h=d/2,p=[{start:{x:o-h,y:i+10-h},step1:{x:o-h,y:i-h},step2:{x:o+10-h,y:i-h}},{start:{x:o-h,y:i+c-10+h},step1:{x:o-h,y:i+c+h},step2:{x:o+10-h,y:i+c+h}},{start:{x:o+a-10+h,y:i-h},step1:{x:o+a+h,y:i-h},step2:{x:o+a+h,y:i+10-h}},{start:{x:o+a+h,y:i+c-10+h},step1:{x:o+a+h,y:i+c+h},step2:{x:o+a-10+h,y:i+c+h}}];t.ctx.beginPath(),t.ctx.setFillStyle(s),t.ctx.fillRect(0,0,o,e),t.ctx.fillRect(o,0,a,i),t.ctx.fillRect(o,i+c,a,e-i-c),t.ctx.fillRect(o+a,0,n-o-a,e),t.ctx.fill(),p.forEach((function(n){t.ctx.beginPath(),t.ctx.setStrokeStyle(u),t.ctx.setLineWidth(d),t.ctx.moveTo(n.start.x,n.start.y),t.ctx.lineTo(n.step1.x,n.step1.y),t.ctx.lineTo(n.step2.x,n.step2.y),t.ctx.stroke()}))}}var B="1.3.9",z=function(t){var n=this,e={};return i(n,d),Object.keys(d).forEach((function(t){e[t]=d[t].default})),Object.assign(n,e,t),n.prepare(),n.attachPage(),n.createCtx(),n.observer(),n.cutt(),n.methods(),n.init(),n.update(),n};return z.prototype.init=function(){var t=this,n=t.src;return t.version=B,"function"===typeof t.onReady&&t.onReady(t.ctx,t),n?t.pushOrign(n):t.updateCanvas(),o(t,!1,!1,!1),t.oldScale=1,t.newScale=1,t},Object.assign(z.prototype,E),z.prototype.prepare=l,z.prototype.observer=x,z.prototype.methods=L,z.prototype.cutt=H,z.prototype.update=R,z}))}).call(this,e("c8ba"))},cb29:function(t,n,e){var r=e("23e7"),o=e("81d5"),i=e("44d2");r({target:"Array",proto:!0},{fill:o}),i("fill")},d2a5:function(t,n,e){"use strict";e.r(n);var r=e("dac5"),o=e.n(r);for(var i in r)"default"!==i&&function(t){e.d(n,t,(function(){return r[t]}))}(i);n["default"]=o.a},dac5:function(t,n,e){"use strict";var r=e("4ea4");e("a9e3"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=r(e("a7e8")),i={props:{boundStyle:{type:Object,default:function(){return{lineWidth:4,borderColor:"rgb(245, 245, 245)",mask:"rgba(0, 0, 0, 0.35)"}}}},data:function(){return{bottomNavHeight:50,originWidth:200,width:0,height:0,cropperOpt:{id:"cropper",targetId:"targetCropper",pixelRatio:1,width:0,height:0,scale:2.5,zoom:8,cut:{x:(this.width-this.originWidth)/2,y:(this.height-this.originWidth)/2,width:this.originWidth,height:this.originWidth},boundStyle:{lineWidth:uni.upx2px(this.boundStyle.lineWidth),mask:this.boundStyle.mask,color:this.boundStyle.borderColor}},destWidth:200,rectWidth:200,fileType:"jpg"}},onLoad:function(t){var n=this,e=uni.getSystemInfoSync();if(this.width=e.windowWidth,this.height=e.windowHeight-this.bottomNavHeight,this.cropperOpt.width=this.width,this.cropperOpt.height=this.height,this.cropperOpt.pixelRatio=e.pixelRatio,t.destWidth&&(this.destWidth=t.destWidth),t.rectWidth){var r=Number(t.rectWidth);this.cropperOpt.cut={x:(this.width-r)/2,y:(this.height-r)/2,width:r,height:r}}this.rectWidth=t.rectWidth,t.fileType&&(this.fileType=t.fileType),this.cropper=new o.default(this.cropperOpt).on("ready",(function(t){})).on("beforeImageLoad",(function(t){})).on("imageLoad",(function(t){})).on("beforeDraw",(function(t,n){})),uni.setNavigationBarColor({frontColor:"#ffffff",backgroundColor:"#000000"}),setTimeout((function(){n.cropper.pushOrign(t.myImgUrl)}),0)},methods:{touchStart:function(t){this.cropper.touchStart(t)},touchMove:function(t){this.cropper.touchMove(t)},touchEnd:function(t){this.cropper.touchEnd(t)},getCropperImage:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n={destHeight:Number(this.destWidth),destWidth:Number(this.destWidth),fileType:this.fileType};this.cropper.getCropperImage(n,(function(n,e){e?uni.showModal({title:"温馨提示",content:e.message}):t?uni.previewImage({current:"",urls:[n]}):(uni.$emit("uAvatarCropper",n),uni.navigateBack({delta:1}))}))},uploadTap:function(){var t=this;uni.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(n){var e=n.tempFilePaths[0];t.cropper.pushOrign(e)}})}}};n.default=i},fc31:function(t,n,e){var r=e("24fb");n=r(!1),n.push([t.i,"\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n/* nvue不能用标签命名样式 */\nuni-image[data-v-38ccaed8]{display:inline-block;\r\n\t/* 解决图片加载时可能会瞬间变形的问题 */will-change:transform}\r\n/* 在weex，也即nvue中，所有元素默认为border-box */uni-view[data-v-38ccaed8],\r\nuni-text[data-v-38ccaed8]{-webkit-box-sizing:border-box;box-sizing:border-box}\n.content[data-v-38ccaed8]{background:#fff}.cropper[data-v-38ccaed8]{position:absolute;top:0;left:0;width:100%;height:100%;z-index:99999999999999}.cropper-buttons[data-v-38ccaed8]{background-color:#000;color:#eee}.cropper-wrapper[data-v-38ccaed8]{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%;background-color:#000}.cropper-buttons[data-v-38ccaed8]{width:100vw;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;position:fixed;bottom:0;left:0;font-size:%?28?%}.cropper-buttons .upload[data-v-38ccaed8],\r\n.cropper-buttons .getCropperImage[data-v-38ccaed8]{width:50%;text-align:center}.cropper-buttons .upload[data-v-38ccaed8]{text-align:left;padding-left:%?50?%}.cropper-buttons .getCropperImage[data-v-38ccaed8]{text-align:right;padding-right:%?50?%}",""]),t.exports=n}}]);