<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">
				群聊
			</block>
		</cu-custom>

		<view class="content">
			<view class="bg-eded overflow">
				<view class="flex align-center justify-center padding-bottom-sm padding-top-sm" @tap="handleJump" data-url="/pages/addressList/groupSearch">
					<view class="padding-left-xs text-df addinput bg-white text-center"><text class="cuIcon-search lg margin-right-xs"></text>请输入关键词</view>
				</view>
			</view>
			<view class="cu-form-group cu-form-group1 solid-bottom" @tap="handleJump" data-url="/pages/addressList/verification">
				<view class="user-img flex flex-wrap bg-dcdc relative">
					<image src="../../static/imgs/icon/qunliao.png" mode="aspectFill" class="user-img"></image>
					<view class="cu-tag badge" style="right: -18rpx;background-color: ee1d1d!important;" v-if="groupNum>0">{{groupNum>99?"99+":groupNum}}</view>
				</view>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="text-lg margin-left">入群验证</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon"></image>
				</view>
			</view>
			<!-- 列表 -->
			<view class="" v-if="listData.length>0">
				<view class="cu-form-group border-0" @click.stop="handleJump" :data-url="`/pages/chat/chat?id=${item.msg_id}&type=2&title=${item.group_title}&group_id=${item.id}`"
				 v-for="(item,index) in listData" :key="index">
					<view class="user-img flex flex-wrap bg-dcdc">
						<u-image :src="item.thumb" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx" :lazy-load="true"
						 class="user-img"></u-image>
					</view>
					<view class="flex-sub cu-form-group justify-between p-0 solid-bottom cu-form-group2">
						<view class="text-lg margin-left">{{item.group_title}} </view>
					</view>
				</view>
			</view>
			<cu-none v-else class="cu-none" title="你还没有添加任何群组,赶快去添加吧~"></cu-none>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				listData: [], //用户所在群聊
			}
		},
		onLoad() {
			this.getListData();
		},
		computed: mapState({
			groupNum: state => state.message.groupNum, //groupNum入群申请
		}),
		methods: {
			// 获取列表数据
			getListData(id) {
				uni.showLoading({
					title: "加载中..."
				});
				let _this = this;
				this.$api.post(global.apiUrls.user_be_group).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.listData = res.data;
					} else {
						_this.$message.info(res.msg)
					}
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
				})
			},
		}

	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="less" scoped>
	.cu-form-group+.cu-form-group {
		border: 0;
	}

	.nav-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 8rpx;
	}

	.cu-form-group1 {
		height: 140rpx;
	}

	.cu-form-group2 {
		height: 130rpx;
	}

	.user-img-sm {
		width: 20rpx;
		height: 20rpx;
		margin-left: 4rpx;
		margin-top: 4rpx;
	}

	.user-img-sm:nth-child(3n+1) {
		margin-left: 0;
	}

	.user-img-sm:nth-child(1),
	.user-img-sm:nth-child(2),
	.user-img-sm:nth-child(3) {
		margin-top: 0;
	}

	.user-img {
		width: 70rpx;
		height: 70rpx;
	}

	.addinput {
		width: 700rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 8rpx;
	}

	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
	}
</style>
