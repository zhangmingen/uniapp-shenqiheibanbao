<template>
	<view class="binding">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">填写验证码</block>
		</cu-custom>
		<view class="cu-form-group bg-eded solid-top solid-bottom">
			<view class="flex-shrink text-lg solid-right padding-right-sm">手机号</view>
			<input class="flex-sub text-lg text-999 padding-lr-sm" maxlength="11" placeholder="请填写手机号码"></input>
		</view>
		<view class="cu-form-group bg-eded solid-bottom">
			<view class="flex-shrink text-lg solid-right padding-right-sm">验证码</view>
			<input class="flex-sub text-lg text-999 padding-lr-sm" maxlength="6" placeholder="请输入验证码"></input>
		</view>
		<view class="submit-btn bg-e1e1">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		}
	}
</script>

<style lang="less" scoped>
	.next-step {
		width: 120rpx;
		height: 58rpx;
		line-height: 58rpx;
		border-radius: 8rpx;
		margin-right: 32rpx;
	}

	.cu-form-group {
		height: 120rpx;
	}

	.submit-btn {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		margin: 0 auto;
		border-radius: 44rpx;
		margin-top: 60rpx;
	}
</style>
