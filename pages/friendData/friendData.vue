<template>
	<view class="friendData" v-if="userData">
		<view class="flex solid-bottom bg-white padding">
			<u-image :src="userData.head_img" mode="aspectFill" width="114rpx" height="114rpx" class="flex-shrink user-img"
			 border-radius="8rpx" :lazy-load="true"></u-image>
			<view class="flex-sub padding-left">
				<view class="text-xl text-bold text-black">{{userData.friend_user_nickname || userData.user_nickname}}
					<image v-if="userData.sex>0" :src="userData.sex==1?'../../static/xs_icon/sex1.png':'../../static/xs_icon/sex2.png'"
					 mode="aspectFill" class="sex-icon margin-left-sm"></image>
				</view>
				<view class="text-999 user-data padding-top-xs">
					<view v-if="userData.friend_user_nickname">昵称：{{userData.user_nickname}}</view>
					<view>SQ号：{{userData.invite_code}}</view>
					<view v-if="userData.address">地区：{{userData.address}}</view>
					<view v-if="userData.signature" class="text-break">个性签名：{{userData.signature}}</view>
				</view>
			</view>
		</view>

		<view class="padding-lr bg-white text-333">
			<view class="cu-form-group p-0 text-lg solid-bottom" v-if="userData.is_friend==1" @tap="handleJump" :data-url="'/pages/friendData/remark?id='+id+'&name='+userData.friend_user_nickname">
				<view class="flex-shrink">设置备注和标签</view>
				<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
			</view>
			<view class="cu-form-group p-0 text-lg" @tap="handleJump" :data-url="'/pages/home/iRelease?id='+id">
				<view class="flex-shrink">个人动态</view>
				<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
			</view>
		</view>

		<view class="friendBtn flex align-center justify-center" v-if="userData.is_friend==0 && userInfo.id!=id" @click="handleJump"
		 :data-url="'/pages/addressList/friendRes?id='+id">
			添加到通讯录
		</view>
		<view class="friendBtn flex align-center justify-center" v-if="userData.is_friend==1" @click="handleJumpFriend($event,close)"
		 :data-url="`/pages/chat/chat?id=${userData.msg_id}&type=1&title=${userData.friend_user_nickname}&friend_id=${userData.id}`">
			<image src="../../static/imgs/icon/faxinxi.png" mode="" class="message-icon margin-right-xs"></image>发消息
		</view>
		<!-- 发布方式选择 -->
		<view class="cu-modal bottom-modal" :class="modalName=='headModal'?'show':''" @click.stop="hideModalFun"
		 @touchmove.stop.prevent>
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white item solid-bottom" @click.stop="complainFun">
					投诉
				</view>
				<view class="text-center text-lg bg-white item text-red" @click.stop="deleteFriend(id)">
					删除好友
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModalFun">
					取消
				</view>
			</view>
		</view>
		<!-- 投诉 -->
		<cu-complain :modalName="modalName" @hideModalFun="hideModalFun" type="1" :complain_id="id"></cu-complain>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: "", //投诉模态框
				id: "", //用户id
				userData: "",
				userInfo: global.userInfo,
				close: null
			}
		},
		onLoad(options) {
			this.close = options.close || null;
			this.id = options.id;
			this.getUserInfo(options.id);
		},
		methods: {
			// 跳转聊天页面
			handleJumpFriend(e,close) {
				let target = e.currentTarget || e.target,
					url = target.dataset.url
				if (close == 1) {
					uni.switchTab({
						url: "/pages/message/index"
					})
					setTimeout(function() {
						uni.navigateTo({
							url: url
						})
					}, 50)
				} else {
					uni.navigateTo({
						url: url
					})
				}
			},
			hideModalFun() {
				this.modalName = ""
			},
			getUserInfo(id) {
				let _this = this;
				this.$api.post(global.apiUrls.chatUserinfo, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.userData = res.data;
						// #ifdef APP-PLUS
						if (this.userData.is_friend == 0 || this.id == this.userInfo.id) {
							var webView = this.$mp.page.$getAppWebview();
							webView.setTitleNViewButtonStyle(0, {
								type: "none",
								text: "",
								width: "0"
							});
						}
						// #endif
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 投诉
			complainFun() {
				if (this.id == userInfo.id) {
					this.modalName = ""
					return this.$message.info("不能投诉自己");
				} else {
					this.modalName = 'complaintModal';
				}
			},
			// 删除好友
			deleteFriend(id) {
				if (this.id == userInfo.id) {
					this.modalName = ""
					return this.$message.info("不能删除自己");
				}
				let _this = this;
				this.$api.post(global.apiUrls.delete_friend, {
					to_id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						_this.hideModalFun();
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					} else {
						_this.$message.info(res.msg)
					}
				})
			}
		},
		// 监听导航右边点击事件
		onNavigationBarButtonTap(e) {
			// 显示模态框
			this.modalName = 'headModal'
		}
	}
</script>

<style lang="less" scoped>
	.sex-icon {
		width: 28rpx;
		height: 28rpx;
	}

	.text-red {
		color: #e54d42 !important;
	}

	.user-img {
		width: 114rpx;
		height: 114rpx;
		border-radius: 8rpx;
	}

	.user-data {
		line-height: 40rpx;
		padding-bottom: 64rpx;
	}

	.cu-form-group {
		height: 110rpx;
	}

	.friendBtn {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		height: 110rpx;
		font-size: 32rpx;
		color: #225DAD;
	}

	.message-icon {
		width: 28rpx;
		height: 28rpx;
	}

	.cu-form-group+.cu-form-group {
		border: none;
	}
</style>
