<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="like" maxlength="50" @confirm="searchFun" class="flex-sub padding-left-xs text-df" placeholder="请输入关键词" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="searchFun">搜索</text>
				</view>
			</block>
		</cu-custom>

		<view class="content">
			<view class="" v-if="listData.length>0">
				<cu-card :showData="item" v-for="(item,index) in listData" :key="index" @refreshdata="refreshdata"></cu-card>
				<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
			</view>
			<cu-none v-else></cu-none>
		</view>
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
				minixPagingListsApi: global.apiUrls.BBSList,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 额外参数分类id type
				like: "", //搜索内容
				cate_id: "", //分类
			}
		},
		onLoad() {
		},
		methods: {
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					like: this.like, //搜索内容
					cate_id: "", //分类
				}
			},
			// 删除完
			refreshdata(id) {
				if (this.listData.length > 10) {
					var listData = this.listData;
					var ind = listData.findIndex(function(a) {
						return a.aid == id;
					})
					listData.splice(ind, 1);
				} else {
					this.pagingListToggle();
				}
			},
			// 更新评论页点完赞状态
			refreshLike(id) {
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].aid == id) {
						var item = listData[i];
						if (item.is_like == 1) {
							item.is_like = 0;
							item.like_num -= 1;
						} else {
							item.is_like = 1
							item.like_num += 1;
						}
					}
				}
				this.listData = listData;
			},
			// 更新评论页收藏状态
			refreshFav(id) {
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].aid == id) {
						var item = listData[i];
						if (item.is_collect == 1) {
							item.is_collect = 0;
							item.fav_num -= 1;
						} else {
							item.is_collect = 1
							item.fav_num += 1;
						}
					}
				}
				this.listData = listData;
			},
			searchFun(){
				if (!this.like.trim()) return this.$message.info('搜索内容不能为空');
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
</style>
