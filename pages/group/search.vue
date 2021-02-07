<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="like" maxlength="50" @confirm="getListData(like.trim())" class="flex-sub padding-left-xs text-df" placeholder="请输入搜索关键词" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="getListData(like.trim())">搜索</text>
				</view>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<view class="cu-form-group cu-form-group1 solid-bottom" v-for="(item,index) in listData" :key="index" @tap="handleJump" :data-url="'/pages/friendData/groupDetails?id='+item.id+'&is_join='+item.is_join">
				<view class="user-img flex flex-wrap bg-dcdc" >
					<u-image :src="item.thumb" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx" :lazy-load="true"></u-image>
				</view>
				<view class="flex-sub cu-form-group justify-between p-0">
					<view class="margin-left text-333">{{item.group_title}}</view>
					<text class="text-999 text-sm" v-if="item.is_join==1">已加入</text>
					<text class="text-999 text-sm" @click.stop="join(item.id)" v-else>申请入群</text>
				</view>
			</view>
		</view>
		<cu-none v-else class="cu-none" title="这里还没有群组"></cu-none>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				like: "", //关键词
				listData: [],
			}
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
			getListData(like) {
				if (!like) return this.$message.info("请输入搜索关键词");
				uni.showLoading({
					title: "加载中..."
				});
				let _this = this;
				this.$api.post(global.apiUrls.search_not_join_group, {
					cate_id: "",
					like: like
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.listData = res.data;
					} else {
						this.listData = [];
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
		text{
			font-size: 30rpx;
		}
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
