<template>
	<view class="binding">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">绑定手机号</block>
		</cu-custom>
		<image src="../../static/imgs/icon/bindphone.png" mode="aspectFill" class="bindphone"></image>
		<view class="text-lg text-bold text-center">你的手机号:15010626666</view>
		<view class="bind-btn bg-theme text-center text-white" @tap="handleJump" data-url="/pages/home/changePhone">更换手机号</view>
	</view>
</template>

<script>
</script>

<style lang="less">
	.bindphone {
		display: block;
		width: 80rpx;
		height: 130rpx;
		margin: 150rpx auto 60rpx;
	}
	.bind-btn {
		width: 400rpx;
		height: 72rpx;
		line-height: 72rpx;
		border-radius: 36rpx;
		margin: 0 auto;
		margin-top: 360rpx;
	}
</style>
