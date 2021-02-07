<template>
	<view class="myselect">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">我的收藏</block>
		</cu-custom>
		<view class="padding" v-if="listData.length>0">
			<view class="item padding" v-for="(item,index) in listData" :key="index" @click="jumpDetail(item.aid)">
				<view class="flex align-center">
					<u-image :src="item.head_img" mode="aspectFill" width="88rpx" height="88rpx" border-radius="8rpx" class="flex-shrink head-img"
					 :lazy-load="true"></u-image>
					<view class="text-cut2 flex-sub text-lg text-black padding-left">{{item.content}}</view>
				</view>
				<view class="text-666 padding-top-sm">
					<text class="text-cut">{{item.user_nickname}} </text><text class="padding-left-sm">{{item.time_value}}</text>
				</view>
			</view>
			<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
		</view>
		<cu-none v-else></cu-none>
	</view>
</template>

<script>
	import pagingList from '@/common/minix/paging_list.js';
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.getCollection,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 获取到不同数据格式
				commentMixins: true
			}
		},
		onLoad() {
			// 配置允许请求并主动发起第一页请求
			
		},
		onShow(){
			this.pagingListToggle();
		},
		methods: {
			jumpDetail(id) {
				uni.navigateTo({
					url: "/pages/home/comment?id=" + id
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.item {
		width: 686rpx;
		height: 204rpx;
		background-color: #FFFFFF;
		margin: 0 auto;
		border-radius: 8rpx;
		margin-bottom: 20rpx;

		.head-img {
			width: 88rpx;
			height: 88rpx;
			border-radius: 8rpx;
		}
	}
</style>
