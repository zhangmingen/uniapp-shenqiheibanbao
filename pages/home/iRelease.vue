<template>
	<view class="release" v-if="iReleaseUserInfo">
		<view class="header" :style="'background-image: url('+(iReleaseUserInfo.background?iReleaseUserInfo.background : '../../static/imgs/bg.jpg')+');background-color:#f1f1f1;'"
		 @click.stop="showModal" data-target='headModal'>
			<cu-custom bgColor="text-xl" :isBack="true" class="text-white">
				<block slot="content"></block>
			</cu-custom>
			<view class="flex flex-end user-info padding-right-lg" @click.stop>
				<view class="text-cut text-xl padding-right text-white text-right">{{iReleaseUserInfo.user_nickname}}</view>
				<image :src="iReleaseUserInfo.head_img" mode="aspectFill" class="user-img"></image>
			</view>
		</view>
		<view class="content" v-if="listData.length>0">
			<cu-card :showData="item" v-for="(item,index) in listData" :key="index" @refreshdata="refreshdata"></cu-card>
			<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
		</view>
		<cu-none v-else></cu-none>
		<!-- 背景图 -->
		<view class="cu-modal bottom-modal" :class="modalName=='headModal'?'show':''" @click.stop="hideModal">
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white item solid-bottom" @click="carera('camera')">
					拍照
				</view>
				<view class="text-center text-lg bg-white item" @click="carera('album')">
					相册选择
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModal">
					取消
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pagingList from '@/common/minix/paging_list.js';
	import {
		UploadImage
	} from '@/common/utils/index';
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				modalName: "",
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.userPostInformation,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 额外参数分类id type
				id: "", //用户id，
				iRelease: true, //需要mixins存主页用户信息
				iReleaseUserInfo: "", //主页用户信息
				userInfo: global.userInfo,
				bgUrl: "", //背景图地址
				bgId: "", //背景图id
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
			} else {
				this.id = global.userInfo.id;
			}
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListGetLists();
		},

		methods: {
			// 修改背景图
			uploadImg(res) {
				uni.showLoading()
				let _this = this;
				new UploadImage(res.tempFilePaths, {
					complete: function(res) {
						if (res.length) {
							_this.bgId = res[0].id;
							_this.iReleaseUserInfo.background = res[0].path;
							_this.$api.post(global.apiUrls.editBgPost, {
								back_image: _this.bgId
							}).then(res => {
								var res = res.data;
								if (res.code == 1) {
									uni.hideLoading();
								}else{
									_this.$message.info(res.msg)
								}
							})
						}
					}
				});
			},
			showModal(e) {
				if (this.userInfo.id != this.id) return;
				this.modalName = e.currentTarget.dataset.target
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
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], //从相册选择
					success: function(res) {
						_this.hideModal();
						_this.uploadImg(res);
					}
				});
			},
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					id: this.id
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
			// 更新评论数量
			refreshComment(id,type){
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].aid == id) {
						var item = listData[i];
						if (type) {
							item.comment_size+=1;
						} else {
							item.comment_size-=1;
						}
					}
				}
				this.listData = listData;
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="less">
	.header /deep/ .solid-bottom::after{
		border: 0;
	}
	.header {
		position: relative;
		width: 100%;
		height: 586rpx;
		background-size: cover;
		background-repeat: no-repeat;
		margin-bottom: 60rpx;

		.user-info {
			position: absolute;
			right: 0;
			bottom: 0;
			margin-bottom: -48rpx;
		}

		.text-cut {
			width: 360rpx;
		}

		.user-img {
			width: 128rpx;
			height: 128rpx;
			border-radius: 8rpx;
		}
	}
</style>
