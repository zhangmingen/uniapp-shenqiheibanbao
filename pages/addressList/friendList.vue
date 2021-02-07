<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="keyword" maxlength="50" :focus="true" @confirm="searchFun" class="flex-sub padding-left-xs text-df" placeholder="声浪号/手机号" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="searchFun" >搜索</text>
				</view>
			</block>
		</cu-custom>

		<view class="content" v-if="listData.length>0">
			<view class="cu-form-group border-0" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+item.id" v-for="(item,index) in listData" :key="item.id">
				<u-image :src="item.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="nav-icon margin-right" border-radius="8rpx" :lazy-load="true"></u-image>
				<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
					<view class="text-lg">{{item.user_nickname}}</view>
				</view>
			</view>
			<view class="text-grey text-center padding-bottom text-xs" v-if="listData.length>5">我们是有底线的～</view>
		</view>
		<cu-none v-else></cu-none>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				keyword: '', //关键词
				listData:[],//搜索数据
			}
		},
		methods: {
			// 点击搜索
			searchFun() {
				if (!this.keyword.trim()) return this.$message.info('搜索内容不能为空')
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.searchUser,{
						search:_this.keyword.trim()
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							_this.listData = res.data;
							if(_this.listData.length<=0){
								_this.$message.info("该用户不存在")
							}
						}
					})
				}, 300)
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
	.search-inp {
		height: 60rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		text{
			font-size: 30rpx;
		}
	}

	.cu-form-group {
		color: #333333;
		height: 120rpx;
	}

	.cu-form-group+.cu-form-group {
		border: none;
	}

	.nav-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 8rpx;
	}
</style>
