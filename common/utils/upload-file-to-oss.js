import {
	message
} from './message.js'
import {
	http
} from '@/common/api/index.js';

export default class UploadFileToOSS {

	/**
	 * [constructor description]
	 * @param  {[Array]} files [chooseImg选中的tempFilePaths、chooseVideo选中的rempFilePath]
	 * @param  {[Object]} json  [success每上传成功一张调用 complete全部上传完成调用]
	 * @return {[void]}       [description]
	 */

	constructor(files, json) {
		if (!Array.isArray(files)) {
			throw new Error('Class UploadFileToOSS parameter must be an array');
		}
		this.data = [];
		this.fn = json.success;
		this.complete = json.complete;
		this.files = files;
		this.fileLen = this.files.length;
		this.curIndex = 0;
		uni.showLoading({
			title: '上传中'
		});
		this.upload();
	}

	upload() {
		http.get(global.apiUrls.queryAutograph).then(res => {
			console.log(res)
			if (res.data.code == 200) {
				let ossData = res.data.data;
				let str = "abcdefghijklmnopqrstuvwxyz9876543210";
				let tmp = "",
					i = 0,
					l = str.length;
				for (i = 0; i < 10; i++) {
					tmp += str.charAt(Math.floor(Math.random() * l));
				}
				ossData.key = new Date().getTime() + '' + tmp + '';
				console.log(ossData)
				uni.uploadFile({
					url: ossData.host,
					filePath: this.files[this.curIndex],
					name: 'file',
					formData: {
						key: ossData.key, // 文件名
						policy: ossData.policy, // 后台获取超时时间
						OSSAccessKeyId: ossData.accessid, // 后台获取临时ID
						success_action_status: 200, // 让服务端返回200,不然，默认会返回204
						signature: ossData.signature // 后台获取签名
					},
					success: res => {
						console.log(res);
						if (res.statusCode == 200) {
							this.data.push({
								id: ossData.key,
								path: ossData.host + '' + ossData.key
							});
							if (this.fn) this.fn(this.data);
						} else {
							message.info('上传失败，请重试')
						}
					},
					complete: (even) => {
						console.log(even)
						this.curIndex++; // 当前文件执行完上传后，开始上传下一张
						if (this.curIndex == this.fileLen) { // 当文件传完时，停止调用
							this.complete(this.data);
							uni.hideLoading()
						} else { // 若文件还没有传完，则继续调用函数
							this.upload();
						}
					}
				});
			}
		})

	}
}
