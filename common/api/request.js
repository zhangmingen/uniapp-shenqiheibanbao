const TABS_URL = []
export default class Request {
	config = {
		baseUrl: '',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'GET',
		dataType: 'json',
		responseType: 'text',
		success() {},
		fail() {},
		complete() {}
	}

	static posUrl(url) { /* 判断url是否为绝对路径 */
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	interceptor = {
		request: (f) => {
			if (f) {
				this.requestBeforeFun = f
			}
		},
		response: (f) => {
			if (f) {
				this.requestComFun = f
			}
		}
	}

	static requestBeforeFun(config) {
		return config
	}

	static requestComFun(response) {
		return response
	}

	setConfig(f) {
		this.config = f(this.config)
		console.log(this.config)
		return this
	}

	request(options = {}) {
		// xs  添加 缓存
		let CACHE_SIZE = uni.getStorageSync('CACHE_SIZE') || 0;
		CACHE_SIZE += 0.09 * 1;
		// console.log(CACHE_SIZE)
		uni.setStorageSync('CACHE_SIZE', Math.round(CACHE_SIZE * 100) / 100);

		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = Request.posUrl(options.url) ? options.url : (options.baseUrl + options.url)
		options.data = options.data || {}
		options.header = options.header || this.config.header
		options.method = options.method || this.config.method
		if (options['Content-Type']) options.header['Content-Type'] = options['Content-Type']
		return new Promise((resolve, reject) => {
			let next = true
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				response = this.requestComFun(response)
				if (statusCode != 200) {
					let errMessage = '';
					switch (statusCode) {
						case 400:
							errMessage = '请求错误(400)';
							break;
						case 401:
							errMessage = '未授权，请重新登录(401)';
							uni.showToast({
								title: '登录失效',
								icon: 'none',
								position: 'bottom',
								duration: 1500
							})
							global.token = ''
							global.userInfo = null
							uni.removeStorageSync('USER_TOKEN')
							uni.removeStorageSync('USER_INFO')
							uni.$emit('appLoginOut', {
								msg: '用户退出登录了'
							})
							let pages = getCurrentPages()
							// 如果登陆失效 判断是否在底部栏页面 如果是则通知底部栏 如果不是则返回上一页
							if (pages.length > 1 && !TABS_URL.includes(pages[pages.length - 1]['route'])) {
								uni.navigateBack();
							}
							break;
						case 403:
							errMessage = '拒绝访问(403)';
							break;
						case 404:
							errMessage = '请求出错(404)';
							break;
						case 408:
							errMessage = '请求超时(408)';
							break;
						case 500:
							errMessage = '服务器错误(500)';
							break;
						case 501:
							errMessage = '服务未实现(501)';
							break;
						case 502:
							errMessage = '网络错误(502)';
							break;
						case 503:
							errMessage = '服务不可用(503)';
							break;
						case 504:
							errMessage = '网络超时(504)';
							break;
						case 505:
							errMessage = 'HTTP版本不受支持(505)';
							break;
						default:
							errMessage = "连接出错!";
							break;
					}

					if (statusCode != 401) {
						uni.showToast({
							title: errMessage,
							icon: 'none',
							position: 'bottom',
							duration: 1500
						})
						uni.$emit('netWorkError', {
							msg: '服务器太拥挤了~请您稍后重试'
						})
					}
					reject({
						statusCode,
						errMessage
					})
				} else {
					if (response.data.code == '-201') {
						uni.showToast({
							title: '登录失效 请重新登录',
							icon: 'none',
							position: 'bottom',
							duration: 1000
						})
						global.token = ''
						global.userInfo = null
						uni.removeStorageSync('USER_TOKEN')
						uni.removeStorageSync('USER_INFO')

						uni.reLaunch({
							url: '/pages/login'
						});
					} else {
						resolve(response)
					}
				}
			}
			let cancel = (t = 'handle cancel') => {
				let err = {
					errMsg: t,
					config: afC
				}
				reject(err)
				next = false
			}
			let afC = { ...this.config,
				...options
			}
			_config = { ...afC,
				...this.requestBeforeFun(afC, cancel)
			}
			if (!next) return
			uni.request(_config)
		})
	}

	get(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	}

	post(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}
