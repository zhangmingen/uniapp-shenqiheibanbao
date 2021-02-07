<template>
	<view>
		<cu-custom bgColor="bg-white text-xl text-333 solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg"></text>
			</block>
		</cu-custom>
		<view>
			<view class="title text-lg text-333 text-bold">
				申请添加朋友
			</view>
			<view class="margin-lr-xl padding-tb bg-white text-lg">
				<view class="text-gray text-df padding-bottom-sm">发起添加好友申请</view>
				<textarea  v-model="text" maxlength="30" />
				</view>
			<view class="submit bg-blu text-blu" v-if="text.length>0" @click="addFriendfun(id,text)">
				发送
			</view>
			<view class="submit text-999 bg-f2f2" v-else>
				发送
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: "",
				id:""
			}
		},
		onLoad(option){
			this.id = option.id;
			this.text = '我是'+JSON.parse(JSON.stringify(global.userInfo.user_nickname));
		},
		methods:{
			// 添加好友
			addFriendfun(id,msg) {
				let _this = this;
				this.$api.post(global.apiUrls.addFriend, {
					id: id,
					apply_msg:msg||''
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg)
						setTimeout(function(){
							uni.navigateBack({
								delta:1
							})
						},500)
					} else {
						_this.$message.info(res.msg)
					}
				})
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
	textarea{
		width: 100%;
		height: 200rpx;
		background-color: #F1F1F1;
		border-radius: 8rpx;
		padding: 20rpx;
	}
</style>
