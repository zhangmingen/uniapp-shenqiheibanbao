<template>
	<view class="home">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">设置</block>
		</cu-custom>
		<view class="">
			<view class="cu-form-group" @tap="handleJump" data-url="/pages/home/account">
				<view class="flex-sub cu-form-group justify-between solid-bottom p-0">
					<view class="text-lg">账号与安全</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
			<view class="cu-form-group" @tap="handleJump" data-url="/pages/home/about">
				<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
					<view class="text-lg">关于我们</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="flex-sub cu-form-group justify-between p-0" @tap="onSetUpCache">
					<view class="text-lg">清除缓存</view>
					<view class="flex align-center">
						<view class="padding-right-sm text-gray">{{CACHE_SIZE}}M</view>
						<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
					</view>
				</view>
			</view>
			<view class="cu-form-group margin-top-sm" @tap="logOut">
				<view class="flex-sub cu-form-group justify-center p-0">
					<view class="text-lg text-bold">退出登录</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog type="info" title="确定清除本地缓存吗？" :before-close="true" @confirm="confirm" @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog type="info" title="确定要退出当前账号吗？" :before-close="true" @confirm="confirmTwo" @close="close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CACHE_SIZE: 0
			}
		},
		onLoad() {
			this.CACHE_SIZE = uni.getStorageSync('CACHE_SIZE') || 0;
		},
		methods: {
			close(done) {
				done()
			},
			confirm(done) {
				done()
				this.$popup.showLoading(('正在清除缓存...'))
				uni.removeStorageSync('CACHE_SIZE');
				setTimeout(() => {
					uni.hideLoading();
					this.CACHE_SIZE = uni.getStorageSync('CACHE_SIZE') || 0;
				}, 3000)
			},
			confirmTwo(done){
				done();
				uni.clearStorageSync();
				// uni.removeStorageSync('USER_INFO');
				uni.reLaunch({
					url: '/pages/login'
				})
			},
			// 清除缓存
			onSetUpCache() {
				this.$refs.popup1.open();
			},
			// 退出登录
			logOut() {
				this.$refs.popup2.open();
			},
		}
	}
</script>

<style scoped lang="less">
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
