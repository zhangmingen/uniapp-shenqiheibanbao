<template>
	<view class="home">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">账号与安全</block>
		</cu-custom>
		<view class="padding-lr bg-white text-black">
			<view class="cu-form-group p-0 text-lg" >
				<view class="flex-shrink">账号</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">{{userInfo.invite_code}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left visibility"></image>
				</view>
			</view>
		</view>
		<view class="padding-lr bg-white text-black">
			<!-- <view class="cu-form-group p-0 text-lg margin-top" @tap="handleJump" data-url="/pages/home/bindingPhone">
				<view class="flex-shrink">手机号</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">15556565656</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view> -->
			<view class="cu-form-group p-0 text-lg margin-top" >
				<view class="flex-shrink">微信</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">15556565656</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left visibility"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg" >
				<view class="flex-shrink">QQ</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">15556565656</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left visibility"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				userInfo:global.userInfo
			}
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
