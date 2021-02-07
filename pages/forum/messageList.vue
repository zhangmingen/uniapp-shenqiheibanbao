<template>
	<view class="messagelist">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">
				消息
			</block>
		</cu-custom>
		<view class="padding-lr">
			<view class="flex justify-between padding-top-sm solid-bottom padding-bottom" v-for="(item,index) in listData" :key="index" @click="jumpDetail(item.f_id)">
				<view class="flex-sub">
					<view class="flex align-center padding-bottom-sm">
						<u-image :src="item.head_img" mode="aspectFill" width="84rpx" height="84rpx" class="flex-shrink head-img"
						 border-radius="8rpx" :lazy-load="true"></u-image>
						<view class="flex-sub padding-left-xs">
							<view class="text-225 padding-bottom-xs">{{item.user_nickname}}</view>
							<view class="text-sm text-999">{{item.create_time}}</view>
						</view>
					</view>
					<view class="text-black text-cut instructions">{{item.type==1?'评论了这条动态':'点赞了这条动态'}}</view>
				</view>
				<view class="message-content" v-if="item.forum_type=='video'">
					<u-image class="bg-img" :src="item.file_url+'?x-oss-process=video/snapshot,t_0,f_jpg'" width="100%" height="100%" mode="aspectFill"></u-image>
				</view>
				<view class="message-content" v-else-if="item.forum_type=='image'">
					<u-image class="bg-img" :src="item.file_url" width="100%" height="100%" mode="aspectFill" ></u-image>
				</view>
				<view class="message-content padding-xs text-sm text-cut3 flex-shrink bg-f7f7" v-else>
					{{item.forum_content}}
				</view>
			</view>
			<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="listData.length>5">我们是有底线的～</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: []
			}
		},
		onLoad() {
			// 获取数据
			this.getShowData()
		},
		methods: {
			jumpDetail(id) {
				if (this.comment) return;
				uni.navigateTo({
					url: "/pages/home/comment?id=" + id
				})
			},
			getShowData() {
				let _this = this;
				this.$api.post(global.apiUrls.getMessageList).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.listData = res.data;
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
<style lang="less" scoped>
	.head-img {
		width: 84rpx;
		height: 84rpx;
	}

	.message-content {
		width: 120rpx;
		height: 120rpx;
		line-height: 36rpx;
	}
	.instructions{
		width: 500rpx;
	}
</style>
