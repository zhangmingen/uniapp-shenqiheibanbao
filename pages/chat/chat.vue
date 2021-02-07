<template>
	<view class="chat-box" @click.stop="boxClick">
		<scroll-view scroll-view class="cbc-scrool" :scroll-y="true" :scroll-into-view="scrollIntoView" @scrolltoupper="getLists"
		 @touchstart="touchstartFun" @touchend="touchendFun" @scrolltolower="scrolltolowerFun" :upper-threshold="100"
		 :lower-threshold="100" :style="{bottom: (showFace ? '500rpx' : showMore ? '320rpx' : '100rpx')}">
			<view id="scrollview" class="chat-box">
				<view class="padding-xl text-center text-black" v-if="loadingStatus && pages.last_page>pages.current_page">
					加载中...
				</view>
				<block v-for="(item,index) in msg_list" :key='item.id'>
					<view :id="`item${item.id}`" class="cb-main">
						<view class="chat-time" v-if="item.show_time!=0 && item.char_type==0">
							<text>{{item.sendtime}}</text>
						</view>
						<!-- <view class="chat-time" v-if="!msg_list[index+1]">
							<text>{{item.sendtime}}</text>
						</view> -->

						<!-- 自己说的话start -->
						<view v-if="item.from_uid==userInfo.id && item.char_type==0" class="chat-row me">
							<view class="chat-img" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.from_uid">
								<image :src="item.u_head_img" mode=""></image>
							</view>
							<view v-if="item.msg_type==1 || item.msg_type==2 || item.msg_type==3" class="chat-txt" :class="item.msg_type==2 ? 'no_bj' : item.msg_type==3?'voice_box':''"
							 @click.stop="playRecord(item)" @longpress.stop="longpressFun($event,item)">
								<!-- <text selectable="true"></text> -->
								<view v-if="item.msg_type == 1" v-html='replaceEmoji(item.content)' :hover-stop-propagation="false"></view>
								<image v-if="item.msg_type == 2" @tap='previewImg(item.content)' class="chatImage" :src="item.content" mode="heightFix"></image>
								<image v-if="item.msg_type == 3 && !item.typeplay" class="record" src="@/static/xs_icon/record_left.png" mode="widthFix"></image>
								<image v-if="item.msg_type == 3 && item.typeplay==true" class="record" src="@/static/xs_icon/recordimg_left.gif"
								 mode="widthFix"></image>
								<text v-if="item.msg_type == 3" :style="`padding-left: ${item.sound_num*4}px;`" class="time">{{item.sound_num || 666}}</text>
								<!-- <text>{{item.sound_num}}</text> -->
							</view>
							<!-- 长按出现复制删除撤回 -->
							<view class="operationBox flex justify-end left" v-show="operation && item.id==operation.id" style="left: -80rpx;top: -70rpx;">
								<view class="operation flex align-center justify-center text-center">
									<view class="flex-sub solid-right" v-if="item.msg_type==1" @click.stop="copyText(item.content)"> 复制
										{{item.offsetLeft}}</view>
									<view class="flex-sub solid-right" @click.stop="deleteMsg(item.id)"> 删除 </view>
									<view class="flex-sub" @click.stop="withdrawMsg(item.id,roomData.msg_id)"> 撤回 </view>
								</view>
							</view>
						</view>
						<!-- 自己说的话end -->
						<!-- 他人说的话start -->
						<view v-else-if="item.char_type==0" class="chat-row">
							<view class="chat-img">
								<image :src="item.u_head_img" mode="" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.from_uid+'&close=1'"></image>
							</view>
							<view class="cr-box">
								<!-- 他人名字 -->
								<view class="crb-name" v-if="roomData.type==2">
									{{item.nickname}}
								</view>
								<view @click.stop='playRecord(item)' v-if="item.msg_type==1 || item.msg_type==2 || item.msg_type==3" class="chat-txt"
								 :class="item.msg_type==2 ? 'no_bj' : item.msg_type==3?'voice_box':''" @longpress="longpressFun($event,item)">
									<text v-if="item.msg_type == 1" v-html='replaceEmoji(item.content)'></text>
									<image v-if="item.msg_type == 2" @tap='previewImg(item.content)' class="chatImage" :src="item.content" mode="heightFix"></image>
									<image v-if="item.msg_type == 3 && !item.typeplay" class="record" src="@/static/xs_icon/record_left.png" mode="widthFix"></image>
									<image v-if="item.msg_type == 3 && item.typeplay" class="record" src="@/static/xs_icon/recordimg_left.gif"
									 mode="widthFix"></image>
									<text v-if="item.msg_type == 3" class="time" :style="`padding-left: ${item.sound_num*4}px;`">{{item.sound_num*1}}</text>
									<!-- <text>{{item.sound_num}}</text> -->
								</view>

							</view>
							<!-- 长按出现复制删除撤回 -->
							<view class="operationBox flex justify-start right" v-show="operation && item.id==operation.id" style="right: -80rpx;top: -70rpx;">
								<view class="operation operation1 flex align-center justify-center text-center">
									<view class="flex-sub solid-right" v-if="item.msg_type==1" @click.stop="copyText(item.content)"> 复制
										{{item.offsetLeft}}</view>
									<view class="flex-sub" @click.stop="deleteMsg(item.id)"> 删除 </view>
									<!-- <view class="flex-sub"> 撤回 </view> -->
								</view>
							</view>
						</view>
						<!-- 他人说的话end -->
						<!-- 撤回消息 -->
						<view class="system" v-else-if="item.char_type==3">
							<text v-if="roomData.type==1">{{item.from_uid==userInfo.id?'我'+item.content:'对方'+item.content}}</text>
							<text v-else>{{item.from_uid==userInfo.id?'我'+item.content:item.nickname+item.content}}</text>
						</view>
						<!-- 撤回消息end -->
						<!-- 系统消息 -->
						<view class="system" v-else-if="item.char_type==2">
							<text>{{item.content}}</text>
						</view>
						<!-- 系统消息end -->
						<!-- 系统消息 -->
						<view class="system" v-else>
							<text>{{item.content}}</text>
						</view>
						<!-- 系统消息end -->
					</view>
				</block>
				<view class="padding-bottom-xs visibility" id="items999">0</view>
			</view>

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
		<view class="bottom bottom-prohibit" v-if="roomInfo.is_status == 2 || roomInfo.is_black == 1">
			<!-- <button class="prohibit" type="default">禁言</button> -->
			<view class="prohibit">
				{{roomInfo.is_status == 2?'禁言中':'已被对方拉黑'}}
			</view>
		</view>
		<view class="bottom" :style="{bottom: (showFace ? '400rpx' : showMore ? '220rpx' : 0)}" v-else>
			<image src="/static/ye_icon/3608.png" mode="" @tap="upload_sound"></image>
			<button @touchstart="recordStart" @touchmove="recordMove" @touchend="recordEnd" class="input" type="default" v-if="soundRecord">按住
				说话</button>
			<input v-else type="text" :focus="inputfocus" v-model="messageContent" @confirm="onSendMessage(1,'',messageContent.trim())"
			 confirm-type="send" maxlength="500" />
			<image src="/static/ye_icon/3607.png" mode="" @click.stop="handleToggleFace"></image>
			<image v-if="showFace == false" src="/static/ye_icon/3606.png" mode="" @click.stop="handleToggleMore"></image>
			<text v-else-if="showFace" @click="onSendMessage(1,'',messageContent.trim())">发送</text>
		</view>


		<!-- 表情包 -->
		<view class="face-box-wapper" v-show="showFace">
			<!-- <view class="face-box-mask" @touchmove.stop.prevent @tap="handleToggleFace"></view> -->
			<scroll-view class="face-box" scroll-y>
				<image @click.stop="handleTapFace(item.name)" v-for="item,index in faceImage" :key="index" :data-name="index+1"
				 class="avatar" mode="aspectFill" :src="item.image"></image>
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
				<view class="item" @click.stop="handleChooseImage('camera')">
					<image src="/static/ye_icon/3599.png"></image>
					<view class="name">拍照</view>
				</view>
				<!-- #endif -->
				<view class="item" @click.stop="handleChooseImage('album')">
					<image src="/static/ye_icon/3594.png"></image>
					<view class="name">照片</view>
				</view>
			</view>
		</view>
		<!-- 遮罩层避免闪一下 -->
		<view class="fixedBox flex align-center justify-center" v-if="loadingBox">
			<text class="cu-load text-gray loading"></text>
		</view>
	</view>
