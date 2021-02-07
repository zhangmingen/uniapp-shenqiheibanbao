<template>
	<view class="home">
		<cu-custom bgColor="bg-white text-xl text-black solid-bottom" :isBack="false">
			<block slot="content">我的</block>
		</cu-custom>
		<view class="home-user bg-white flex align-center">
			<view class="" @click="handleJump" data-url="/pages/home/personal">
				<u-image :src="userInfo.head_img" mode="aspectFill" width="118rpx" height="118rpx" class="user-img flex-shrink"
				 border-radius="8rpx" :lazy-load="true"></u-image>
			</view>
			<view class="text-cut padding-lr flex-sub text-lg text-bold text-333" @tap="handleJump" data-url="/pages/home/personal">{{userInfo.user_nickname}}</view>
			<image src="../../static/imgs/icon/qr.png" class="qrcode flex-shrink margin-right-sm" mode="aspectFill" @click.stop="handleJump"
			 data-url="/pages/home/my-qr/my-qr"></image>
			<image src="../../static/imgs/icon/right.png" class="right-icon flex-shrink" mode="aspectFill" @click.stop="handleJump"
			 data-url="/pages/home/my-qr/my-qr"></image>
		</view>
		<view class="">
			<view class="cu-form-group" @tap="handleJump" data-url="/pages/home/iRelease">
				<image src="../../static/imgs/icon/fenxiang.png" mode="aspectFill" class="nav-icon margin-right"></image>
				<view class="flex-sub cu-form-group justify-between solid-bottom p-0">
					<view class="text-lg">我的发布</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
			<view class="cu-form-group" @tap="handleJump" data-url="/pages/home/myselect">
				<image src="../../static/imgs/icon/shoucang.png" mode="aspectFill" class="nav-icon margin-right"></image>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="text-lg">我的收藏</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
			<view class="cu-form-group margin-top" @tap="handleJump" data-url="/pages/home/setting">
				<image src="../../static/imgs/icon/shezhi.png" mode="aspectFill" class="nav-icon margin-right"></image>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="text-lg">设置</view>
					<view>

						<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 断网提示 -->
		<fu-notwork></fu-notwork>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: global.userInfo,
			}
		},
		onShow() {
			this.getData()
		},
		onLoad() {
			this.CACHE_SIZE = uni.getStorageSync('CACHE_SIZE') || 0;
		},
		methods: {
			// 获取用户最新信息
			getData() {
				let _this = this;
				this.$api.post(global.apiUrls.getUserInfo).then(res => {
					var res = res.data;
					if (res.code == 1 && res.data) {
						global.userInfo = res.data;
						uni.setStorageSync('USER_INFO', global.userInfo);
						this.userInfo = global.userInfo;
					}
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #F1F1F1;
	}
</style>
<style scoped lang="less">
	.home-user {
		padding: 72rpx 34rpx;
	}

	.user-img {
		width: 118rpx;
		height: 118rpx;
	}

	.qrcode {
		width: 32rpx;
		height: 32rpx;
	}

	.right-icon {
		width: 14rpx;
		height: 24rpx;
	}

	.nav-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.cu-form-group+.cu-form-group {
		border: none;
	}
</style>
