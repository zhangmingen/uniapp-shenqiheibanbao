<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="right">
				<view class="flex align-center w-100">
					<view class="flex align-center flex-sub bg-white search-inp">
						<text class="cuIcon-search lg flex-shrink"></text>
						<input type="text" v-model="keyword" maxlength="50" :focus="true" @confirm="searchFun" class="flex-sub padding-left-xs text-df"
						 placeholder="请输入关键词" />
					</view>
					<text class="text-lg text-blu1 flex-shrink margin-left-sm margin-right" @click="searchFun">搜索</text>
				</view>
			</block>
		</cu-custom>

		<!-- 列表 -->
		<view class="" v-if="listData.length>0">
			<view class="cu-form-group border-0" @click.stop="handleJump" :data-url="'/pages/friendData/groupDetails?id='+item.id+'&is_join=1'" v-for="(item,index) in listData"
			 :key="index">
				<view class="user-img flex flex-wrap bg-dcdc">
					<u-image :src="item.thumb" mode="aspectFill" width="70rpx" height="70rpx" border-radius="8rpx" :lazy-load="true"
					 class="user-img"></u-image>
				</view>
				<view class="flex-sub cu-form-group justify-between p-0 solid-bottom cu-form-group2">
					<view class="text-lg margin-left">{{item.group_title}} </view>
				</view>
			</view>
		</view>
		<cu-none v-else class="cu-none" title="这里还没有内容~"></cu-none>
	</view>
</template>

<script>
	var timer = null;
	export default {
		data() {
			return {
				keyword: '', //关键词
				listData: [], //搜索数据
			}
		},
		methods: {
			// 点击搜索
			searchFun() {
				if (!this.keyword && !this.keyword.trim()) return this.$message.info('搜索内容不能为空')
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.user_be_group, {
						search: _this.keyword
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							this.listData = res.data;
							if (this.listData.length<=0) this.$message.info('没有搜索到任何群组')
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
