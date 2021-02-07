import Vue from 'vue';
import App from './App';
import popup from './common/api/popup.js';
import store from './store/index.js';
// main.js
import socket from '@/common/scoket/index.js';

// // #ifdef APP-PLUS
// Object.assign(uni, socket)
// // #endif
// xs 添加的提示弹窗 封装 uni的提示弹窗
Vue.prototype.$popup = popup;

Vue.prototype.$store = store;

/*===============================================================
=                           global user info                    =
===============================================================*/
global.token = '';
global.userInfo = null; // 用户信息
global.loginInfo = null; //注册信息

// 获取账户信息
try {
	const USER_TOKEN = uni.getStorageSync('USER_TOKEN');
	const USER_INFO = uni.getStorageSync('USER_INFO');
	global.token = USER_TOKEN || '';
	if (USER_INFO) global.userInfo = USER_INFO;
	global.userInfo = USER_INFO;
} catch (e) {}

/*===============================================================
=                           components                  =
===============================================================*/

import cuCustom from '@/components/cu-custom/cu-custom.vue' //自定义头部
Vue.component('cu-custom',cuCustom)
import fuNotwork from '@/components/fu-notwork/fu-notwork.vue' //断网提示
Vue.component('fu-notwork',fuNotwork)
import uImage from './components/u-image/u-image.vue'//图片懒加载
Vue.component('u-image', uImage)
import cuCard from './components/cu-card/cu-card.vue' //动态 动态详情
Vue.component('cu-card', cuCard)
import cuComplain from './components/cu-complain/cu-complain.vue' //投诉
Vue.component('cu-complain', cuComplain)
import cuNone from './components/cu-none/cu-none.vue' //暂无数据
Vue.component('cu-none', cuNone)
import uniPopup from '@/components/uni-popup/uni-popup.vue'  //弹窗
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'  //弹窗
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'  //弹窗
Vue.component('uni-popup', uniPopup)
Vue.component('uni-popup-message', uniPopupMessage)
Vue.component('uni-popup-dialog', uniPopupDialog)
 
/*======================================================================
=                    global attributes and methods                     =
======================================================================*/

import apiUrls from '@/common/api/url.js'
import {
	http
} from '@/common/api/index.js';
import {
	message,
	Router,
	Dayjs
} from '@/common/utils/index.js';
import {
	IMG_BASE_URL,
	SYSTEM_CONFIG,
	PAGE_SIZE,
	VERSION_CODE,
	IS_DEV
} from '@/common/config.js';
import utils from '@/common/utils/utils';

const router = new Router({
	needLoginPages: [
		'/pages/home/trucksfrom',
		'/pages/home/maintainfrom',
		'/pages/home/refuelfrom',
		'/pages/home/machineryfrom',
		'/pages/home/purchasefrom',
		'/pages/home/artificialfrom'
	],



});

Vue.config.productionTip = false;
Vue.prototype.$urouter = router;
Vue.prototype.$api = http;
Vue.prototype.$message = message;
Vue.prototype.$util = utils;

Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})


global.apiUrls = apiUrls;
global.imgBaseUrl = IMG_BASE_URL;
global.IS_DEV = IS_DEV;
global.PAGE_SIZE = PAGE_SIZE;
global.VERSION_CODE = VERSION_CODE;
global.SYSTEM_CONFIG = SYSTEM_CONFIG;


/*=================================================================
=                          global filters                         =
=================================================================*/


// 识别图片路径是否为全路径 若不是则进行拼接
Vue.filter('assembleImgSrc', src => {
	src = src || ''
	return src.indexOf('http://') != -1 || src.indexOf('https://') != -1 ?
		src :
		IMG_BASE_URL + src;
});

// 日期格式转换
Vue.filter('formatDate', (date, format = 'YYYY-MM-DD') => {
	return Dayjs(date).format(format);
});

// 取整
Vue.filter('integerFilter', (price) => {
	if (price) {
		return Math.floor(price);
	} else {
		return 0;
	}
})

/*==================================================================
=                           global mixins                          =
==================================================================*/

Vue.mixin({
	data() {
		return {

		}
	},
	methods: {
		// 页面跳转
		handleJump(e) {
			let target = e.currentTarget || e.target,
				url = target.dataset.url,
				type = target.dataset.type;
				console.log(type)
			if (url == '' || url == '#') return;
			switch (type) {
				case 'SWITCH':
					router.switchTab(url);
					break;
				case 'REDIRECT':
					router.redirectTo(url);
					break;
				case 'RELAUNCH':
					router.reLaunch(url);
					break;
				case 'BACK':
					router.navigateBack();
					break;
				default:
					router.navigateTo(url);
					break;
			}
		},
		// 判断是否登录
		judgeLogin() {
			if (!global.userInfo) return uni.navigateTo({
				url: "/pages/login"
			})
		},
	}
})

/*==================  End of global mixins  =====================*/



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
