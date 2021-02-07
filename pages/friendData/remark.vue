<template>
	<view class="search">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">设置备注</text>
			</block>
			<block slot="right">
				<text class="text-lg text-blu flex-shrink margin-left-sm margin-right mt-5" @click="submitFun">保存</text>
			</block>
		</cu-custom>

		<view class="content">
			<view class="padding-lr padding-tb-sm">备注名</view>
			<view class="padding bg-white flex align-center justify-between text-lg">
				<input type="text" v-model="nickname" placeholder="单行输入" maxlength="10" class="flex-sub" />
				<text class="cuIcon-roundclosefill lg" v-if="nickname.length>0" @tap="nickname=''"></text>
			</view>
		</view>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				// 输入框内容
				nickname: "",
				id: ""
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.nickname = options.name;
		},
		methods: {
			// 点击搜索
			submitFun() {
				if (!this.nickname || !this.nickname.trim()) return this.$message.info('备注名不能为空')
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.setNickname, {
						id: _this.id,
						nickname: _this.nickname
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							this.$message.info(res.msg)
							var pages = getCurrentPages();
							var beforePage = pages[pages.length - 2]; //上一个页面
							if (beforePage.$vm.userData) beforePage.$vm.userData.friend_user_nickname = this.nickname;
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
<style lang="less" scoped>

</style>
