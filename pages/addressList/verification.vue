<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">入群验证</text>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<view class="" v-for="(item,index) in listData" :key="index">
				<view class="text-gray bg-f7f7 padding-tb-xs text-666 padding-lr-sm">
					{{item.date}}
				</view>
				<view class="cu-form-group solid-bottom" @tap="handleJump" data-url="" v-for="(group,index) in item.arr" :key="index">
					<u-image :src="group.head_img" mode="aspectFill" width="72rpx" height="72rpx" border-radius="8rpx" :lazy-load="true"
					 class="user-img margin-right flex-shrink"></u-image>
					<view class="flex-sub cu-form-group justify-between p-0">
						<view class="text-lg">
							<view class="text-lg text-black text-cut">{{group.user_nickname}}</view>
							<view class="text-gray text-sm text-999 text-cut">申请入群 <text class="padding-left-sm group-name">{{group.group_title}}</text></view>
						</view>
						<view class="flex align-center">
							<view class="flex-shrink padding-tb-xs padding-lr-sm text-999 bg-f2f2 text-sm radius" v-if="group.status==0" @click.stop="refuseJoin(group.id,group.user_id)">拒绝</view>
							<view class="flex-shrink padding-tb-xs padding-lr-sm text-wihte bg-blu text-sm radius margin-left-sm" @click.stop="agreeJoin(group.id,group.user_id)" v-if="group.status==0">同意</view>
							<view class="flex-shrink text-999 text-sm" v-if="group.status==1">已同意</view>
							<view class="flex-shrink text-999 text-sm" v-if="group.status==2">已拒绝</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<cu-none v-else title="没有可验证的群组~"></cu-none>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: [], //搜索数据
			}
		},
		onLoad() {
			this.getApplyFriend();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getApplyFriend();
		},
		methods: {
			// 入群验证列表
			getApplyFriend() {
				let _this = this;
				this.$api.post(global.apiUrls.apple_group_list).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.listData = res.data;
						// 更新消息列表
						uni.$emit("updateMessage", {});
					} else {
						_this.$message.info(res.msg)
					}
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 300)
				})
			},
			// 同意添加好友
			agreeJoin(id,user_id) {
				let _this = this;
				this.$api.post(global.apiUrls.agree_join, {
					id: id,
					user_id:user_id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						this.getApplyFriend();
					} else {
						_this.$message.info(res.msg)
					}
				})
			},

			// 拒绝添加好友
			refuseJoin(id,user_id) {
				let _this = this;
				this.$api.post(global.apiUrls.refuse_join, {
					id: id,
					user_id:user_id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						this.getApplyFriend();
					} else {
						_this.$message.info(res.msg)
					}
				})
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
	.group-name {
		color: #07C39E;
	}

	.cu-form-group+.cu-form-group {
		border: 0;
	}

	.cu-form-group {
		height: 130rpx;
	}

	.mt-5 {
		margin-top: -5rpx;
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

	.icon-qr {
		width: 30rpx;
		height: 30rpx;
	}

	.wechatid {
		margin: 48rpx 0;
	}

	.right-icon {
		width: 14rpx;
		height: 24rpx;
	}

	.nav-icon {
		width: 44rpx;
		height: 44rpx;
	}

	.cu-form-group-right {
		padding: 24rpx 0;
	}

	.user-img {
		width: 72rpx;
		height: 72rpx;
	}
</style>
