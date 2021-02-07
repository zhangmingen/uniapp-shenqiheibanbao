<template>
	<view class="cu-modal bottom-modal" :class="modalName=='complaintModal'?'show':''" @click.stop="hideModal"
	 @touchmove.stop.prevent>
		<view class="cu-dialog bg-eded modalName text-lg" @click.stop="stopFun">
			<view class="text-center text-lg bg-white item solid-bottom positionRe">
				投诉 <text class="cuIcon-close text-gray positionAb" @click.stop="hideModal"></text>
			</view>
			<view class="text-left bg-white text-999 padding-lr padding-top-sm">请选择投诉原因 </view>
			<view class="flex align-center justify-between padding-left padding-tb bg-white text-lg solid-bottom" v-for="(item,index) in showData"
			 :key="index" @click.stop="actInd=index">{{item}}
				<image class="checked" :src="actInd==index?'/static/xs_icon/shoseSel.png':'/static/xs_icon/chose.png'" mode="aspectFill"></image>
			</view>
			<view class="padding-tb-xl bg-white">
				<view class="bg-blu complaintBtn text-center" @click.stop="complaintFun">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var timer = null;
	export default {
		data() {
			return {
				showData: [], //投诉列表
				actInd: 0, //投诉索引
			};
		},
		name: 'cu-complain',
		props: {
			modalName: {
				type: String,
				default: ""
			},
			complain_id: {
				type: String | Number,
				default: 1
			},
			type: {
				type: String,
				default: "1"
			}
		},
		mounted() {
			this.getShowData(this.type);
		},
		methods: {
			hideModal() {
				this.$emit('hideModalFun')
			},
			stopFun() {
				return false;
			},
			// 获取投诉列表
			getShowData(type) {
				let _this = this;
				this.$api.post(global.apiUrls.complain_info, {
					type: type
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.showData = res.data;
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 投诉
			complaintFun() {
				let _this = this;
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					if (_this.actInd >= 0) {
						this.$api.post(global.apiUrls.complain_info_add, {
							type: _this.type,
							complain_info: _this.showData[_this.actInd],
							complain_id: _this.complain_id
						}).then(res => {
							var res = res.data;
							if (res.code == 1) {
								this.$emit('hideModalFun');
								_this.$message.info(res.msg);
							} else {
								_this.$message.info(res.msg)
							}
						})
					} else {
						this.$emit('hideModalFun');
						_this.$message.info("请选择投诉原因");
					}
				}, 300)
			},
		}
	}
</script>

<style lang="less" scoped>
	.complaintBtn {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		margin: 0 auto;
	}

	.positionRe {
		position: relative;

		.positionAb {
			position: absolute;
			right: 40rpx;
			top: 0;
			bottom: 0;
			margin: auto 0;
		}
	}

	.checked {
		width: 40rpx;
		height: 40rpx;
		margin-right: 30rpx;
	}
</style>
