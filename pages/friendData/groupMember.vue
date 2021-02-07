<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">群成员<text class="text-df">{{listData && listData.length>0?'('+listData.length+')':""}}</text></text>
			</block>
		</cu-custom>

		<view class="groun-member" v-if="listData">
			<view class="head-items" v-for="(item, index) in listData" :key="index" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.id+'&close=1'">
				<view class="head-img">
					<u-image :src="item.head_img" mode="aspectFill" width="100rpx" height="100rpx" border-radius="6rpx" :lazy-load="true"></u-image>
				</view>
				<view class="head-name text-xs padding-top-xs">
					<text>{{item.user_group.nickname}}</text>
				</view>
			</view>

			<view class="head-items" v-if="isJoin==1">
				<view class="head-img">
					<image src="/static/ye_icon/3599@2x.png" @click.stop="handleJump" :data-url="'/pages/friendData/chooseFriends?type=1&id='+id"></image>
				</view>
			</view>
			<view class="head-items" v-if="isJoin==1 && is_owner==1">
				<view class="head-img">
					<image src="/static/ye_icon/minus.png" @click.stop="handleJump" :data-url="'/pages/friendData/chooseFriends?type=2&id='+id"></image>
				</view>
			</view>

			<view class="head-items" v-for="item in [1, 2, 3, 4]"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",//群组id
				listData:[],//成员列表
				isJoin:0,
				is_owner:0
			}
		},
		onLoad(options) {
			this.isJoin = options.isJoin;
			this.is_owner = options.is_owner;
			this.id = options.id;
			// 获取所有成员
			this.getAllUser()
		},
		methods:{
			getAllUser(){
				let _this = this;
				this.$api.post(global.apiUrls.show_all_user, {
					id: _this.id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.listData = res.data.data;
					} else {
						_this.$message.info(res.msg)
					}
				})
			}
		}
	}
</script>
<style scoped>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="less" scoped>
	.groun-member {
		padding-top: 32upx;
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		text-align: center;

		.head-items {
			margin: 0 20upx;
			width: 100upx;

			image {
				width: 100upx;
				height: 100upx;
				border-radius: 5px;
			}

			.head-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-bottom: 40upx;

				text {
					height: 30upx;
					font-size: 22upx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 30upx;
					color: #666;
				}
			}
		}
	}
</style>
