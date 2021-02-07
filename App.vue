<script>
	import {
		WS_HOST
	} from '@/common/config.js'
	import {
		mapMutations
	} from 'vuex';
	import Vue from 'vue';
	var innerAudioContext = null;
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //竖屏
			// #endif
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			// 监听登录
			uni.$on('appLoginSuccess', () => {
				console.log('监听登录成功')
				this.initVuex();
				uni.$off('joinGroup');
				uni.$off('leaveGroup'); //清除之前监听
				uni.$off('updateMessage'); //清除之前监听
				uni.closeSocket();
				this.initializeSocket();
			})
			// 断开客服重连聊天
			uni.$on('initSuccess', () => {
				console.log('断开客服重连聊天')
				uni.$off('joinGroup');
				uni.$off('leaveGroup'); //清除之前监听
				uni.$off('updateMessage'); //清除之前监听
				uni.closeSocket();
				this.initializeSocket();
			})
		},
		onShow: function() {
			var pages = getCurrentPages();
			if (pages.length > 0) {
				var page = (pages[pages.length - 1]).route;
				if (page == "pages/chat/service") return;
			}
			console.log('App onShow')
			uni.$off('joinGroup');
			uni.$off('leaveGroup'); //清除之前监听
			uni.$off('updateMessage'); //清除之前监听
			uni.closeSocket();
			this.initializeSocket();
			// 更新消息列表
			uni.$emit("updateMessage", {});
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(["updataMessageNum", "updataAddFriend", "updataRoomInfo", "updataMsg_list", "updatamMssageList","updataGroupNum"]),
			initVuex() {
				const {
					updataGroupNum,
					updataMessageNum,
					updataAddFriend,
					updataRoomInfo,
					updataMsg_list,
					updatamMssageList
				} = this;
				updatamMssageList([]);
				// updataMessageNum(0);
				// updataAddFriend(0);
				updataMsg_list([]);
			},
			// 初始化scoket
			initializeSocket() {
				const {
					updataMessageNum,
					updataAddFriend,
					updataGroupNum
				} = this;
				if (global.token) {
					// 链接socket
					uni.connectSocket({
						url: WS_HOST,
						success(res) {
							console.log('连接聊天socket成功', res)
						}
					})


					// 接收socket消息
					uni.onSocketOpen(res => {
						// sendSocketMessage 通过 WebSocket 连接发送数据
						uni.sendSocketMessage({
							data: JSON.stringify({
								type: 'bind',
								user_id: global.userInfo.id
							})
						})

						// 监听加入群聊
						uni.$on('joinGroup', data => {
							console.log('chat监听到用户加入群聊', data)
							uni.sendSocketMessage({
								data: JSON.stringify({
									type: 'join_group',
									group_id: data
								})
							})
						});
						// 监听离开群聊
						uni.$on('leaveGroup', data => {
							console.log('chat监听到用户离开群聊', data)
							uni.sendSocketMessage({
								data: JSON.stringify({
									type: 'leave_group',
									group_id: data
								})
							})
						});
						// 更新数据
						uni.$on('updateMessage', data => {
							console.log('app.vue跟新列表数据', data)
							this.getListData();
						});

						// onSocketMessage   监听WebSocket接受到服务器的消息事件
						uni.onSocketMessage(onMessage => {
							var data = JSON.parse(onMessage.data);
							console.log("监听WebSocket接受到服务器的消息事件", data);
							// 获取到有人发消息
							if (data.type == "say") {
								if (data.from_uid != global.userInfo.id) {
									if (data.room_type == 1 && data.is_not_disturb != 1) {
										// if (innerAudioContext) {
										// 	innerAudioContext.destroy()
										// }
										// innerAudioContext = uni.createInnerAudioContext();
										uni.vibrateLong();
										// innerAudioContext.loop = false;
										// innerAudioContext.autoplay = true;
										// innerAudioContext.src = '/static/warning.mp3';
										console.log("震动")
									} else if (data.room_type == 2) {
										var messageList = this.$store.state.message.messageList;
										var ind = messageList.findIndex(function(a) {
											return a.type == 2 && a.friend_id == data.group_id && a.is_not_disturb == 1;
										})
										console.log(ind)
										if (ind == -1) {
											// if (innerAudioContext) {
											// 	innerAudioContext.destroy()
											// }
											// innerAudioContext = uni.createInnerAudioContext();
											uni.vibrateLong();
											// innerAudioContext.loop = false;
											// innerAudioContext.autoplay = true;
											// innerAudioContext.src = '/static/warning.mp3';
											console.log("震动")
										}
									}
								}
								// 更新消息列表
								this.getListData();
								// 更新聊天记录内容
								uni.$emit("updateChat", data);

							} else if (data.type == "one_chat_num") {
								// 消息列表未读消息数量通知
								// 更新消息列表
								// uni.$emit("updateMessage", data);
							} else if (data.type == "apply_add_friend") {
								// 添加好友推送数量
								updataAddFriend(data.friend_num)
							} else if (data.type == "form_message_num") {
								//论坛socket 消息数量通知
								updataMessageNum(data.num)

							}else if (data.type == "apply_group_num") {
								//用户申请入群
								updataGroupNum(data.apply_num)

							}else if(data.type=="update"){
								// 更新消息列表
								this.getListData();
							}

						})

						// 定时发送心跳消息避免断开
						setInterval(() => {
							uni.sendSocketMessage({
								data: JSON.stringify({
									class: 'ping'
								})
							});
						}, 25000)

					})
					uni.onSocketError(function(res) {
						console.log('WebSocket连接打开失败，请检查！', res);
						// uni.closeSocket();
						// this.initializeSocket();
					});

				}
			},
			// 获取列表数据
			getListData() {
				let _this = this;
				const {
					updatamMssageList
				} = this;
				this.$api.post(global.apiUrls.chat_list).then(res => {
					var res = res.data;
					if (res.code == 1) {
						var data = res.data.data;
						var groupArr = res.data.user_group_ids;
						updatamMssageList(data);
						var num = 0;
						for (var i = 0; i < data.length; i++) {
							num += Number(data[i].unread_message_num);
						}

						for (let a = 0; a < groupArr.length; a++) {
							// 用户加入群聊
							uni.$emit("joinGroup", groupArr[a]);
						}
						_this.msg_num = num;
						if (_this.msg_num) {
							uni.setTabBarBadge({
								index: 0,
								text: _this.msg_num > 99 ? '99+' : _this.msg_num + ""
							})
						} else {
							uni.removeTabBarBadge({
								index: 0
							})
						}
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
		}
	}
</script>
<style lang="less">
	/*每个页面公共css */
	@import "common/css/main.css";
	@import "common/css/icon.css";

	.text-theme {
		color: #845210;
	}

	.text-blu {
		color: #00A9FC
	}

	.text-blu1 {
		color: #0093FF
	}

	.text-333 {
		color: #333333;
	}

	.text-666 {
		color: #666666;
	}

	.text-999 {
		color: #999999 !important;
	}

	.text-225 {
		color: #225DAD;
	}

	.text-8080 {
		color: #808080;
	}

	.text-break {
		word-wrap: break-word;
		word-break: break-all;
	}

	.text-normal {
		white-space: normal;
	}

	.bg-blu {
		background-color: #00A9FC !important;
		color: #FFFFFF;
	}

	.bg-eded {
		background-color: #EDEDED;
	}

	.bg-f7f7 {
		background-color: #F7F7F7;
	}

	.bg-f6f6 {
		background-color: #F6F6F6;
	}

	.bg-f2f2 {
		background-color: #F2f2f2;
	}

	.bg-eee {
		background-color: #EEEEEE !important;
	}

	.bg-e1e1 {
		background-color: #E1E1E1;
	}

	.bg-rgba {
		background-color: rgba(255, 255, 255, .8);
	}

	.bg-dcdc {
		background-color: #DCDCDC
	}

	.bg-999 {
		background-color: #999999;
	}

	.bg-theme {
		background-color: #0093FF;
		color: #FFFFFF;
	}

	.p-lr-0 {
		padding-left: 0;
		padding-right: 0;
	}

	.p-0 {
		padding: 0 !important;
	}

	.mt-0 {
		margin-top: 0 !important;
	}

	.pb-0 {
		padding-bottom: 0;
	}

	.pt-100 {
		padding-top: 100rpx;
	}

	.flex-shrink {
		flex-shrink: 0;
	}

	.visibility {
		visibility: hidden;
	}

	.text-cut2 {
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		// 数字字母不换行问题
		word-wrap: break-word;
		word-break: normal;
	}

	.text-cut3 {
		overflow: hidden;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		// 数字字母不换行问题
		word-wrap: break-word;
		word-break: normal;
	}

	.right-icon {
		width: 14rpx;
		height: 24rpx;
	}

	.user-img {
		border-radius: 6rpx;
	}

	.w-100 {
		width: 100%;
	}

	.h-100 {
		height: 100%;
	}

	.relative {
		position: relative;
	}

	.overflow {
		overflow: hidden;
	}

	.overflow-y-auto {
		overflow-y: auto;
	}

	/* 搜索按钮大小 */
	.search-inp {
		text {
			font-size: 30rpx;
		}
	}

	/* 搜索栏 */
	.fixed-top {
		position: fixed;
		width: 100%;
		z-index: 1000;
	}

	/* mask */
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 900;
		background-color: rgba(0, 0, 0, .6);
	}

	/* 模态框 */
	.modalName {
		border-radius: 24rpx 24rpx 0px 0px !important;

		.item {
			height: 110rpx;
			line-height: 110rpx;
		}
	}

	.bottom-modal .bg-white {
		color: #333333;
	}

	.text-40 {
		font-size: 40rpx;
	}

	.uni-dialog-title {
		color: #333333 !important;
	}

	.uni-dialog-title .uni-popup__info {
		color: #333333 !important;
	}
</style>
