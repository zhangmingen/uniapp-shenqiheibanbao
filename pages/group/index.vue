<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl" :isBack="false">
			<block slot="content">添加群组</block>
			<block slot="right">
				<view class="text-right w-100 padding-right text-black">
					<text class="cuIcon-search lg text-40" @tap="handleJump" data-url="/pages/group/search"></text>
				</view>
			</block>
		</cu-custom>
		<!-- 垂直导航 -->
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav solid-right flex-shrink" scroll-y scroll-with-animation :style="'height:calc(100vh - '+CustomBar+'px)'">
				<view class="cu-item solid-bottom" :class="item.id==tabCur?'text-blu text-bold cur':'text-999'" v-for="(item,index) in list"
				 :key="index" @tap="TabSelect(item.id)" :data-id="index">
					{{item.title}}
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain bg-white" scroll-y scroll-with-animation :style="'height:calc(100vh - '+CustomBar+'px)'">
				<view class="padding-top padding-lr" v-if="list1.length>0" v-for="(item,index) in list1" :key="index" @tap="handleJump"
				 :data-url="'/pages/group/verification?id='+item.id+'&title='+item.title">
					<view class="cu-bar solid-bottom bg-white">
						<view class="flex-sub cu-form-group justify-between solid-bottom p-0">
							<view class="text-333">{{item.title}}</view>
							<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
						</view>
					</view>
				</view>
				<cu-none v-if="list1.length<=0" class="cu-none" title="该分类下暂无群组"></cu-none>
			</scroll-view>
		</view>
		<!-- 断网提示 -->
		<fu-notwork></fu-notwork>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				// #ifdef H5
				CustomBar: this.CustomBar + 50,
				// #endif
				list: [], //列表1
				tabCur: 0, //id
				list1: [], //列表2
			};
		},
		onShow() {
			this.getListData(1, 0)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getListData(1, 0)
		},
		methods: {
			TabSelect(id) {
				this.tabCur = id;
				this.getListData(2, this.tabCur)
			},
			// 获取列表数据
			getListData(ind, id) {
				let _this = this;
				this.$api.post(global.apiUrls.cate_group_list, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						if (ind == 1) {
							_this.list = res.data;
							_this.tabCur = _this.list[0].id;
							// 获取列表2
							_this.getListData(2, _this.tabCur);
						} else {
							_this.list1 = res.data
						}
					} else {
						_this.$message.info(res.msg)
					}
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 300)
				})
			},
		},
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="less">
	.cu-none /deep/ image {
		width: 100%;
	}

	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: rgba(237, 237, 237, .5);
		margin: 0;
		border: none;
		height: 150rpx;
		line-height: 150rpx;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #FFFFFF;
		border-bottom: 1px solid #EEEEEE;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 6rpx;
		height: 80rpx;
		position: absolute;
		background-color: currentColor;
		top: 55rpx;
		left: 0;
		bottom: 0;
		color: #00A9FC;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #FFFFFF;
		flex: 1;
	}
</style>
