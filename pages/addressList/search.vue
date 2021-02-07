<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="like" @confirm="getListData(like.trim())" maxlength="50" class="flex-sub padding-left-xs text-df" placeholder="声浪号/手机号" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="getListData(like.trim())">搜索</text>
				</view>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<block v-for="(item,index) in listData" :key="index">
				<view :class="'indexItem-' + item.key" :id="'indexes-' + item.key" :data-index="item.key">
					<view class="padding-lr-sm padding-tb-xs bg-gray border-top">{{item.key}}</view>
					<view class="cu-form-group border-0" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+friend.id" v-for="(friend,index) in item.data" :key="index">
						<u-image :src="friend.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="user-img margin-right"
						 border-radius="8rpx" :lazy-load="true"></u-image>
						<view class="flex-sub cu-form-group p-0 solid-bottom flex flex-direction align-start padding-tb">
							<view class="text-lg">{{friend.friend_user_nickname || friend.user_nickname}} </view>
							<view class="text-sm text-gray" v-if="friend.friend_user_nickname">昵称：{{friend.user_nickname}} </view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<cu-none v-else></cu-none>
	</view>
</template>

<script>
	var timer = null;
	export default {
		data() {
			return {
				listData: [],
				like: ""
			}
		},
		onLoad() {

		},
		methods: {
			// 获取列表数据
			getListData(like) {
				console.log(like)
				if (!like.trim()) return this.$message.info('搜索内容不能为空')
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.getAddressList, {
						search: like
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							_this.listData = res.data.data;
							if(_this.listData.length<=0) _this.$message.info('没有搜索到该用户');
						} else {
							_this.$message.info(res.msg)
						}
					})
				}, 300)
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
	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		text{
			font-size: 30rpx;
		}
	}
	.padding-tb{
		padding: 20rpx 0 !important;
	}
	.cu-form-group {
		color: #333333;
		height: 120rpx;
	}

	.cu-form-group+.cu-form-group {
		border: none;
	}

	.nav-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 8rpx;
	}
</style>
