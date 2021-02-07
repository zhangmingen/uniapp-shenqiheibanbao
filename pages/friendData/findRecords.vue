<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="search" maxlength="50" class="flex-sub padding-left-xs text-df" placeholder="请输入关键词"
						 @confirm="searchFun" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="backFun">取消</text>
				</view>
			</block>
		</cu-custom>

		<view class="cu-list menu-avatar" v-if="listData.length>0">
			<view class="cu-item" v-for="(item,index) in listData" :key="index">
				<view class="cu-avatar user-img">
					<u-image :src="item.u_head_img" mode="aspectFill" width="94rpx" height="94rpx" border-radius="8rpx" :lazy-load="true"></u-image>
				</view>
				<view class="content">
					<view class="text-df text-black text-cut">{{item.nickname || ""}}</view>
					<view class="text-df text-black text-cut3">{{item.content}}</view>
				</view>
				<view class="action flex-shrink">
					<view class="text-gray text-sm">{{item.sendtime}}</view>
					<view class="text-gray text-xs visibility">22:20</view>
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
				minixPagingListsApi: global.apiUrls.msg_list,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 获取到不同数据格式
				commentMixins: true,
				msg_id: "", //聊天室id
				group_id:"",//群组id
				search: "", //搜索内容
				userInfo: global.userInfo, //用户信息
			}
		},
		onLoad(e) {
			if (e.type == 1) {
				this.msg_id = e.msg_id;
				this.minixPagingListsApi = global.apiUrls.msg_list;
			}else{
				this.group_id = e.group_id || "";
				this.minixPagingListsApi = global.apiUrls.msg_group_list;
			}
		},
		methods: {
			backFun(){
				uni.navigateBack({
					delta:1
				})
			},
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					msg_id: this.msg_id, //聊天室id
					group_id: this.group_id, //群组id
					search: this.search, //搜索内容
					
				}
			},
			searchFun() {
				if (!this.search.trim()) return this.$message.info('请输入搜索内容');
				this.pagingListToggle();
			}
		}

	}
</script>

<style lang="less" scoped>
	page {
		background-color: #FFFFFF;
	}

	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
	}

	.user-img {
		display: block;
		width: 94rpx;
		height: 94rpx;
		border-radius: 8rpx;
	}
	.cu-list .cu-item {
		height: 158rpx;
	}
	
	.cu-list>.cu-item .move {
		width: 130rpx;
	}
	
	.cu-list>.cu-item.move-cur {
		transform: translateX(-130rpx);
	}
	
	.cu-list.menu-avatar>.cu-item .action {
		padding-right: 32rpx;
		width: 250rpx;
		text-align: right;
	}
	
	.cu-list .content {
		view:first-child {
			width: 300rpx;
		}
	}
</style>
