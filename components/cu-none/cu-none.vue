<template>
	<view class="padding-top-xl text-center padding-bottom-xxxl">
		<image src="../../static/imgs/none.png" mode="aspectFill"></image>
		<view class="text-center text-gray text-sm padding-top-sm">{{title}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		name: 'cu-complain',
		props: {
			title: {
				type: String,
				default: "这里还没有内容"
			}
		}
	}
</script>

<style lang="less" scoped>
	.padding-bottom-xxxl {
		background-color: #FFFFFF;
		height: 100vh;
	}
</style>
