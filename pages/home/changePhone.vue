<template>
	<view class="binding">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">更换手机号</block>
			<block slot="right">
				<view class="next-step text-df text-center bg-e1e1" @tap="handleJump" data-url="/pages/home/writeCode"> 
				<!-- //bg-theme -->
					下一步
				</view>
			</block>
		</cu-custom>
		<view class="cu-form-group bg-eded solid-top solid-bottom" >
			<view class="flex-shrink text-lg solid-right padding-right-sm">中国</view>
			<input class="flex-sub text-lg text-999 padding-lr-sm" maxlength="11" placeholder="请填写手机号码"></input>
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
</style>
