<template>
	<view class="comment">
		<!-- <cu-custom bgColor="text-xl bg-eded solid-bottom" :isBack="true">
			<block slot="content">评论</block>
		</cu-custom> -->
		<cu-card :comment="true" :showData="showData" :commentList="listData" @commentSuccess="commentSuccess" @delFlush="delFlush"></cu-card>
	</view>
</template>

<script>
	import pagingList from '@/common/minix/paging_list.js';
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				listData: [], //列表数据
				showData: {},
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.forumCommentList,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 论坛id
				id: "",
				commentMixins: true, //评论数据存储格式
			}
		},
		onLoad(options) {
			this.id = options.id || "";
			this.getShowData(options.id);
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListToggle();
			console.log(this.listData)
		},
		methods: {
			getShowData(id) {
				var _this = this;
				this.$api.post(global.apiUrls.commentDetails, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.showData = res.data;
					}
				})
			},
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					id: this.id, //论坛id
				}
			},
			// 评论成功
			commentSuccess(id) {
				this.showData.comment_size++;
				this.pagingListToggle();
			},
			// 删除评论更新数据 item所删除评论 tier层级 comment父级
			delFlush(item, tier, item1) {
				this.showData.comment_size--;
				if (tier == 1) {
					if (this.listData.length > 6) {
						var listData = this.listData;
						var ind = listData.findIndex(function(a) {
							return a.aid == item.aid;
						})
						listData.splice(ind, 1);
					} else {
						this.pagingListToggle();
					}
				} else {
					var comment = item1.comment_level;
					var ind = comment.findIndex(function(a) {
						return a.aid == item.aid;
					})
					comment.splice(ind, 1);
				}
			}

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
