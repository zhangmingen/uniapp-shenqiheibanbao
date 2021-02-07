<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl" :isBack="false">
			<block slot="content"><text class="text-lg">消息</text><text class="text-df" v-if="msg_num>0">({{msg_num}})</text></block>
			<block slot="right">
				<view class="text-right w-100 padding-right text-black head">
					<text class="cuIcon-search lg margin-right-sm text-40" @click="handleJump" data-url="/pages/message/search"></text>
					<text class="cuIcon-roundadd lg text-40" @click="more_select = !more_select"></text>
					<view class="select" v-show="more_select">
						<view class="select-row border" @click="onScanCode">
							<image src="/static/ye_icon/scan.png" mode=""></image>
							<text>扫一扫</text>
						</view>
						<view class="select-row border" @click="handleJump($event)" data-url="/pages/addressList/addFriend">
							<image src="/static/ye_icon/add_friend.png" mode=""></image>
							<text>添加朋友</text>
						</view>
						<view class="select-row" @click="handleJump($event)" data-url="/pages/chat/service">
							<image src="/static/ye_icon/say.png" mode=""></image>
							<text>客服</text>
						</view>
					</view>
				</view>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in listData" :key="index"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index"
				 @click="handleJump" :data-url="`/pages/chat/chat?id=${item.id}&type=${item.type}&title=${item.title}&friend_id=${item.user_id==userInfo.id?item.friend_id:item.user_id}&group_id=${item.friend_id}`">
					<view class="cu-avatar user-img">
						<u-image :src="item.thumb" mode="aspectFill" width="94rpx" height="94rpx" border-radius="8rpx" :lazy-load="true"></u-image>
						<view class="cu-tag badge" :class="item.is_not_disturb==1?'bg-999':''" v-if="item.unread_message_num>0">{{item.unread_message_num>99?'99+':item.unread_message_num}}</view>
					</view>
					<view class="content">
						<view class="text-df text-black text-cut">{{item.title}}</view>
						<view class="text-gray text-sm text-cut" v-if="item.msg_type==1">{{item.msg}}</view>
						<view class="text-gray text-sm text-cut" v-else-if="item.msg_type==2">图片</view>
						<view class="text-gray text-sm text-cut" v-else>语音</view>
					</view>
					<view class="action">
						<view class="text-gray text-sm">{{item.time}}</view>
						<view class="text-gray text-xs visibility">22:20</view>
					</view>
					<view class="move" @click.stop="chatDelete(item.friend_id==userInfo.id?item.user_id:item.friend_id,item.type)">
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</view>
		<view class="padding-xl text-center text-666 solid-top-f7" v-else>你还没有好友聊天~</view>

		<!-- 弹出遮盖层 -->
		<view class="mask mask1" v-show="more_select" @click="more_select = !more_select"></view>
		<!-- 断网提示 -->
		<fu-notwork></fu-notwork>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				modalName: null, //当前所滑动的盒子
				more_select: false, // 头部导航 右边加号
				userInfo: global.userInfo,
				msg_num: 0, //消息总数
			}
		},
		onShow() {
			if (!global.userInfo) return uni.navigateTo({
				url: "/pages/login"
			})
			// 获取列表数据
			this.getListData();
			if (this.msg_num > 0) {
				uni.setTabBarBadge({
					index: 0,
					text: this.msg_num > 99 ? '99+' : this.msg_num + ""
				})
			} else {
				uni.removeTabBarBadge({
					index: 0
				})
			}
		},
		onLoad() {
			// var _this = this;
			// // 全局监听到消息 刷新消息列表
			// uni.$on('updateMessage', data => {
			// 	console.log('Message index监听到并更新')
			// 	// 获取列表数据
			// 	this.getListData();
			// });
		},
		// 监听页面卸载
		onUnload() {
			uni.$off('updateMessage')
		},
		computed: {
			...mapState({
				listData: (state) => state.message.messageList, //消息列表数据
			}),
		},
		methods: {
			...mapMutations(['updatamMssageList']),
			// 删除列表消息
			chatDelete(friend_id, type) {
				let _this = this;
				this.$api.post(global.apiUrls.chat_left_delete, {
					friend_id: friend_id,
					type: type
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.getListData();
					} else {
						_this.$message.info(res.msg)
					}
				})
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
			// 扫一扫
			onScanCode() {
				uni.scanCode({
					success: res => {
						this.more_select = false;
						console.log(res);
						var ind = res.result.indexOf("?");
						if (ind == -1) return this.$message.info("请扫正确的二维码");
						var url = res.result.split("?");
						url = url[1].split("=");
						var id = url[1];
						if (url[0] == "group_id") {
							uni.navigateTo({
								url: `/pages/friendData/groupDetails?id=${id}&is_join=1`
							});
						} else if (url[0] == "user_id") {
							uni.navigateTo({
								url: `/pages/friendData/friendData?id=${id}`
							});
						} else {
							this.$message.info("请扫正确的二维码")
						}
					}
				});
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style lang="less" scoped>
	.user-img {
		display: block;
		width: 94rpx;
		height: 94rpx;
		border-radius: 8rpx;
	}

	.solid-top-f7 {
		border-top: 1px solid #EEEEEE;
	}

	.cu-list .cu-item {
		height: 158rpx;
	}

	.cu-list>.cu-item .move {
		width: 130rpx;
	}

	.cu-list>.cu-item.move-cur {
		transform: translateX(-130rpx);
	}

	.cu-list.menu-avatar>.cu-item .action {
		padding-right: 32rpx;
		width: 250rpx;
		text-align: right;
	}

	.cu-list .content {
		view:first-child {
			width: 300rpx;
		}
	}

	.mask1 {
		background-color: rgba(0, 0, 0, 0);
	}

	// 更多
	.head {
		position: relative;

		.select {
			position: absolute;
			top: 60upx;
			right: 8upx;
			background-image: url(../../static/ye_icon/more_back.png);
			background-size: 100% 100%;
			width: 261upx;
			height: 324upx;
			z-index: 1;


			.select-row {
				display: flex;
				height: 104upx;
				align-items: center;
				position: relative;

				&:nth-child(1) {
					margin-top: 10upx;
				}

				image {
					width: 32rpx;
					height: 32rpx;
					margin-left: 32upx;
					margin-right: 20upx;
				}

				text {
					height: 40upx;
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 40upx;
					color: #ffffff;
				}

				&.border::after {
					position: absolute;
					right: 0;
					bottom: 0;
					left: 85upx;
					height: 2px;
					content: '';
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
					background-color: #5a5a5a;
				}
			}
		}
	}
</style>
