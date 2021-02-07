<template>
	<view class="chat-box">
		<scroll-view :key="toUpdate" @scroll="scrollFun" :scroll-top="scrollTop" class="cbc-scrool padding-bottom-xl"
		 :scroll-y="true" :scroll-into-view="scrollIntoView" @scrolltoupper="getLists" :upper-threshold="0" :style="{bottom: (showFace ? '500rpx' : showMore ? '320rpx' : '100rpx')}">
			<view id="scrollview" class="chat-box">
				<block v-for="(item,index) in msg_list" :key='index'>
					<view :id="`item${index}`" class="cb-main">
						<view class="chat-time" v-if="item.create_time">
							<text>{{item.create_time}}</text>
						</view>

						<!-- 自己说的话start -->
						<view v-if="item.from_id==userInfo.id" class="chat-row me">
							<view class="chat-img">
								<image :src="item.from_avatar"></image>
							</view>
							<view class="chat-txt" :class="item.type=='img' ? 'no_bj' : ''">
								<!-- <text selectable="true"></text> -->
								<image mode="heightFix" :src="analysisImg(item.content)" v-if="item.type=='img'" @click='previewImg(item.content)'>
									<text v-html='replaceEmoji(item)' v-else></text>
									<!-- <u-image v-if="item.msg_type == 2" @tap='previewImg(item.content)' width="300rpx" height="300rpx" :src="item.content"
								 mode="aspectFit"></u-image> -->
							</view>

						</view>
						<!-- 自己说的话end -->
						<!-- 他人说的话start -->
						<view v-else-if="item.from_id" class="chat-row">
							<view class="chat-img">
								<image :src="item.from_avatar" mode=""></image>
							</view>
							<view class="cr-box">
								<!-- 他人名字 -->
								<!-- <view class="crb-name" v-if="roomData.type==2">
									{{item.nickname}}
								</view> -->
								<view class="chat-txt" :class="item.type=='img' ? 'no_bj' : ''">
									<image mode="heightFix" :src="analysisImg(item.content)" v-if="item.type=='img'" @click='previewImg(item.content)'>
										<text v-html='replaceEmoji(item)' v-else></text>
										<!-- <u-image v-if="item.msg_type == 2" @click='previewImg(item.content)' width="300rpx" height="300rpx" :src="item.content"
									 mode="aspectFit"></u-image> -->
								</view>

							</view>

						</view>
						<!-- 系统消息 -->
						<view class="system" v-else>
							<text v-html="item.content"></text>
						</view>
						<!-- 系统消息end -->
					</view>
				</block>
			</view>
			<!-- 			<view class="padding-tb-sm visibility" id="items999">0</view>
			<view class="visibility" id="items9999">0</view> -->
		</scroll-view>

		<!-- <view class="recordPop"> -->
		<view class="recordPop" v-if="record">
			<view class="rp-main">
				<image src="/static/xs_icon/record.png" mode=""></image>
				<view class="rpm-text">
					{{cancelRecord?'取消发送':'上滑取消'}}
				</view>
			</view>
		</view>

		<!-- </view> -->
		<view class="bottom bottom-prohibit" v-if="!input_show">
			<!-- <button class="prohibit" type="default">禁言</button> -->
			<view class="prohibit">
				暂不能发送消息
			</view>
		</view>
		<view class="bottom" :style="{bottom: (showFace ? '400rpx' : showMore ? '220rpx' : 0)}" v-else>
			<input type="text" :focus="inputfocus" v-model="messageContent" @confirm="sendMsg(messageContent.trim(),'text')"
			 confirm-type="send" />
			<image src="/static/ye_icon/3607.png" mode="" @tap="handleToggleFace"></image>
			<image v-if="showFace == false" src="/static/ye_icon/3606.png" mode="" @tap="handleToggleMore"></image>
			<text v-else-if="showFace" @click="sendMsg(messageContent.trim(),'text')">发送</text>
		</view>


		<!-- 表情包 -->
		<view class="face-box-wapper" v-show="showFace">
			<!-- <view class="face-box-mask" @touchmove.stop.prevent @tap="handleToggleFace"></view> -->
			<scroll-view class="face-box" scroll-y>
				<image @tap="handleTapFace(item.name)" v-for="item,index in faceImage" :key="index" :data-name="index+1" class="avatar"
				 mode="aspectFill" :src="item.image"></image>
			</scroll-view>
			<view class="delete-box" @click="onDelete()">
				<image class="delete" src="/static/xs_icon/delete.png" mode=""></image>
			</view>
		</view>
		<!-- 表情包 -->

		<!-- 更多功能 -->
		<view class="face-box-wapper more" v-show="showMore">
			<!-- <view class="face-box-mask" @touchmove.stop.prevent @tap="handleToggleMore"></view> -->
			<view class="more-box">
				<!-- #ifdef APP-PLUS -->
				<view class="item" @tap="handleChooseImage('camera')">
					<image src="/static/ye_icon/3599.png"></image>
					<view class="name">拍照</view>
				</view>
				<!-- #endif -->
				<view class="item" @tap="handleChooseImage('album')">
					<image src="/static/ye_icon/3594.png"></image>
					<view class="name">照片</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	var timer = null;
	var that;
	import face from '@/static/face.json';
	import {
		UploadImage,
		UploadFileToOSS
	} from '@/common/utils/index';
	import {
		API_BASE_URL
	} from '@/common/config.js';
	const {
		windowHeight,
		statusBarHeight
	} = uni.getSystemInfoSync()
	// scoket状态
	var socketOpen = false;
	var commChat = 1;
	var kf_id = 0;
	// #ifdef APP-PLUS
	import permision from "@/common/permission.js";
	// #endif
	export default {
		data() {
			let scrollViewHeight = windowHeight - uni.upx2px(100)
			// #ifdef H5
			scrollViewHeight = windowHeight - uni.upx2px(100) - uni.upx2px(88)
			// #endif
			return {


				soundRecord: false, // 录音按钮显示
				playSound: false, // 录音播放状态
				inputfocus: false, // 输入框聚焦
				record: false, // 开始录音
				scrollTop: 0, // 聊天框 滚动条
				keyboardHeight: 0, // 键盘高度
				compatible: 0, // 兼容表情 和 键盘遮盖
				toUpdate: 0, // 利用时间 绑定 key 刷新
				from_id: 11, //自己的用户id
				showFace: false, //更多表情弹窗
				showMore: false, //更多功能弹窗
				scrollViewHeight: scrollViewHeight, //初始化scroll高度
				faceImage: face,
				faceImageAdmin: ["[微笑]", "[伤心]", "[美女]", "[发呆]", "[墨镜]", "[哭]", "[羞]", "[哑]", "[睡]", "[哭]", "[囧]", "[怒]", "[调皮]",
					"[笑]", "[惊讶]", "[难过]",
					"[酷]", "[汗]", "[抓狂]", "[吐]", "[笑]", "[快乐]", "[奇]", "[傲]", "[饿]", "[累]", "[吓]", "[汗]", "[高兴]", "[闲]", "[努力]",
					"[骂]",
					"[疑问]", "[秘密]", "[乱]", "[疯]", "[哀]", "[鬼]", "[打击]", "[bye]", "[汗]", "[抠]", "[鼓掌]", "[糟糕]", "[恶搞]", "[什么]", "[什么]",
					"[累]", "[看]", "[难过]", "[难过]", "[坏]", "[亲]", "[吓]", "[可怜]", "[刀]", "[水果]", "[酒]", "[篮球]", "[乒乓]", "[咖啡]", "[美食]",
					"[动物]", "[鲜花]", "[枯]", "[唇]", "[爱]", "[分手]", "[生日]", "[电]", "[炸弹]", "[刀子]", "[足球]", "[瓢虫]", "[翔]", "[月亮]", "[太阳]",
					"[礼物]", "[抱抱]", "[拇指]", "[贬低]", "[握手]", "[剪刀手]", "[抱拳]", "[勾引]", "[拳头]", "[小拇指]", "[拇指八]", "[食指]", "[ok]", "[情侣]",
					"[爱心]", "[蹦哒]", "[颤抖]", "[怄气]", "[跳舞]", "[发呆]", "[背着]", "[伸手]", "[耍帅]", "[微笑]", "[生病]", "[哭泣]", "[吐舌]", "[迷糊]",
					"[瞪眼]",
					"[恐怖]", "[忧愁]", "[眨眉]", "[闭眼]", "[鄙视]", "[阴暗]", "[小鬼]", "[礼物]", "[拜佛]", "[力量]", "[金钱]", "[蛋糕]", "[彩带]", "[礼物]"
				],
				/**
				 * msg_type 信息类型  1=文字信息 2=图片信息 3=语音 
				 * */
				say_list: [],
				// xs
				page: 1,
				chat_type: '', // chat_type  类型 1 单聊    2 群聊
				to_id: '', // 对方的id
				rooom_id: '', // 群聊房间id
				roomName: '',

				lord: '', // 群主id
				roomInfo: {},
				redInfo: {
					content: {
						intro: '',
						source: '',
						total_money: ''
					}
				},

				// 1/20 zme
				userInfo: global.userInfo, //用户信息
				messageContent: '', // 消息
				pages: {
					current_page: 1, //当前页
					last_page: 1, //总页数
				}, //聊天记录分页
				scrollIntoView: '', //scroll滚动位置
				duration: 0, // 发送语音的时长
				durationState: false, // 录音计时状态
				initPoint: 0, //点击录音记录当前位置
				touchesY: 0, //滑动距离
				cancelRecord: false, // 取消发送
				operation: "", //弹出操作栏的数据
				sendStatus: true, //发送状态
				msg_list: [], //聊天记录列表
				input_show: true, //客服是否在线
				kf_id: 0, //客服id
				customer: {}, //客服信息
			};
		},
		onLoad(e) {
			that = this;
			this.showMore = false; //更多表情弹窗
			this.showFace = false; //更多功能弹窗
			// 监听键盘高度
			uni.onKeyboardHeightChange(res => {
				console.log(res.height)
				// this.keyboardHeight = res.height;
				// if (res.height != 0) {
				// 	this.showFace = false;
				// 	this.showMore = false;
				// 	this.inputfocus = true;
				// }
			})
			uni.closeSocket();
			// 链接socket
			uni.connectSocket({
				url: 'ws://47.105.125.106:32321',
				success(res) {
					console.log('连接客服socket成功', res)
				}
			})


			// 接收socket消息
			uni.onSocketOpen(res => {
				// sendSocketMessage 通过 WebSocket 连接发送数据
				uni.sendSocketMessage({
					data: JSON.stringify({
						type: 'userInit',
						uid: that.userInfo.id,
						name: that.userInfo.user_nickname,
						avatar: that.userInfo.head_img,
						group: '1',
					})
				})
				socketOpen = true

			})

			uni.onSocketMessage(function(res) {
				var data = JSON.parse(res.data);
				console.log("监听WebSocket接受到服务器的消息事件", data);

				switch (data.message_type) {
					// 服务端ping客户端
					case 'ping':
						that.sendSocketMessage('{"type":"ping"}');
						break;
						// 已经被分配了客服
					case 'connect':
						uni.setStorageSync('kf_id', data.data.kf_id);
						if (1 == commChat) {
							that.customer = data.data;
							that.kf_id = data.data.kf_id;
							// 获取聊天记录
							that.getListData(data.data.kf_id);
						}
						break;
						// 排队等待
					case 'wait':
						if (data.data.code == 0) {
							//0客服不在线1排队
							that.input_show = false;
							that.showMsg(data.data, 'text');
							that.closeSocket();
						}
						//showSystem(data.data);
						break;
						// 监测聊天数据
					case 'chatMessage':
						that.showMsg(data.data, data.data.type);
						// #ifdef APP-PLUS
						var webView = that.$mp.page.$getAppWebview();
						if (that.msg_list.length > 4) {
							webView.setStyle({
								'softinputMode': 'adjustPan'
							});
						} else {
							webView.setStyle({
								'softinputMode': 'adjustResize'
							});
						}
						// #endif
						break;
						// 问候语
					case 'helloMessage':
						that.showMsg(data.data, 'text');
						break;
						// 转接
					case 'relinkMessage':
						commChat = 2;
						document.getElementById('title').innerHTML = '正在转接中...';
						break;
				}
			});
			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！', res);
			});
		},
		// 监听返回
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.onreturn();
			return true;
		},
		// 监听页面卸载
		// onUnload() {
		// 	// 离开页面连接聊天scoket
		// 	uni.$emit('initSuccess');
		// },
		methods: {
			onreturn() {
				// 离开页面连接聊天scoket
				uni.$emit('initSuccess');
				uni.switchTab({
					url: '/pages/message/index'
				})
			},
			// 发送scoket消息
			sendSocketMessage(msg) {
				uni.sendSocketMessage({
					data: msg,
					success: function(res) {
						console.log(res);
					}
				});
			},
			// 关闭scoket
			closeSocket() {
				if (socketOpen) {
					uni.closeSocket();
				}
				uni.onSocketClose(function(res) {
					console.log('WebSocket 已关闭！');
				});
			},
			// 发送消息
			sendMsg(content, type) {
				if ('text' == type && !content) {
					return this.$message.info("请输入发送内容");
				}
				this.messageContent = "";
				var nowDate = new Date();
				let lastid = 0
				// return console.log(this.msg_list.length)
				if (this.msg_list.length > 0) {
					lastid = this.msg_list[this.msg_list.length - 1].aid;
				}
				lastid++;
				let msg = {
					aid: lastid,
					from_id: that.userInfo.id,
					from_name: that.userInfo.user_nickname,
					from_avatar: that.userInfo.head_img,
					create_time: "",
					// nowDate.getHours() + ':' + (nowDate.getMinutes() > 9 ? nowDate.getMinutes() : '0' + nowDate.getMinutes())
					type: type,
					content: content,
					to_id: this.kf_id,
					to_name: this.customer.kf_name,
				};
				console.log(msg);
				this.screenMsg(msg);
				let send_data = JSON.stringify({
					type: 'chatMessage',
					data: {
						to_id: this.kf_id,
						to_name: this.customer.kf_name,
						content: content,
						type: type,
						from_name: that.userInfo.user_nickname,
						from_id: that.userInfo.id,
						from_avatar: that.userInfo.head_img
					}
				});
				this.sendSocketMessage(send_data);
			},
			showMsg(data, type) {
				var nowDate = new Date();
				console.log(data)
				let lastid = 0;
				var content;
				if (this.msg_list.length > 0) {
					lastid = this.msg_list[this.msg_list.length - 1].aid;
				}
				lastid++;
				// if (type != 'img') {
				// 	content = this.replaceEmoji(data.content);
				// } else {
				// 	content = data.content;
				// }
				let msg = {
					aid: lastid,
					from_id: data.id,
					from_name: data.name,
					from_avatar: data.avatar,
					create_time: "",

					type: type || 'text',
					content: data.content,
					to_id: that.userInfo.id,
					to_name: that.userInfo.user_nickname,
				};
				console.log(msg, '显示数据');
				this.screenMsg(msg);
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(row) {
				if (typeof row.content == 'object') {
					return row;
				}
				let url = row.content;
				let pa = /.*\[(.*)\]/;
				let path = url.match(pa) ? url.match(pa)[1] : '';
				row.content = path || row.content;
				return row;
			},
			// 接受消息(筛选处理)
			screenMsg(msg) {
				//从长连接处转发给这个方法，进行筛选处理
				console.log(msg)
				if (msg.from_id != this.userInfo.id) {
					uni.vibrateLong();
				}

				switch (msg.type) {
					case 'text':
						this.addTextMsg(msg);
						break;
					case 'voice':
						this.addVoiceMsg(msg);
						break;
					case 'img':
						this.addImgMsg(msg);
						break;
				}
				this.rollScrollview()
			},
			// 处理文字消息
			addTextMsg(msg) {
				this.msg_list.push(msg);
				this.rollScrollview()
			},
			// 处理语音消息
			addVoiceMsg(msg) {
				this.msg_list.push(msg);
				this.rollScrollview()
			},
			// 处理图片消息
			addImgMsg(msg) {
				// msg = this.setPicSize(msg);
				this.msg_list.push(msg);
				this.rollScrollview()
			},
			// 滚动条发生变化
			scrollFun() {
				this.scrollIntoView = ""
			},
			// 获取聊天记录 page是否获取分页数据
			getListData(id, page = 1) {
				var _this = this;
				console.log(id, '获取聊天记录');
				this.$api.post(global.apiUrls.chat_history_list, {
					kid: id,
					page: page
				}).then(res => {
					if (res.data.code == 1) {
						console.log(res.data.data)
						this.msg_list = res.data.data;
						this.rollScrollview();
					} else {
						this.$message.info(res.data.msg)
					}
					// #ifdef APP-PLUS
					var webView = _this.$mp.page.$getAppWebview();
					if (_this.msg_list.length > 4) {
						webView.setStyle({
							'softinputMode': 'adjustPan'
						});
					} else {
						webView.setStyle({
							'softinputMode': 'adjustResize'
						});
					}
					// #endif
				});
			},

			// 滚动到最顶部 zme
			getLists(e) {
				// this.getListData(this.data.kf_id, this.page + 1)
			},
			//  滚动到最底部
			rollScrollview() {
				// var _this = this;
				// _this.scrollIntoView = '';
				// _this.$nextTick(function() {
				// 	_this.scrollIntoView = 'items9999';
				// 	setTimeout(function() {
				// 		_this.scrollIntoView = 'items9999';
				// 	}, 50)
				// })
				this.scrollTop += 99999;
				setTimeout(() => {
					this.scrollTop += 999999;
				}, 100)
				setTimeout(() => {
					this.scrollTop += 999999;
				}, 200)
			},
			// 拍照、照片
			handleChooseImage(e) {
				switch (e) {
					case 'camera':
						console.log("拍照，相机")
						this.sendIMG(e);
						break;
					case 'album':
						console.log("照片")
						this.sendIMG(e);
						break;
				}
			},
			// 发送图片
			sendIMG(e) {
				var _this = this;
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册选择
					success: (res) => {
						this.$popup.showLoading('发送图片...')
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths)
						for (let i = 0; i < tempFilePaths.length; i++) {
							_this.uploadImg([tempFilePaths[i]])
						}
					}
				});
			},
			// 上传图片
			uploadImg(tempFilePaths) {
				let _this = this;
				console.log(tempFilePaths)
				new UploadImage(tempFilePaths, {
					complete: function(res) {
						let msg = 'img[' + res[0].path + ']';

						_this.sendMsg(msg, 'img');
					}
				});
			},

			// 点击放大图片
			previewImg(e) {
				var url = this.analysisImg(e);
				if (url) {
					uni.previewImage({
						urls: [url]
					});
				}

			},
			// 表情
			handleTapFace(e) {
				console.log(e)
				this.messageContent += e;
			},
			// 表情列表 右下角的删除
			onDelete() {
				const str = this.messageContent;
				this.messageContent = str.slice(0, str.length - 1)

			},
			// 切换表情
			handleToggleFace() {
				this.inputfocus = false;
				this.showFace = !this.showFace
				this.showMore = false;
				this.soundRecord = false;
				// if
				setTimeout(() => {
					this.rollScrollview()
				}, 100)
			},
			// 切换更多盒子显示与隐藏
			handleToggleMore() {
				this.inputfocus = false;
				this.showMore = !this.showMore
				this.showFace = false;
				this.soundRecord = false;
				setTimeout(() => {
					this.rollScrollview()
				}, 100)

			},
			analysisImg(str) {
				// 正则表达式匹配内容
				var ind = str.indexOf('img[');
				if (ind != -1) {
					let url = str;
					let pa = /.*\[(.*)\]/;
					let path = url.match(pa) ? url.match(pa)[1] : '';
					return path;
				}
			},
			//替换表情符号为图片
			replaceEmoji(item) {
				var str = item.content;
				// 正则表达式匹配内容
				var ind = str.indexOf('img[');
				var ind1 = str.indexOf('emoji[');
				if (ind != -1) {
					let url = str;
					let pa = /.*\[(.*)\]/;
					let path = url.match(pa) ? url.match(pa)[1] : '';
					item.type = 'img';
					return '<image height="150px" mode="widthFix"  src="' + path + '">'
				} else if (ind1 != -1) {
					let replacedStr = str.replace(/emoji\[([^\s\[\]]+?)\]/g, (item, index) => {
						var alt = item.replace(/^emoji/g, '');
						let face = this.faceImageAdmin.findIndex((sub, index) => {
							return sub == alt;
						});
						var imgType = (Number(face) + 100)>=200 ? '.png':'.gif'
						return face ? '<img style="vertical-align: middle; width:24px;height:24px; display: inline-block;" src="' +
							'http://www.sqhbb.com/static/images/emoji/' + (Number(face) + 100) + imgType + '">' : item
					});
					return '<div style="vertical-align: middle; align-items: center;word-break: break-all; word-break: break-word;">' +
						replacedStr + '</div>';
				} else {
					let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
						let face = this.faceImage.find(sub => sub.name == item)
						return face ? '<img style="vertical-align: middle; width:24px;height:24px; display: inline-block;" src="' +
							face
							.image.replace('/static/', 'http://www.sqhbb.com/') + '">' : item
					});
					return '<div style="vertical-align: middle; align-items: center;word-break: break-all; word-break: break-word;">' +
						replacedStr + '</div>';
				}
			},


		},
		// 监听导航右边点击事件
		onNavigationBarButtonTap(e) {

			if (this.roomData.type == 1) {
				uni.navigateTo({
					url: `/pages/friendData/singleDetails?id=${this.roomData.to_id}&msg_id=${this.roomData.msg_id}`
				})
			} else {
				uni.navigateTo({
					url: `/pages/friendData/groupDetails?id=${this.roomData.to_id}&is_join=1&msg_id=${this.roomData.msg_id}`
				})

			}
		}
	}
</script>
<style lang="less" scoped>
	@import "./chat.less";

	.bottom {
		input {
			width: 480rpx;
		}
	}

	.chat-box .system {
		padding-top: 100rpx;
	}

	.chat-box .system text {
		background-color: rgba(0, 0, 0, 0);
	}

	.chat-row {
		position: relative;
	}

	.operationBox {
		position: absolute;
		width: 100%;


		&.justify-start {
			.operation {
				&::before {
					left: 90rpx;
				}
			}
		}

		&.justify-end {
			.operation {
				&::before {
					right: 90rpx;
				}
			}
		}
	}


	.operation {
		position: relative;
		width: 388rpx;
		border-radius: 10rpx;
		background-color: #080808;
		color: #FFFFFF;
		margin-top: 10rpx;

		view {
			height: 80rpx;
			line-height: 80rpx;
		}

		&::before {
			border: 15rpx solid transparent;
			border-top: 15rpx solid #080808;
			width: 0;
			height: 0;
			position: absolute;
			bottom: -25rpx;
			content: ' '
		}
	}

	.operation1 {
		width: 288rpx;
	}

	.solid-right {
		border-right: 1px solid #5e5e5e;
	}
</style>
