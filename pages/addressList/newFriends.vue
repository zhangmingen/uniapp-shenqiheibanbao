<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">新的朋友</text>
			</block>
			<block slot="right">
				<text class="text-lg text-blu flex-shrink margin-left-sm margin-right mt-5" @tap="handleJump" data-url="/pages/addressList/addFriend">添加朋友</text>
			</block>
		</cu-custom>

		<view class="content" v-if="(listData.front && listData.front.length>0) || (listData.later  && listData.later.length>0)">
			<view class="text-gray bg-f7f7 padding-tb-xs text-666 padding-lr-sm" v-if="listData.front && listData.front.length>0">
				近三天
			</view>
			<view class="cu-form-group solid-bottom" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.user_id"
			 v-for="(item,index) in listData.front" :key="index">
				<u-image :src="item.head_img" mode="aspectFill" width="72rpx" height="72rpx" border-radius="8rpx" :lazy-load="true"
				 class="user-img margin-right flex-shrink"></u-image>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="text-lg">
						<view class="text-lg text-black text-cut">{{item.user_nickname}}</view>
						<view class="text-normal text-gray text-sm text-999 text-cut">{{item.msg}}</view>
					</view>
					<view class="flex align-center flex-shrink" v-if="item.status==0">
						<view class="flex-shrink padding-tb-xs padding-lr-sm text-999 bg-eded text-sm radius margin-right" @click.stop="refuseFriend(item.user_id)">拒绝</view>
						<view class="flex-shrink padding-tb-xs padding-lr-sm text-blu bg-eded text-sm radius" @click.stop="agreeFriend(item.user_id)">接受</view>
					</view>
					<view class="flex-shrink text-999 text-sm" v-else-if="item.status==1">已接受</view>
					<view class="flex-shrink text-999 text-sm" v-else>已拒绝</view>
				</view>
			</view>
			<view class="text-gray bg-f7f7 padding-tb-xs text-666 padding-lr-sm" v-if="listData.later && listData.later.length>0">
				三天前
			</view>
			<view class="cu-form-group solid-bottom" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.user_id"
			 v-for="(item,index) in listData.later" :key="index">
				<u-image :src="item.head_img" mode="aspectFill" width="72rpx" height="72rpx" border-radius="8rpx" :lazy-load="true"
				 class="user-img margin-right flex-shrink"></u-image>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="text-lg">
						<view class="text-lg text-black text-cut">{{item.user_nickname}}</view>
						<view class="text-normal text-gray text-sm text-999 text-cut">{{item.msg}}</view>
					</view>
					<view class="flex align-center flex-shrink" v-if="item.status==0">
						<view class="flex-shrink padding-tb-xs padding-lr-sm text-999 bg-eded text-sm radius margin-right" @click.stop="refuseFriend(item.user_id)">拒绝</view>
						<view class="flex-shrink padding-tb-xs padding-lr-sm text-blu bg-eded text-sm radius" @click.stop="agreeFriend(item.user_id)">接受</view>
					</view>
					<view class="flex-shrink text-999 text-sm" v-else-if="item.status==1">已接受</view>
					<view class="flex-shrink text-999 text-sm" v-else>已拒绝</view>
				</view>
			</view>
			<!-- <view class="text-grey text-center padding-tb text-xs" v-if="listData.later && listData.later.length>5">我们是有底线的～</view> -->

		</view>
		<cu-none v-else></cu-none>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: [], //搜索数据
			}
		},
		onLoad() {
			this.getApplyFriend();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getApplyFriend();
		},
		methods: {
			// 获取好友申请
			getApplyFriend() {
				let _this = this;
				this.$api.post(global.apiUrls.applyFriendList, {}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.listData = res.data;
					} else {
						_this.$message.info(res.msg)
					}
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 300)
				})
			},
			// 同意添加好友
			agreeFriend(id) {
				let _this = this;
				this.$api.post(global.apiUrls.agreeFriend, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						this.getApplyFriend();
					} else {
						_this.$message.info(res.msg)
					}
				})
			},

			// 拒绝添加好友
			refuseFriend(id) {
				let _this = this;
				this.$api.post(global.apiUrls.refuseFriend, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						this.getApplyFriend();
					} else {
						_this.$message.info(res.msg)
					}
				})
			}
		}

	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="less" scoped>
	.cu-form-group+.cu-form-group {
		border: 0;
	}

	.cu-form-group {
		// height: 130rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.mt-5 {
		margin-top: -5rpx;
	}

	.addinput {
		width: 700rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 8rpx;
	}

	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
	}

	.icon-qr {
		width: 30rpx;
		height: 30rpx;
	}

	.wechatid {
		margin: 48rpx 0;
	}

	.right-icon {
		width: 14rpx;
		height: 24rpx;
	}

	.nav-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.cu-form-group-right {
		padding: 24rpx 0;
	}

	.user-img {
		width: 72rpx;
		height: 72rpx;
	}
</style>
