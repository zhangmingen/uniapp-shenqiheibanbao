<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">{{title}}</text>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<view class="cu-form-group cu-form-group1 solid-bottom" v-for="(item,index) in listData" :key="index" @click.stop="handleJump"
			 :data-url="'/pages/friendData/groupDetails?id='+item.id+'&is_join='+item.is_join">
				<view class="">
					<u-image :src="item.thumb" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx" :lazy-load="true"></u-image>
				</view>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="margin-left text-333">{{item.group_title}}</view>
					<text class="text-999 text-sm" v-if="item.is_join==1" @click.stop>已加入</text>
					<text class="text-999 text-sm" @click.stop="join(item.id)" v-else>申请入群</text>
				</view>
			</view>
		</view>
		<cu-none v-else class="cu-none" title="该分类下暂无群组"></cu-none>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "", //群聊分类id
				listData: [], //群组数据
				title: "", //标题

			}
		},
		onLoad(options) {
			this.id = options.id;
			this.title = options.title;
		},
		onShow() {
			this.getListData(this.id);
		},
		methods: {
			join(id) {
				let _this = this;
				this.$api.post(global.apiUrls.join_group, {
					group_id: id
				}).then(res => {
					var res = res.data;
					_this.$popup.showModal("申请入群", res.msg, "取消", "确认", false)
						.then((res) => {
							if (res) {

							}
						})
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
				})

			},
			// 获取列表数据
			getListData(id) {
				uni.showLoading({
					title: "加载中..."
				});
				let _this = this;
				this.$api.post(global.apiUrls.search_not_join_group, {
					cate_id: id,
					like: ""
				}).then(res => {
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
		width: 70rpx;
		height: 70rpx;
	}

	.cu-form-group1 {
		height: 134rpx;
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
</style>
