<template>
	<view class="group">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="content">
				<text class="text-lg" v-if="isJoin==1">聊天信息<text class="text-df" v-if="groupInfo.group_number">({{groupInfo.group_number}})</text></text>
				<text class="text-lg" v-else>{{groupInfo.group_title}}</text>
			</block>
		</cu-custom>
		<view class="group-head padding-bottom">
			<view class="head-items" v-for="(item,index) in groupInfo.member" v-if="index < 8" :key="index" @tap="handleJump"
			 :data-url="'/pages/friendData/friendData?id='+item.id+'&close=1'">
				<view class="head-img">
					<u-image :src="item.head_img" mode="aspectFill" width="100rpx" height="100rpx" border-radius="6rpx" :lazy-load="true"></u-image>
				</view>
				<view class="head-name text-xs padding-top-xs">
					<text>{{item.user_group.nickname}}</text>
				</view>
			</view>
			<view class="head-items" v-if="isJoin==1">
				<view class="head-img">
					<image src="/static/ye_icon/3599@2x.png" @click.stop="handleJump" :data-url="'/pages/friendData/chooseFriends?type=1&id='+groupID"></image>
				</view>
			</view>
			<view class="head-items" v-if="isJoin==1 && groupInfo.is_owner==1">
				<view class="head-img">
					<image src="/static/ye_icon/minus.png" @click.stop="handleJump" :data-url="'/pages/friendData/chooseFriends?type=2&id='+groupID"></image>
				</view>
			</view>
			<view class="head-items" v-for="(item,index) in [1,2,3,4]">
			</view>

			<!-- <view class="" v-if="groupInfo.length > 9"></view> -->
		</view>
		<view class="group-more padding-top-sm" v-if="isJoin==1 && groupInfo.member && groupInfo.member.length > 2"
		 @click.stop="handleJump" :data-url="'/pages/friendData/groupMember?id='+groupID+'&isJoin='+isJoin+'&is_owner='+groupInfo.is_owner">
			<text>查看全部群成员</text>
			<image src="/static/xs_icon/right(1).png" mode=""></image>
		</view>

		<!-- 群组信息 -->
		<view class="apply">
			<view class="group-box padding-lr">
				<view class="group-row">
					<view class="group-row-tit">
						<text>群聊名称</text>
					</view>
					<view class="group-row-info">
						<text>{{groupInfo.group_title}}</text>
					</view>
				</view>
				<view class="group-row" @click.stop="handleJump" :data-url="`/pages/home/my-qr/my-qr?type=2&url=${groupInfo.qcode}&thumb=${groupInfo.thumb}&title=${groupInfo.group_title}`">
					<view class="group-row-tit">
						<text>群二维码</text>
					</view>
					<view class="group-row-info">
						<image src="../../static/imgs/icon/qr.png" mode="" class="qr-img"></image>
						<image src="/static/ye_icon/4548.png" mode=""></image>
					</view>
				</view>
				<view class="solid-bottom padding-tb" @click.stop="handleJump" :data-url="'/pages/friendData/notice?is_owner='+groupInfo.is_owner+'&id='+groupID+'&text='+encodeURIComponent(JSON.stringify(groupInfo.group_notice))">
					<view class="flex align-center justify-between">
						<view class="group-row-tit">
							<text class="text-lg">群公告</text>
						</view>
						<view class="group-row-info">
							<image src="/static/ye_icon/4548.png" mode="" class="right-icon"></image>
						</view>
					</view>
					<view class="text-666 text-df text-cut3 padding-top-xs">{{groupInfo.group_notice}}</view>
				</view>
			</view>
		</view>


		<view class="">

			<!-- 已经加入的信息 -->
			<view class="" v-if="isJoin==1">

				<view class="apply">
					<view class="group-box padding-lr mt-0">
						<view class="group-row" v-if="groupInfo.is_owner==1">
							<view class="group-row-tit">
								<text>入群校验</text>
							</view>
							<view class="group-row-info">
								<switch :checked="groupInfo.is_verify==1?true:false" @change="switchFun($event,1)" style="transform: scale(0.8,0.7);margin-right: -20rpx;"
								 color="#1CBBB4" />
							</view>
						</view>
						<view class="group-row" @click.stop="handleJump" :data-url="`/pages/friendData/findRecords?type=2&group_id=${groupID}&msg_id=${msg_id}`">
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
							<view class="group-row-info" v-if="groupInfo.user_group">
								<switch :checked="groupInfo.user_group.is_not_disturb==1?true:false" style="transform: scale(0.8,0.7);margin-right: -20rpx;"
								 color="#1CBBB4" @change="notDisturbFun" />
							</view>
						</view>
						<view class="group-row" v-if="groupInfo.is_owner==1">
							<view class="group-row-tit">
								<text>群禁言</text>
							</view>
							<view class="group-row-info">
								<switch :checked="groupInfo.is_banned==1?true:false" @change="switchFun($event,2)" style="transform: scale(0.8,0.7);margin-right: -20rpx;"
								 color="#1CBBB4" />
							</view>
						</view>
						<view class="group-row" v-if="groupInfo.user_group" @click.stop="handleJump" :data-url="'/pages/friendData/changeNickname'+'?id='+groupID+'&nickName='+encodeURIComponent(JSON.stringify(groupInfo.user_group.nickname))">
							<view class="group-row-tit">
								<text>我在群里的昵称</text>
							</view>
							<view class="group-row-info" v-if="groupInfo.user_group">
								<text>{{groupInfo.user_group.nickname}}</text>
								<image src="/static/ye_icon/4548.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>

				<view class="apply">
					<view class="group-box padding-lr">
						<view class="group-row" @click.stop="modalName='complaintModal'">
							<view class="group-row-tit">
								<text>投诉</text>
							</view>
							<view class="group-row-info">
								<image src="/static/ye_icon/4548.png" mode="aspectFill"></image>
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
					</view>
				</view>

				<view class="group-logout" @click="exit(groupID)">
					<text>删除并退出</text>
				</view>

				<!-- 投诉 -->
				<cu-complain :modalName="modalName" @hideModalFun="hideModalFun" type="2" :complain_id="groupInfo.id"></cu-complain>
			</view>

			<!-- 未加入的信息 -->
			<view class="applyGroup" v-else @click.stop="join(groupID)">
				申请入群
			</view>
		</view>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog type="info" title="清除聊天记录" content="一旦清除将无法恢复，确认删除吗" :before-close="true" @confirm="confirm"
			 @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog type="info" title="确认退出群聊" content="由于您是群主，一旦退出将解散该群聊，是否确认退出。" :before-close="true" @confirm="confirmOne"
			 @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup3" type="dialog">
			<uni-popup-dialog type="info" title="确认退出群聊" :before-close="true" @confirm="confirmTwo" @close="close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	// import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				groupID: '', // 群ID
				isJoin: '', // 入群状态
				modalName: "", //投诉模态框
				groupInfo: {}, //群组信息
				msg_id: "", //msg_id

				// 没有使用
				toExamin: false, // 校验
				bannedPost: false, // 禁言
				notDisturb: false, // 消息免打扰
			}
		},
		onLoad(e) {
			this.msg_id = e.msg_id || "";
			this.groupID = e.id;
			this.isJoin = e.is_join || 0;

		},
		onShow() {
			if (this.isJoin == 1) {
				this.getGroupInfo(this.groupID, global.apiUrls.join_group_info);
			} else {
				this.getGroupInfo(this.groupID, global.apiUrls.not_join_group_info);
			}
		},
		// computed:mapState({
		// groupInfo:state => state.chat.groupInfo,
		// roomInfo:state => state.chat.roomInfo,
		// groupSetUp:state => state.chat.groupSetUp
		// }),
		methods: {
			close(done) {
				done()
			},
			confirm(done) {
				var _this = this;
				done()
				_this.$api.post(global.apiUrls.group_flush_msg, {
					msg_id: _this.msg_id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			confirmOne(done) {
				var _this = this;
				done()
				_this.$api.post(global.apiUrls.dissolution_group, {
					id: _this.groupID
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg);
						// 用户离开群聊
						uni.$emit("leaveGroup", _this.groupID);
						setTimeout(function() {
							uni.reLaunch({
								url: "/pages/message/index"
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
				// 不是群主
				_this.$api.post(global.apiUrls.level_group, {
					id: _this.groupID
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.$message.info(res.msg)
						// 用户离开群聊
						uni.$emit("leaveGroup", _this.groupID);
						setTimeout(function() {
							uni.reLaunch({
								url: "/pages/message/index"
							})
						}, 500)
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
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
			hideModalFun() {
				this.modalName = ""
			},
			// 群主操作 1 入群校验  2群禁言
			switchFun(e, ind) {
				var switchVal = e.detail.value;
				let _this = this;
				var data = {
					id: this.groupID
				};
				// 修改switch状态
				if (ind == 1) {
					data.is_verify = switchVal ? 1 : 2
					this.$set(this.groupInfo, 'is_verify', data.is_verify);
				} else {
					data.is_banned = switchVal ? 1 : 2
					this.$set(this.groupInfo, 'is_banned', data.is_banned);
				}
				this.$api.post(global.apiUrls.set_group_notice, data).then(res => {
					var res = res.data;
					if (res.code == 1) {
						// if (ind == 1) {
						// 	_this.groupInfo.is_verify = data.is_verify;
						// } else {
						// 	_this.groupInfo.is_banned = data.is_banned;
						// }
					} else {
						// 更改失败 switch 变回原来的
						setTimeout(() => {
							if (ind == 1) {
								data.is_verify = switchVal ? 2 : 1
								this.$set(this.groupInfo, 'is_verify', data.is_verify);
							} else {
								data.is_banned = switchVal ? 2 : 1
								this.$set(this.groupInfo, 'is_banned', data.is_banned);
							}
						}, 500)
						_this.$message.info(res.msg)
					}
				})
			},
			// 消息免打扰
			notDisturbFun(e) {
				var switchVal = e.detail.value;
				let _this = this;
				// 修改switch状态
				this.$set(this.groupInfo.user_group, 'is_not_disturb', switchVal ? 1 : 2);
				this.$api.post(global.apiUrls.set_group_nickname, {
					id: this.groupID,
					nickname: this.groupInfo.user_group.nickname,
					is_not_disturb: switchVal ? 1 : 2
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						// 更新消息列表
						uni.$emit("updateMessage", {});
					} else {
						// 更改失败 switch 变回原来的
						setTimeout(() => {
							this.$set(this.groupInfo.user_group, 'is_not_disturb', switchVal ? 2 : 1);
						}, 500)
						_this.$message.info(res.msg)
					}
				})
			},
			// 获取群组信息
			getGroupInfo(id, apiUrl) {
				let _this = this;
				this.$api.post(apiUrl, {
					group_id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						_this.groupInfo = res.data;
						console.log(res.data.is_user_group)
						_this.isJoin = res.data.is_user_group;
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			clearChat() {
				this.$refs.popup1.open();
			},
			exit(id) {
				var _this = this;
				var is_owner = _this.groupInfo.is_owner;
				// 是不是群主
				if (is_owner == 1) {
					this.$refs.popup2.open();
				} else {
					this.$refs.popup3.open();
				}


			}
		}
	}
</script>

<style lang="less" scoped>
	@import './groupDetails.less';


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
