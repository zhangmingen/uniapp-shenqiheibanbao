<template>
	<view class="login">
		<cu-custom bgColor="bg-white text-black text-xl" :isBack="true">
			<block slot="content">关于我们</block>
		</cu-custom>
		<!-- logo -->
		<image src="/static/logo.png" mode="aspectFill" class="login-icon"></image>
		<view class="text-xxl text-bold text-center">神奇黑板报</view>
		<view class="padding-top-lg text-center text-lg text-grey">当前版本{{showData.version}}</view>
		<view class="cu-form-group solid-bottom solid-top margin-lr margin-top-xl ptb-50">
			<image src="/static/imgs/icon/phone.png" mode="aspectFill" class="phone-icon margin-right"></image>
			<view class="flex-sub cu-form-group justify-between p-0" @click="makephone(showData.regard_phone)" v-if="showData.regard_phone">
				<view class="text-xxl text-bold">{{showData.regard_phone}}</view>
				<image src="/static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
			</view>
		</view>
		<!-- 备案信息 -->
		<view class="text-center text-sm text909 fixed-bottom">Copyright©2019 神奇黑板报. All Right Reserved</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showData:{}
			}
		},
		onLoad(){
			this.getShowData()
		},
		methods: {
			makephone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
			},
			getShowData() {
				var _this = this;
				this.$api.post(global.apiUrls.systemsRegard).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.showData = res.data;
					}
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="less">
	.phone-icon {
		width: 56rpx;
		height: 56rpx;
	}

	.ptb-50 {
		padding: 50rpx 0;
	}

	.login-icon {
		display: block;
		width: 172rpx;
		height: 172rpx;
		border: 8rpx;
		margin: 0 auto;
		margin-top: 160rpx;
		margin-bottom: 48rpx;
	}

	.icon-img {
		width: 38rpx;
		height: 38rpx;
		margin-top: -1rpx;
	}

	.text909 {
		color: #909093;
	}

	.fixed-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 60rpx;
		margin: 0 auto;
	}
</style>
