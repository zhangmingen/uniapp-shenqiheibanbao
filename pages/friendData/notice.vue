<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">群公告</text>
			</block>
			<block slot="right" v-if="is_owner==1">
				<text class="text-lg text-blu flex-shrink margin-left-sm margin-right mt-5" @click="submitFun">保存</text>
			</block>
		</cu-custom>

		<view class="padding flex flex-direction justify-between h-100" :style="'height:calc(100vh - '+CustomBar+'px)'">
			<textarea maxlength="200" placeholder="请输入公告内容" v-model="text" class="flex-sub overflow-y-auto w-100" v-if="is_owner==1"></textarea>
			<view class="flex-sub overflow-y-auto" v-else>
				{{text}}
			</view>
			<view class="text-sm text-999 text-center padding-bottom-xl text-bottom flex align-center justify-center padding-top-sm">
				<view class="solid-top"></view><text class="padding-lr">群公告仅管理员可编辑</text>
				<view class="solid-top"></view>
			</view>
		</view>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				is_owner: "", //是否是群主
				text: "", //公告内容
				id:"",//群组id
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.is_owner = options.is_owner;
			this.text = JSON.parse(decodeURIComponent(options.text));
		},
		methods: {
			submitFun() {
				if (!this.text || !this.text.trim()) return this.$message.info('公告内容不能为空');
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.set_group_notice, {
						id: _this.id,
						group_notice: _this.text
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							_this.$message.info(res.msg)
							var pages = getCurrentPages();
							var beforePage = pages[pages.length - 2]; //上一个页面
							if (beforePage.$vm.groupInfo) beforePage.$vm.groupInfo.group_notice = _this.text;
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 500)
						}
					})
				}, 300)
			}
		}
	}
</script>

<style scoped>
	.h-100 {
		height: 100vh;
		background-color: #FFFFFF;
	}

	.text-bottom .solid-top {
		width: 128rpx;
	}
</style>
