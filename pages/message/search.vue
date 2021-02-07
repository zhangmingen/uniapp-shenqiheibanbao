<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp text-lg">
						<text class="cuIcon-search flex-shrink"></text>
						<input type="text" v-model="search" maxlength="50"  class="flex-sub padding-left-xs text-df" @confirm="getListData"
						 placeholder="请输入关键词" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="getListData">搜索</text>
				</view>
			</block>
		</cu-custom>
		<view class="" v-if="(listData['group_array'] && listData['group_array'].length>0) || (listData['friend_data'] && listData['friend_data'].length>0)">
			<view class="content padding-bottom-sm bg-white" v-if="listData['friend_data'].length>0">
				<view class="bg-white padding-lr">
					<view class="text-sm text-666 padding-tb-sm solid-bottom">
						好友
					</view>
				</view>
				<view class="cu-form-group" @click="handleJump" :data-url="`/pages/chat/chat?id=${item.msg_id}&type=1&title=${item.nickname}&friend_id=${item.id}`" v-for="(item,index) in listData['friend_data']" :key="index">
					<u-image :src="item.head_img" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx"
					 :lazy-load="true" class="user-img margin-right"></u-image>
					<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
						<view class="text-lg">{{item.nickname}}</view>
					</view>
				</view>
			</view>
			<view class="content margin-top padding-bottom-sm bg-white"  v-if="listData['group_array'].length>0">
				<view class="bg-white padding-lr">
					<view class="text-sm text-666 padding-tb-sm solid-bottom">
						群聊
					</view>
				</view>
				<view class="cu-form-group" @click="handleJump" :data-url="`/pages/chat/chat?id=${item.msg_id}&type=2&title=${item.group_title}&group_id=${item.id}`" v-for="(item,index) in listData['group_array']" :key="index">
					<u-image :src="item.thumb" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx"
					 :lazy-load="true" class="user-img margin-right"></u-image>
					<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
						<view class="text-lg">{{item.group_title}}</view>
					</view>
				</view>
			</view>
		</view>
		<cu-none v-else></cu-none>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: {},
				search: "",
			}
		},
		methods: {
			// 获取列表数据
			getListData() {
				let _this = this;
				if (!this.search.trim()) return this.$message.info('请输入搜索内容');
				this.$api.post(global.apiUrls.user_chat_list, {
					search: this.search.trim()
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						var data = res.data;
						_this.listData = data;
						if(_this.listData['friend_data'].length==0 && _this.listData['group_array'].length==0){
							this.$message.info("没有搜索到该用户或群组")
						}
						console.log()
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
		}

	}
</script>
<style lang="less" scoped>
	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
	}

	.user-img {
		width: 70rpx;
		height: 70rpx;
		border-radius: 8rpx;
	}

	.cu-form-group {
		height: 130rpx;
	}
</style>
