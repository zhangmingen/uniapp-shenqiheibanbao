<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">
				添加朋友
			</block>
		</cu-custom>

		<view class="content">
			<view class="bg-eded overflow padding-top">
				<view class="flex align-center justify-center" @tap="handleJump" data-url="/pages/addressList/friendList">
					
					<view class="padding-left-xs text-df addinput bg-white text-center"><text class="cuIcon-search lg margin-right-xs"></text>声浪号/手机号</view>
				</view>
				<view class="flex align-center justify-center wechatid">
					<text>我的声浪号：{{userInfo.invite_code}}</text>
					<image src="../../static/imgs/icon/qr_blue.png" mode="aspectFill" class="icon-qr margin-left-sm" @tap="handleJump"
					 data-url="/pages/home/my-qr/my-qr"></image>
				</view>
			</view>
			<view class="cu-form-group padding-tb-sm" @click="onScanCode">
				<image src="../../static/imgs/icon/saoyisao.png" mode="aspectFill" class="nav-icon margin-right"></image>
				<view class="flex-sub cu-form-group justify-between solid-bottom cu-form-group-right">
					<view>
						<view class="text-lg text-black">扫一扫</view>
						<view class="text-sm text-gray">扫描二维码名片</view>
					</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:global.userInfo
			}
		},
		methods: {
			// 扫一扫
			onScanCode() {
				uni.scanCode({
					success: res => {
						console.log(res);
						var ind = res.result.indexOf("?");
						if(ind==-1) return this.$message.info("请扫正确的二维码");
						var url = res.result.split("?");
						url = url[1].split("=");
						var id = url[1];
						this.more_select=false;
						if (url[0] == "group_id") {
							uni.navigateTo({
								url: `/pages/friendData/groupDetails?id=${id}&is_join=1`
							});
						} else if(url[0] == "user_id") {
							uni.navigateTo({
								url: `/pages/friendData/friendData?id=${id}`
							});
						}else{
							this.$message.info("请扫正确的二维码")
						}
					}
				});
			},
		}

	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="less" scoped>
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
</style>
