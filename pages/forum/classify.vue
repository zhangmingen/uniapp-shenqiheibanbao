<template>
	<view class="classify">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">
				{{title}}
			</block>
		</cu-custom>
		<view class="classify-head fixed-top">
			<!-- 导航 -->
			<view class="class_nav solid-bottom" v-if="classList.length>0">
				<scroll-view :scroll-into-view="scrollId" scroll-with-animation="true" class="bg-white nav text-df" scroll-x="true">
					<view class="cu-item" :class="index==TabCur?'text-blu1 nav_act text-bold':''" v-for="(item,index) in classList"
					 :key="index" @tap="tabSelect($event,item.id)" :id="'scroll'+index" :data-id="index" data-type="type1">
						<view class="text-xl"><text class="text-df">{{item.title}}</text> <text class="lg cuIcon-triangledownfill text-bold"
							 v-if="item.child.length>0"></text></view>
					</view>
				</scroll-view>
			</view>
			<!-- 展开分类 -->
			<view v-if="classList.length>0">
				<view class="text-df bg-white" v-if="classList[TabCur].child && classList[TabCur].child.length>0 && unfoldStatus">
					<view class="unfold_nav flex justify-between padding text-xl" :class="cate_id==classList[TabCur].id?'text-blu1':''"
					 @tap="tabSelect($event,classList[TabCur].id)" data-type="type2" :data-id="classList[TabCur].id">
						<view class="text-df">全部</view>
						<text class="cuIcon-check lg text-bold" v-if="cate_id==classList[TabCur].id"></text>
					</view>
					<view class="unfold_nav flex justify-between padding text-xl" :class="cate_id==item.id?'text-blu1':''" v-for="(item,index) in classList[TabCur].child"
					 :key="index" @tap="tabSelect($event,item.id)" data-type="type2" :data-id="item.id">
						<view class="text-df"> {{item.title}} </view>
						<text class="cuIcon-check lg text-bold" v-if="cate_id==item.id"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="pt-100">
			<view class="" v-if="listData.length>0">
				<cu-card :showData="item" v-for="(item,index) in listData" :key="index" @refreshdata="refreshdata"></cu-card>
				<view class="text-grey text-center padding-top padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
			</view>
			<cu-none v-else></cu-none>
		</view>
		<!-- 遮罩层 -->
		<view class="mask" v-if="unfoldStatus" @tap="unfoldStatus=false" @touchmove.stop.prevent></view>
	</view>
</template>

<script>
	let timer = null;
	import pagingList from '@/common/minix/paging_list.js';
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				classList: [],
				TabCur: 0,
				// nav锚链接id
				scrollId: '',
				// 展开按钮
				unfoldStatus: false,
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.BBSList,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 额外参数分类id type
				like: "", //搜索内容
				cate_id: "", //分类
				title: "", //标题
			}
		},
		onLoad(options) {
			// 获取论坛分类
			this.getClassList(options.id);
			// 初始化第一次请求id
			this.cate_id = options.id;
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListToggle();

		},
		methods: {
			// 切换分类
			tabSelect(e,id) {
				
				let type = e.currentTarget.dataset.type;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					if (type == 'type1') {
						// 当前所点击分类
						this.TabCur = e.currentTarget.dataset.id;
						this.$nextTick(function() {
							this.scrollId = "";
						})
						// 子分类
						var childrenArr = this.classList[this.TabCur].child;
						if (childrenArr && childrenArr.length > 0) {
							if (this.unfoldStatus && this.classList[this.TabCur].id == this.cate_id) {
								this.unfoldStatus = false;
							} else {

								this.unfoldStatus = true;
							}
						} else {
							// 分类id
							this.cate_id = this.classList[this.TabCur].id;
							this.unfoldStatus = false;
							this.pagingListToggle();
						}
						// this.pagingListToggle();
					} else {
						if(id == this.cate_id) return;
						// 子分类id赋值
						this.cate_id = e.currentTarget.dataset.id;
						this.unfoldStatus = false;
						this.pagingListToggle();
					}
				}, 300);
			},
			// 获取论坛分类
			getClassList(id) {
				let _this = this;
				this.$api.post(global.apiUrls.BBSClassification, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						var data = res.data;
						var classList = data.find(function(a, b) {
							return a.id == id;
						});
						_this.title = classList.title;
						_this.classList = classList.child;
						_this.classList.unshift({
							cat_img: 0,
							child: [],
							id: id,
							title: "全部"
						})
						console.log(_this.classList)
					}
				})
			},
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					like: "", //搜索内容
					cate_id: this.cate_id, //分类
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
	.classify {
		// padding-top: 100rpx;
	}

	.pt-100 {
		background-color: #FFFFFF;
	}
</style>
