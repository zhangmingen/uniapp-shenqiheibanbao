<template>
	<view class="addFriends">
		<cu-custom bgColor="bg-eded text-xl solid-bottom" :isBack="true">
			<block slot="backText">
				<text class="text-df text-8080">取消</text>
			</block>
			<block slot="content">
				<text class="text-lg">{{title}}</text>
			</block>
			<block slot="right">
				<text class="text-df bg-blu confirm margin-right mt-5" @click="submit">确定({{selectArr.length || 0}})</text>
			</block>
		</cu-custom>
		<!-- 搜索 -->
		<view class="">
			<view class="flex align-center flex-sub bg-white search-inp text-lg text-999 solid-bottom">
				<text class="cuIcon-search lg flex-shrink"></text>
				<input type="text" v-model="like" maxlength="50" class="flex-sub padding-left-xs" @input="getSearchFriends(like)"
				 placeholder="搜索" />
			</view>
		</view>
		<view class="content">
			<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="'height:calc(100vh - '+CustomBar+'px)'"
			 :scroll-with-animation="true" :enable-back-to-top="true">

				<block v-for="(item,index) in list" :key="index">
					<view :class="'indexItem-' + item.key" :id="'indexes-' + item.key" :data-index="item.key">
						<view class="padding-lr-sm padding-tb-xs">{{item.key=='oo'?'#':item.key}}</view>
						<view class="cu-form-group border-0" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+friend.id+'&close=1'"
						 v-for="(friend,index) in item.data" :key="index">
							<image class="checked" :src="selectArr.indexOf(friend.id)!=-1?'/static/xs_icon/shoseSel.png':'/static/xs_icon/chose.png'"
							 mode="" @click.stop="selectFun(friend.id)"></image>
							<u-image :src="friend.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="user-img margin-right"
							 border-radius="8rpx" :lazy-load="true"></u-image>
							<view class="flex-sub cu-form-group p-0 solid-bottom flex flex-direction align-start padding-tb justify-center">
								<view class="text-lg">{{friend.friend_user_nickname || friend.user_nickname}} </view>
								<view class="text-sm text-gray" v-if="friend.friend_user_nickname">昵称：{{friend.user_nickname}} </view>
							</view>
						</view>
					</view>
				</block>
				<view class="padding-xl text-center text-666" v-if="list.length<=0">还没有可管理的成员~</view>
			</scroll-view>
			<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
				<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
					<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="index" @touchstart="getCur" @touchend="setCur">
						{{item.key=='oo'?'#':item.key}}</view>
				</view>
			</view>
			<!--选择显示-->
			<view v-show="!hidden" class="indexToast">
				{{listCur=='oo'?'#':listCur}}
			</view>
		</view>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog type="info" title="确认移除当前所选成员"  :before-close="true" @confirm="confirm"
			 @close="close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				title: "选择好友",
				CustomBar: this.CustomBar + 50,
				//colorUi 组件
				hidden: true,
				listCurID: '', // 所选字母索引
				list: [], //通讯里列表
				listCur: '', //字母列表
				//colorUi end 组件
				selectArr: [], //选择好友数组
				groupId: "", //群组id
				like: "", //搜索关键词
			}
		},
		onLoad(options) {
			// options.type 1选择好友 2删除好友
			this.type = options.type;
			this.groupId = options.id || "";
			this.title = this.type == 1 ? '选择好友' : '删除好友';
			// let list = [{}];
			// for (let i = 0; i < 26; i++) {
			// 	list[i] = {};
			// 	list[i].name = String.fromCharCode(65 + i);
			// }
			// this.list = list;
			// this.listCur = list[0];
			// 获取列表数据
			if (this.type == 1) {
				this.getListData(global.apiUrls.getAddressList, {
					group:this.groupId
				});
			} else {
				this.getListData(global.apiUrls.delete_group_user_list, {
					id: this.groupId
				});
			}
		},
		onReady() {
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		methods: {
			// 搜索好友
			getSearchFriends(like) {
				// if (!like.trim()) return;
				var _this = this
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					let api = "";
					var data = {};
					if (_this.type == 1) {
						api = global.apiUrls.getAddressList;
						data = {
							group: _this.groupId,
							search: like.trim()
						}
					} else {
						api = global.apiUrls.delete_group_user_list;
						data = {
							id: _this.groupId,
							search: like.trim()
						}
					}
					this.$api.post(api, data).then(res => {
						var res = res.data;
						if (res.code == 1) {
							if (_this.type == 1) {
								_this.list = res.data.data;
							} else {
								_this.list = res.data;
							}
							if (_this.list.length <= 0) _this.$message.info('没有搜索到该用户');
						} else {
							_this.$message.info(res.msg)
						}
					})
				}, 500)
			},
			// 选择成员
			selectFun(id) {
				var selectArr = this.selectArr || [];
				var ind = this.selectArr.indexOf(id);
				if (ind == -1) {
					this.selectArr.push(id);
				} else {
					this.selectArr.splice(ind, 1)
				}

			},
			// 添加成员表单提交
			// 删除成员表单提交
			formSubmit: function() {
				var _this = this;
				if (this.isLoading) return;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					uni.showLoading();
					let api = "";
					if (_this.type == 1) {
						api = global.apiUrls.create_user_from_group;
					} else {
						api = global.apiUrls.delete_user_from_group;
					}
					this.$api.post(api, {
						id: _this.groupId,
						user_id: _this.selectArr.join(",")
					}).then(res => {
						setTimeout(() => {
							uni.hideLoading();
						}, 500)
						if (res.data.code == 1) {
							var pages = getCurrentPages();
							var beforePage = pages[pages.length - 2]; //上一个页面
							if (beforePage.$vm.getGroupInfo) beforePage.$vm.getGroupInfo(_this.groupId, global.apiUrls.join_group_info);
							_this.$message.info(res.data.msg);
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 600)
						} else {
							_this.$message.info(res.data.msg);
						}
					})
				}, 300);
			},
			// 获取列表数据
			getListData(apiurl, data) {
				let _this = this;
				this.$api.post(apiurl, data).then(res => {
					var res = res.data;
					if (res.code == 1) {
						if (_this.type == 1) {
							_this.list = res.data.data;
						} else {
							_this.list = res.data;
						}
					} else {
						_this.$message.info(res.msg)
					}
				})
			},
			// 确定
			submit() {
				let type = this.type;
				var _this = this;
				if (this.selectArr.length <= 0) return this.$message.info('请先选择成员');
				if (type == 2) {
					this.$refs.popup1.open();
				} else {

					_this.formSubmit()
				}
			},
			confirm(done) {
				var _this = this;
				done()
				_this.formSubmit()
			},
			close(done) {
				done()
			},
			// 组件自带
			// 获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].key;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].key
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].key;
						that.movableY = i * 20
						return false
					}
				}
			}

		}
	}
</script>
<style scoped>
	.addFriends /deep/ .cuIcon-back {
		display: none;
	}
</style>
<style lang="less" scoped>
	.padding-tb {
		padding: 20rpx 0 !important;
	}

	.checked {
		width: 40rpx;
		height: 40rpx;
		margin-right: 30rpx;
	}

	.confirm {
		display: block;
		padding: 9rpx 19rpx;
		border-radius: 8rpx;
	}

	.search-inp {
		height: 50px;
		line-height: 50px;
		padding: 0 40rpx;
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

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
</style>
