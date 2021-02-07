<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl" :isBack="false">
			<block slot="content">论坛</block>
			<block slot="right">
				<view class="text-right w-100 padding-right text-black">
					<text class="cuIcon-search lg margin-right-sm text-40" @click="handleJump" data-url="/pages/forum/search"></text>
					<text class="cuIcon-roundadd lg text-40" @click="showModal" data-target="headModal"></text>
				</view>
			</block>
		</cu-custom>
		<view class="content bg-white">
			<view class="text-center" v-if="forum_num>0">
				<view class="news bg-eded padding-lr" @click="handleJump" data-url="/pages/forum/messageList">
					<image src="../../static/imgs/icon/news.png" mode="aspectFill" class="margin-right-xs"></image>
					{{forum_num}}条新消息
				</view>
			</view>
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="tab" :class="forum_num>0?'':'padding-top'">
					<view class="text-center item" v-for="(item,index) in classList" :key="index">
						<image :src="item.cat_img" mode="aspectFill" @click="handleJump" :data-url="'/pages/forum/classify?id='+item.id"></image>
						<view class="">{{item.title}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 内容区域 -->
		<view class="margin-top-sm bg-white">
			<view class="padding-lr padding-top-lg padding-bottom-sm text-xl text-black text-bold">
				精品推荐
			</view>
			<view class="" v-if="listData.length>0">
				<cu-card :showData="item" v-for="(item,index) in listData" :key="index" @refreshdata="refreshdata"></cu-card>
				<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
			</view>
			<cu-none v-else></cu-none>
		</view>
		<!-- 发布方式选择 -->
		<view class="cu-modal bottom-modal" :class="modalName=='headModal'?'show':''" @click.stop="hideModal"
		 @touchmove.stop.prevent>
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white padding-tb solid-bottom flex flex-direction align-center" @click="carera(['album','camera'])">
					图片<text class="text-xs text-gray">拍照或相册选择</text>
				</view>
				<view class="text-center text-lg bg-white padding-tb solid-bottom flex flex-direction align-center" @click="videoFun(['album','camera'])">
					视频<text class="text-xs text-gray">拍摄或相册选择(限制20M以内)</text>
				</view>
				<view class="text-center text-lg bg-white item" @click="textFun">
					文章
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModal">
					取消
				</view>
			</view>
		</view>
		<!-- 断网提示 -->
		<fu-notwork></fu-notwork>
	</view>
</template>

<script>
	import {
		UploadImage
	} from '@/common/utils/index';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import pagingList from '@/common/minix/paging_list.js';
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				modalName: "",
				classList: [], //论坛分类
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.BBSList,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 请求消息数量
				forumIndex: true,
				// 额外参数分类id type
				like: "", //搜索内容
				cate_id: "", //分类
			}
		},
		computed: mapState({
			forum_num: state => state.message.forum_num, //消息数量
		}),
		// 下拉刷新
		onPullDownRefresh() {
			// 获取论坛分类
			this.getClassList();
		},
		onLoad() {
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListToggle();

		},
		onShow() {
			// 获取未读消息数量
			this.getUnreadMessage();
			// 获取论坛分类
			this.getClassList();
			// if (this.updataMessageNum > 0) {
			// 	uni.setTabBarBadge({
			// 		index: 2,
			// 		text: this.updataMessageNum > 99 ? '99+' : this.updataMessageNum + ""
			// 	})
			// } else {
			// 	uni.removeTabBarBadge({
			// 		index: 2
			// 	})
			// }
		},
		methods: {
			/**
			 * updataMessageNum  未读消息数量
			 * */
			...mapMutations(["updataMessageNum"]),
			toJSON() {},
			showModal(e) {
				var edit = uni.getStorageSync('EDIT');
				if (edit) {
					this.$popup.showModal("是否恢复上次保存编辑？", '', '恢复', '不恢复')
						.then((res) => {
							if (res) {
								this.modalName = e.currentTarget.dataset.target;
								uni.removeStorageSync('EDIT');
							} else {
								uni.navigateTo({
									url: "/pages/forum/edit?type=edit"
								})
							}
						})
				} else {

					this.modalName = e.currentTarget.dataset.target;
				}
			},
			hideModal(e) {
				this.modalName = null
			},
			stopFun() {
				return false;
			},
			carera(type) {
				let _this = this;
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: type, //从相册选择
					success: function(res) {
						_this.hideModal();
						uni.showLoading({
							title: "上传中..."
						});
						var fileArr = [];
						var fileId = [];
						const tempFilePaths = res.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							new UploadImage([tempFilePaths[i]], {
								complete: function(res) {
									fileArr.push(res[0].path);
									fileId.push(res[0].id);
									global.fileArr = fileArr;
									global.fileId = fileId;
									console.log(fileArr.length, tempFilePaths.length)
									if (fileArr.length == tempFilePaths.length) {
										uni.hideLoading();
										uni.navigateTo({
											url: `/pages/forum/edit?type=image`
										})
									}
								}
							}, false);
						}

					}
				});
			},
			videoFun(type) {
				let _this = this;
				uni.chooseVideo({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: type, //从相册选择
					success: function(res) {
						_this.hideModal();
						uni.showLoading({
							title: "上传中..."
						});
						var fileArr = "";
						var fileId = "";
						console.log(res)
						if (res.size > 20 * 1024 * 1024) return _this.$message.info('视频最大限制20M');
						const tempFilePaths = res.tempFilePath;
						new UploadImage([tempFilePaths], {
							complete: function(res) {
								global.fileArr = res[0].path;
								global.fileId = res[0].id;
								uni.hideLoading();
								uni.navigateTo({
									url: `/pages/forum/edit?type=video`
								})
							}
						});
					}
				});
			},
			textFun() {
				this.hideModal();
				uni.navigateTo({
					url: "/pages/forum/edit?type=default"
				})
			},
			// 获取论坛分类
			getClassList() {
				let _this = this;
				this.$api.post(global.apiUrls.BBSClassification, {
					id: 0
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.classList = res.data;
					}
				})
			},
			// 获取未读消息列表
			getUnreadMessage() {
				let _this = this;
				const {
					updataMessageNum
				} = this;
				this.$api.post(global.apiUrls.getUnreadMessage, {
					id: 0
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						updataMessageNum(res.data.forum_num);
					}
				})
			},
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					like: "", //搜索内容
					cate_id: "", //分类
				}
			},
			// 删除完
			refreshdata(id) {
				if (this.listData.length > 6) {
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
			// 更新评论数量
			refreshComment(id, type) {
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].aid == id) {
						var item = listData[i];
						if (type) {
							item.comment_size += 1;
						} else {
							item.comment_size -= 1;
						}
					}
				}
				this.listData = listData;
			}
		}
	}
</script>
<style lang="less" scoped>
	.content {
		overflow: hidden;

		.news {
			display: inline-block;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 44rpx;
			margin: 40rpx auto;
			text-align: center;

			image {
				vertical-align: middle;
				width: 40rpx;
				height: 40rpx;
			}
		}

		.tab {
			white-space: nowrap;

			.item {
				display: inline-block;
				padding: 20rpx 90rpx 60rpx;

				&:first-child {
					padding-left: 65rpx;
				}
			}

			image {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
			}
		}
	}
</style>
