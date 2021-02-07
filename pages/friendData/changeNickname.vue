<template>
	<view class="">
		<cu-custom bgColor="bg-white text-xl text-333 solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">修改昵称</text>
			</block>
		</cu-custom>
		<view class="">
			<view class="title text-lg text-333">
				昵称修改后，只会在当前群聊展示，群内成员可见。
			</view>
			<view class="margin-lr-xl padding-tb bg-white flex align-center justify-between text-lg solid-bottom solid-top">
				<u-image :src="userInfo.head_img" mode="aspectFill" width="72rpx" height="72rpx" border-radius="6rpx" :lazy-load="true"
				 class="user-img margin-right-sm"></u-image>
				<input type="text" v-model="nickName" placeholder="请输入昵称" class="flex-sub" maxlength="10" />
				<text class="cuIcon-roundclosefill lg" v-if="nickName.trim().length>0" @click="nickName=''"></text>
			</view>
			<view class="submit bg-blu text-blu" v-if="nickName.trim().length>0" @click="submitFun">
				确定
			</view>
			<view class="submit text-999 bg-f2f2" v-else>
				确定
			</view>
		</view>

	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				nickName: "", //群组昵称
				id: "", //群组id
				userInfo: global.userInfo
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.nickName = JSON.parse(decodeURIComponent(options.nickName));
		},
		methods:{
			submitFun() {
				if (!this.nickName || !this.nickName.trim()) return this.$message.info('群聊昵称不能为空');
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.set_group_nickname, {
						id: _this.id,
						nickname: _this.nickName
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							_this.$message.info(res.msg)
							var pages = getCurrentPages();
							var beforePage = pages[pages.length - 2]; //上一个页面
							if (beforePage.$vm.groupInfo) beforePage.$vm.groupInfo.user_group.nickname = _this.nickName;
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 500)
						}
					})
				}, 300)
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped>
	.user-img {
		width: 72rpx;
		height: 72rpx;
	}

	.title {
		width: 512rpx;
		line-height: 50rpx;
		padding: 140rpx 0 64rpx;
		margin: 0 auto;
		text-align: center;
	}

	.submit {
		width: 336rpx;
		text-align: center;
		padding: 14rpx 0;
		margin: 0 auto;
		margin-top: 270rpx;
		border-radius: 8rpx;
	}
</style>
