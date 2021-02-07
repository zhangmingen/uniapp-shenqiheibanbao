<template>
	<view class="">
		<cu-custom bgColor="bg-eded text-xl" :isBack="false">
			<block slot="content">通讯录</block>
			<block slot="right">
				<view class="text-right w-100 padding-right text-black">
					<text class="cuIcon-search lg margin-right-sm text-40" @tap="handleJump" data-url="/pages/addressList/search"></text>
					<text class="cuIcon-roundadd lg text-40" @tap="handleJump" data-url="/pages/addressList/addFriend"></text>
				</view>
			</block>
		</cu-custom>
		<view class="">
			<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="'height:calc(100vh - '+CustomBar+'px)'"
			 :scroll-with-animation="true" :enable-back-to-top="true">
				<!-- 头部导航 -->
				<view class="">
					<view class="cu-form-group border-0" @tap="handleJump" data-url="/pages/addressList/newFriends">
						<view class="relative">
							<image src="../../static/imgs/icon/xinpengyou.png" mode="aspectFill" class="nav-icon margin-right"></image>
							<view class="cu-tag badge" style="right: 14rpx;background-color: ee1d1d!important;" v-if="friend_user_num>0">{{friend_user_num>99?"99+":friend_user_num}}</view>
						</view>
						<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
							<view class="text-lg">新的朋友 </view>
						</view>
					</view>
					<view class="cu-form-group border-0" @tap="handleJump" data-url="/pages/addressList/groupChat">
						<view class="relative">
							<image src="../../static/imgs/icon/qunliao.png" mode="aspectFill" class="nav-icon margin-right"></image>
							<view class="cu-tag badge" style="right: 14rpx;" v-if="groupNum>0">{{groupNum>99?"99+":groupNum}}</view>
						</view>
						<view class="flex-sub cu-form-group justify-between p-0 solid-bottom">
							<view class="text-lg">群聊 </view>
						</view>
					</view>
					<view class="cu-form-group border-0" @tap="handleJump" data-url="/pages/chat/service">
						<image src="../../static/imgs/icon/kefu.png" mode="aspectFill" class="nav-icon margin-right"></image>
						<view class="flex-sub cu-form-group justify-between p-0">
							<view class="text-lg">客服 </view>
						</view>
					</view>
				</view>
				<block v-for="(item,index) in list" :key="index">
					<view :class="'indexItem-' + item.key" :id="'indexes-' + item.key" :data-index="item.key">
						<view class="padding-lr-sm padding-tb-xs">{{item.key=='oo'?'#':item.key}}</view>
						<view class="cu-form-group border-0" @tap="handleJump" :data-url="'/pages/friendData/friendData?id='+friend.id"
						 v-for="(friend,index) in item.data" :key="index">
							<u-image :src="friend.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="user-img margin-right"
							 border-radius="8rpx" :lazy-load="true"></u-image>
							<view class="flex-sub cu-form-group justify-between p-0" :class="item.data.length>1?'solid-bottom':''">
								<view class="text-lg">{{friend.friend_user_nickname || friend.user_nickname}} </view>
							</view>
						</view>
					</view>
				</block>
				<view class="padding-xl text-center text-666" v-if="list.length<=0">你还没有好友赶快去添加吧~</view>
			</scroll-view>
			<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px - 50px)'}]">
				<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
					<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="index+''" @touchstart="getCur"
					 @touchend="setCur">
						{{item.key=='oo'?'#':item.key}}</view>
				</view>
			</view>
			<!--选择显示-->
			<view v-show="!hidden" class="indexToast">
				{{listCur=='oo'?'#':listCur}}
			</view>
		</view>
		<!-- 断网提示 -->
		<fu-notwork></fu-notwork>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				// #ifdef H5
				CustomBar: this.CustomBar + 50,
				// #endif
				//colorUi 组件
				hidden: true,
				listCurID: '',
				list: [],
				listCur: '',
				//colorUi end 组件
			};
		},
		computed: mapState({
			friend_user_num: state => state.message.friend_user_num, //friend_user_num新好友数量
			groupNum: state => state.message.groupNum, //groupNum入群申请
		}),
		onShow() {
			// 获取列表数据
			this.getListData();
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
			/**
			 * updataAddFriend  添加好友推送数量
			 * */
			...mapMutations(["updataAddFriend"]),
			// 获取列表数据
			getListData() {
				let _this = this;
				const {
					updataAddFriend
				} = this;
				this.$api.post(global.apiUrls.getAddressList).then(res => {
					var res = res.data;
					if (res.code == 1) {
						updataAddFriend(res.data.friend_user_num);
						_this.list = res.data.data;
					} else {
						_this.$message.info(res.msg)
					}
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 300)
				})
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
					this.listCur = that.list[num].key + ""
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
				console.log(this.listCurID)
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

<style scoped lang="less">
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
