<template>
	<view class="group">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg">聊天信息</text>
			</block>
		</cu-custom>
		<view class="group-head singleHead padding-bottom padding-left-xs">
			<view class="head-items">
				<view class="head-img" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+id">
					<u-image :src="userData.head_img" mode="aspectFill" width="100rpx" height="100rpx" class="flex-shrink"
					 border-radius="8rpx" :lazy-load="true"></u-image>
				</view>
			</view>

		</view>

		<!-- 已经加入的信息 -->
		<view class="apply margin-top-sm bg-white overflow">
			<view class="group-box padding-lr mt-0">
				<view class="group-row" @click.stop="handleJump" :data-url="`/pages/friendData/findRecords?type=1&msg_id=${msg_id}`">
					<view class="group-row-tit">
						<text>查找聊天记录</text>
					</view>
					<view class="group-row-info">
						<image src="/static/ye_icon/4548.png" mode=""></image>
					</view>
				</view>
				<view class="group-row">
					<view class="group-row-tit">
						<text>消息免打扰</text>
					</view>
					<view class="group-row-info">
						<switch :checked="userData.is_not_disturb==1?true:false" @change="notDisturbFun" style="transform: scale(0.8,0.7)"
						 color="#1CBBB4" />
					</view>
				</view>
				<view class="group-row" @click.stop="clearChat">
					<view class="group-row-tit">
						<text>清空聊天记录</text>
					</view>
					<view class="group-row-info">
						<image src="/static/ye_icon/4548.png" mode=""></image>
					</view>
				</view>
				<view class="group-row" @click.stop="modalName='complaintModal'">
					<view class="group-row-tit">
						<text>投诉</text>
					</view>
					<view class="group-row-info">
						<image src="/static/ye_icon/4548.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!-- 未加入的信息 -->
			<view class="applyGroup" @click="deleteFriend(id)">
				删除好友
			</view>
		</view>


		<!-- 投诉 -->
		<cu-complain :modalName="modalName" @hideModalFun="hideModalFun" :complain_id="id"></cu-complain>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog type="info" title="确定删除该好友吗？" :before-close="true" @confirm="confirm" @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog type="info" title="清除聊天记录" content="一旦清除将无法恢复，确认删除吗？" :before-close="true" @confirm="confirmTwo"
			 @close="close"></uni-popup-dialog>
		</uni-popup>

	</view>
</template>

<script>
	// import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				userData: "", //用户信息
				toExamin: false, // 加入群审核
				modalName: "", //投诉模态框
				id: "", //用户id
				msg_id: "", //聊天室id
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.msg_id = options.msg_id;
			this.getUserInfo(options.id);
		},
		methods: {
			close(done) {
				done()
			},
			confirm(done) {
				var _this = this;
				done()
				_this.$api.post(global.apiUrls.delete_friend, {
					to_id: this.id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						_this.hideModalFun();
						setTimeout(function() {
							uni.navigateBack({
								delta: 2
							})
						}, 500)
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			confirmTwo(done) {
				var _this = this;
				done()
				_this.$api.post(global.apiUrls.chat_flush_msg, {
					msg_id: _this.msg_id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			hideModalFun() {
				this.modalName = ""
			},
			getUserInfo(id) {
				let _this = this;
				this.$api.post(global.apiUrls.chatUserinfo, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.userData = res.data;
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 消息免打扰
			notDisturbFun(e) {
				var switchVal = e.detail.value;
				let _this = this;
				// 修改switch状态
				this.$set(this.userData, 'is_not_disturb', switchVal ? 1 : 2);
				this.$api.post(global.apiUrls.set_is_not_disturb, {
					id: this.userData.id || this.id,
					is_not_disturb: switchVal ? 1 : 2
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {

					} else {
						// 更改失败 switch 变回原来的
						setTimeout(() => {
							this.$set(this.userData, 'is_not_disturb', switchVal ? 2 : 1);
						}, 500)
						_this.$message.info(res.msg)
					}
				})
			},
			// 删除好友
			deleteFriend(id) {
				let _this = this;
				this.$refs.popup1.open();
			},
			clearChat() {
				var _this = this;
				this.$refs.popup2.open();
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
	@import './groupDetails.less';

	.checked {
		width: 40rpx;
		height: 40rpx;
		margin-right: 30rpx;
	}

	.singleHead {
		justify-content: start !important;
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

	.complaintBtn {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		margin: 0 auto;
	}

	.group-row .qr-img {
		width: 32rpx !important;
		height: 32rpx !important;
	}

	.apply .group-row {
		border-bottom: 1px solid #EEEEEE;
	}

	.applyGroup {
		width: 686rpx;
		padding: 22rpx;
		text-align: center;
		background-color: #0093FF;
		color: #FFFFFF;
		border-radius: 44rpx;
		margin: 300rpx auto 48rpx;
	}
</style>