</template>

<script>
	var timer = null;
	import face from '@/static/face.json';
	import {
		UploadImage,
		UploadFileToOSS
	} from '@/common/utils/index';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		API_BASE_URL
	} from '@/common/config.js';
	const {
		windowHeight,
		statusBarHeight
	} = uni.getSystemInfoSync()
	const recorderManager = uni.getRecorderManager(); //  录音功能
	const innerAudioContext = uni.createInnerAudioContext(); // 播放录音
	// #ifdef APP-PLUS
	// import permision from "@/common/permission.js"
	import permision from "@/common/wa-permission/permission.js"
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
				loadingBox: true, //加载盒子
				loadingStatus: true, //顶部加载中
				starScroll: 0, //starScrollFun

			};
		},
		computed: mapState({
			roomData: state => state.chat.roomInfo, //聊天ID 消息列表获得 聊天类型 类型:1好友，2群聊  房间id  对方id
			msg_list: state => state.chat.msg_list, //单聊或群聊聊天记录
		}),
		onLoad(e) {

			this.showMore = false; //更多表情弹窗
			this.showFace = false; //更多功能弹窗
			// 动态设置标题
			uni.setNavigationBarTitle({
				title: e.title
			})
			// 修改vuex房间信息
			if (e.type == 1) {
				this.updataRoomInfoFun(e.type, e.id, e.friend_id)
			} else if (e.type == 2) {
				this.updataRoomInfoFun(e.type, e.id, e.group_id)
			}

			// 全局监听到消息 更新消息记录列表
			uni.$on('updateChat', data => {
				console.log('chat监听到并更新')
				// if (data.from_uid != this.userInfo.id) {
				this.upDataChat(data);
				// }
				// 聊天类型 类型:1好友，2群聊
				// if (this.roomData.type == 1) {
				// 	// 清空未读消息数量
				// 	this.notRedsMessage();
				// } else if (this.roomData.type == 2) {
				// 	// 用户离开群聊
				// 	this.notRedsGroupMessage()
				// }
			});
			// 用户加入群聊
			uni.$emit("joinGroup", this.roomData.to_id);

			// 监听键盘高度
			uni.onKeyboardHeightChange(res => {
				console.log(res.height)

				this.keyboardHeight = res.height;
				// if (res.height != 0) {
				// 	this.showFace = false;
				// 	this.showMore = false;
				// 	this.inputfocus = true;
				// }
			})
		},
		// 监听页面卸载
		onUnload() {
			// 聊天类型 类型:1好友，2群聊
			if (this.roomData.type == 1) {
				// 清空未读消息数量
				this.notRedsMessage();
			} else if (this.roomData.type == 2) {
				// 用户离开群聊
				this.notRedsGroupMessage()
			}
			// 初始化聊天记录列表
			this.initMsgList();
			uni.$off('updateChat');
		},
		onShow() {
			// 获取聊天记录
			this.getListData(this.roomData.msg_id);
		},
		methods: {
			/**
			 * updataRoomInfo  房间信息
			 * updataMsg_list  聊天信息记录
			 * */
			...mapMutations(["updataRoomInfo", "updataMsg_list"]),
			boxClick() {
				var _this = this;
				this.operation = '';
				// console.log(this.showMore, this.showFace)
				setTimeout(function() {
					if (_this.showMore == true) {
						_this.showMore = false;
					}
					if (_this.showFace == true) {
						_this.showFace = false;
					}
				}, 50)
			},
			// 删除单条消息
			deleteMsg(id) {

				var _this = this;
				var roomData = this.roomData;
				var apiUrl = global.apiUrls.delete_msg;
				const {
					updataMsg_list
				} = this;

				if (roomData.type == 1) {
					apiUrl = global.apiUrls.delete_msg;
				} else if (roomData.type == 2) {
					apiUrl = global.apiUrls.delete_group_msg;
				}


				_this.$api.post(apiUrl, {
					id: id
				}).then(res => {
					var res = res.data;
					_this.operation = "";
					if (res.code == 1) {
						_this.$message.info(res.msg);
						var list = JSON.parse(JSON.stringify(_this.msg_list));
						var ind = list.findIndex(function(a, b) {
							return a.id == id;
						})
						list.splice(ind, 1);
						updataMsg_list(list);
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 撤回消息
			withdrawMsg(id, msg_id) {
				var _this = this;
				var roomData = this.roomData;
				var apiUrl = global.apiUrls.delete_msg;
				const {
					updataMsg_list
				} = this;

				if (roomData.type == 1) {
					apiUrl = global.apiUrls.withdraw_msg;
				} else if (roomData.type == 2) {
					apiUrl = global.apiUrls.withdraw_group_msg;
				}

				_this.$api.post(apiUrl, {
					id: id,
					msg_id: msg_id
				}).then(res => {
					var res = res.data;
					_this.operation = "";
					if (res.code == 1) {
						_this.$message.info(res.msg);
						var list = JSON.parse(JSON.stringify(_this.msg_list));
						var ind = list.findIndex(function(a, b) {
							return a.id == id;
						})
						list.splice(ind, 1);
						updataMsg_list(list);
						// _this.getListData(_this.roomData.msg_id);
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 复制文本
			copyText(text) {
				var _this = this;
				uni.setClipboardData({
					data: text,
					success: function() {
						_this.operation = "";
					}
				});
			},
			// 聊天长按
			longpressFun(e, item) {
				this.operation = item;
				this.$forceUpdate()
			},
			touchstartFun(e) {
				this.starScroll = e.changedTouches[0].pageY;
				// console.log(e)
				// console.log(this.starScroll)
			},
			touchendFun(e) {
				var _this = this;
				var top = e.changedTouches[0].pageY;
				if (top - this.starScroll > 50) {
					_this.scrollIntoView = "";
				}
				// console.log(e)
				// console.log(top)
			},
			scrolltolowerFun() {
				var _this = this;
				_this.scrollIntoView = "items999";
				setTimeout(function() {
					_this.scrollIntoView = "items999";
					console.log(_this.scrollIntoView)
				}, 500)
			},
			// 更新聊天室内容
			upDataChat(data) {
				var list = JSON.parse(JSON.stringify(this.msg_list));
				// 判断接收到的消息是不是本房间id
				if (this.roomData.msg_id && (this.roomData.msg_id == data.msg_id)) {
					list.push(data);
				}
				const {
					updataMsg_list
				} = this;

				if (data.char_type == 3) {
					var ind = list.findIndex(function(a, b) {
						return a.id == data.delete_id;
					})
					if (ind != -1) {
						console.log("群聊撤回", ind)
						list.splice(ind, 1);
					}
				}
				updataMsg_list(list);
				if (data.from_uid != this.userInfo.id) {
					//#ifdef APP-PLUS
					if (this.scrollIntoView == "items999") {
						this.rollScrollview()
					}
					//#endif
					//#ifdef H5
					this.rollScrollview()
					//#endif
				} else {
					this.rollScrollview()
				}
			},
			// 修改vuex房间信息zme
			updataRoomInfoFun(type, id, to_id) {
				const {
					updataRoomInfo
				} = this;
				updataRoomInfo({
					type: type, //聊天类型 类型:1好友，2群聊
					msg_id: id, //聊天ID 消息列表获得
					to_id: to_id, //对方id 群聊id
				})
			},
			// 发送消息zme
			// 消息类型 1 文本 2 图片 3 音频
			onSendMessage(msg_type = 1, duration = "", content) {
				var _this = this;
				var roomData = this.roomData;
				var apiUrl = global.apiUrls.say_msg;
				var data = {};
				if (msg_type == 1) {
					if (!content) return this.$message.info("请输入发送内容");
				}
				// 群聊单聊
				if (roomData.type == 1) {
					apiUrl = global.apiUrls.say_msg;
					data = {
						to_id: this.roomData.to_id, //对方iD
						msg_type: msg_type, //消息类型
						content: content, //内容
						duration: duration, //音频 时长
						msg_id: this.roomData.msg_id, //在消息列表获得
						from_image: this.userInfo.head_img, //发送者头像
					}
				} else if (roomData.type == 2) {
					apiUrl = global.apiUrls.say_group_msg;
					data = {
						id: this.roomData.to_id, //对方iD
						msg_type: msg_type, //消息类型
						content: content, //内容
						duration: duration, //音频 时长
						msg_id: this.roomData.msg_id, //在消息列表获得
						from_image: this.userInfo.head_img, //发送者头像
					}
				}


				this.$api.post(apiUrl, data)
					.then(res => {
						if (res.data.code == 1) {
							// 发送成功 获取聊天记录
							_this.messageContent = "";
							if (msg_type != 1) {
								_this.getListData(_this.roomData.msg_id);
							} else {
								_this.rollScrollview();
							}
						} else {
							_this.$message.info(res.data.msg);
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			// 获取聊天记录 zme page是否获取分页数据
			getListData(id, page = false) {
				var _this = this;
				var obj = {};
				var roomData = this.roomData;
				var apiUrl = global.apiUrls.msg_list;
				const {
					updataMsg_list
				} = this;
				// 群聊单聊
				if (roomData.type == 1) {
					apiUrl = global.apiUrls.msg_list;
				} else if (roomData.type == 2) {
					apiUrl = global.apiUrls.msg_group_list;
				}

				// 是否分页
				if (!page) {
					if (roomData.type == 1) {
						// 单聊
						obj = {
							msg_id: id
						}
					} else if (roomData.type == 2) {
						//群聊
						obj = {
							msg_id: id,
							group_id: roomData.to_id
						}
					}
				} else {
					let page = Number(this.pages.current_page) + 1; //页面+1
					let last_page = this.pages.last_page; //总页数
					if (page > last_page) return;
					if (page <= last_page) {
						if (roomData.type == 1) {
							// 单聊
							obj = {
								msg_id: id,
								page: page
							}
						} else if (roomData.type == 2) {
							//群聊
							obj = {
								msg_id: id,
								group_id: roomData.to_id,
								page: page
							}
						}
					}
				}
				// 请求聊天记录
				this.$api.post(apiUrl, obj)
					.then(res => {
						if (res.data.code == 1) {
							// #ifdef APP-PLUS
							var webView = _this.$mp.page.$getAppWebview();
							webView.setTitleNViewButtonStyle(0, {
								"type": "menu"
							});
							// #endif
							var data = res.data.data;
							if (!page) {
								updataMsg_list(data.data.reverse());
								_this.pages = {
									current_page: data.current_page, //当前页
									last_page: data.last_page //总页数
								};
								setTimeout(function() {
									_this.rollScrollview();
								}, 200)
								// _this.$forceUpdate()
							} else {
								// 隐藏加载中
								_this.loadingStatus = false;
								console.log(_this.loadingStatus)
								updataMsg_list([...data.data.reverse(), ..._this.msg_list]);
								_this.pages = {
									current_page: data.current_page, //当前页
									last_page: data.last_page //总页数
								};
							}
							// #ifdef APP-PLUS
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
							setTimeout(function() {
								_this.loadingBox = false;
							}, 300)
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			// 初始化初始化聊天记录列表 zme
			initMsgList() {
				const {
					updataMsg_list,
					updataRoomInfo
				} = this;
				updataMsg_list([]);
				updataRoomInfo({
					type: "", //聊天类型 类型:1好友，2群聊
					msg_id: "", //聊天ID 消息列表获得
					to_id: "", //对方id
				})
				this.pages = {
					current_page: 1, //当前页
					last_page: 1, //总页数
				}
			},
			// 清空单聊未读消息数 zme
			notRedsMessage() {
				this.$api.post(global.apiUrls.read_notReds_message, {
						to_id: this.roomData.to_id
					})
					.then(res => {
						if (res.data.code == 1) {
							uni.$emit("updateMessage", {});
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			// 清空群聊未读消息数 zme
			notRedsGroupMessage() {
				this.$api.post(global.apiUrls.read_group_message, {
						group_id: this.roomData.to_id
					})
					.then(res => {
						if (res.data.code == 1) {
							uni.$emit("updateMessage", {});
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			// 滚动到最顶部 zme
			getLists(e) {
				var _this = this;
				// 显示加载中
				this.loadingStatus = true;
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(function() {
					_this.getListData(_this.roomData.msg_id, true)
				}, 500)
			},
			//  滚动到最底部
			rollScrollview() {
				var _this = this;
				_this.scrollIntoView = '';
				_this.$nextTick(function() {
					_this.scrollIntoView = 'items999';
					setTimeout(function() {
						_this.scrollIntoView = 'items999';
						console.log(_this.scrollIntoView)
					}, 50)
				})
				// this.scrollTop += 99999;
				// setTimeout(() => {
				//   this.scrollTop += 99999;
				// },100)
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
						for (let i = 0; i < tempFilePaths.length; i++) {
							_this.uploadImg([tempFilePaths[i]])
						}
					}
				});
			},
			// 上传图片
			uploadImg(tempFilePaths) {
				let _this = this;
				new UploadImage(tempFilePaths, {
					complete: function(res) {
						_this.onSendMessage(2, "", res[0].path)
					}
				});
			},


			// 点击放大图片
			previewImg(e) {
				uni.previewImage({
					urls: [e]
				});
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
			// 左下角 发送录音按钮
			upload_sound() {
				this.soundRecord = !this.soundRecord;
				if (this.soundRecord == false) {
					this.inputfocus = true;
				} else {
					this.inputfocus = false;
				}
				// this.showMore = false; //更多表情弹窗
				this.showFace = false; //更多功能弹窗
			},
			// 开始录音
			async recordStart(e) {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				console.log(status)
				if (status !== 1) {
					return;
				}
				// #endif 
				this.initPoint = e.touches[0].pageY;
				this.duration = 0; // 初始化 时间
				this.durationState = true;
				this.recordTime()
				recorderManager.start();
				this.record = true;

			},
			// #ifdef APP-PLUS
			async checkPermission() {
				let status = permision.isIos ? await permision.judgeIosPermission('record') :
					await permision.requestAndroidPermission('android.permission.RECORD_AUDIO');
				console.log(status)
				if (status === null || status === 1 || status == true) {
					status = 1;
				} else if (status === 2) {
					uni.showModal({
						content: "系统麦克风已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {}
					})
				} else {
					uni.showModal({
						content: "需要麦克风权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppPermissionSetting();
							} else {
								uni.navigateBack()
							}
						}
					})
				}
				return status;
			},
			// #endif
			// 录音时长
			recordTime() {
				let recordTime = setInterval(() => {
					this.duration++
					if (this.durationState == false) {
						// console.log(this.duration);
						clearInterval(recordTime);
					}
				}, 1000);
			},
			// 结束录音
			recordEnd() {
				console.log(99999)
				var _this = this;
				this.record = false;
				this.durationState = false;
				if (this.cancelRecord) {
					return this.cancelRecord = false;
				}

				recorderManager.stop();
				if (this.duration <= 1) return this.$message.info("说话时间太短");
				recorderManager.onStop((res) => {
					const tempFilePaths = res.tempFilePath;
					// 开始上传
					new UploadFileToOSS([tempFilePaths], {
						complete: function(res) {
							// 上传成功 返回数据格式为数组 [ { id: '', path: '' } ]
							_this.onSendMessage(3, _this.duration, res[0].path)
						}
					})
				});
			},
			// 上滑取消发送录音
			recordMove(e) {
				if (timer) {
					clearTimeout(timer)
				}
				this.touchesY = e.touches[0].pageY;
				//上滑达到一定距离显示取消发送
				if (this.initPoint - this.touchesY >= uni.upx2px(400)) {
					this.cancelRecord = true;
					timer = setTimeout(() => {
						this.record = false;
						this.durationState = false;
						this.cancelRecord = false;
						recorderManager.stop();
						recorderManager.onStop((res) => {
							console.log("取消发送", res)
						});
					}, 500)
				} else {
					this.cancelRecord = false;

				}
			},
			// 播放录音
			playRecord(item) {
				// console.log(item)
				if (item.msg_type != 3) return;
				for (let i in this.say_list) {
					if (this.say_list[i].typeplay == true) {
						this.say_list[i].typeplay = false
					}
				}
				clearInterval(endTime);
				this.$nextTick(function() {
					item.typeplay = true;
				})
				let num = 0;
				let endTime = setInterval(() => {
					num++
					if (num == item.sound_num || item.sound_num == 0) {
						item.typeplay = false;
						clearInterval(endTime);
						this.$forceUpdate()
					}
				}, 1000)
				innerAudioContext.src = item.content;
				innerAudioContext.play();
				this.$forceUpdate()
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
			//替换表情符号为图片
			replaceEmoji(str) {
				// 正则表达式匹配内容
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					let face = this.faceImage.find(sub => sub.name == item)
					return face ?
						'<img style="vertical-align: middle; width:24px;height:24px; display: inline-block;" onclick="" src="' + face
						.image.replace('/static/', 'http://www.sqhbb.com/') + '">' : item
				});
				return '<div style="vertical-align: middle; align-items: center;word-break: break-all; word-break: break-word;">' +
					replacedStr + '</div>';
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
<style lang="less">
	@import "./chat.less";

	page {
		-webkit-touch-callout: none;
	}

	// .chatImage {
	// 	max-height: 300rpx;
	// }
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

	.fixedBox {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		z-index: 999;
	}
</style>
