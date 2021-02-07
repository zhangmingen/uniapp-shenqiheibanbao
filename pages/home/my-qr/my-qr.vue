<template>
	<view class="my-qr bg-eded">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">{{type==1?"我的二维码":"群二维码"}}</block>
		</cu-custom>
		<view class="myq-main">
			<view class="mqm-head">
				<view class="inm-img">
					<u-image :src="type==1?userInfo.head_img:thumb" mode="aspectFill" width="118rpx" height="118rpx" border-radius="8rpx" :lazy-load="true"></u-image>
				</view>
				<view class="inm-con" v-if="type==1">
					<view class="inmc-text padding-top-xs flex align-center">
						<text class="">{{userInfo.user_nickname}}</text>
						<image v-if="userInfo.sex == 1 && type==1" src="../../../static/imgs/icon/sex1.png" mode=""></image>
						<image v-else-if="userInfo.sex ==2 && type==1" src="../../../static/imgs/icon/sex2.png" mode=""></image>
					</view>
					<view class="inmc-id" >
						{{userInfo.address}}
					</view>
				</view>
				<view class="inm-con1" v-else>
					<text class="text-cut inmc-text">{{title}}</text>
				</view>
			</view>
			<view class="mqm-con" @longpress="showModal" data-target="nameModal">
				<u-image :src="QR_img" mode="aspectFill" width="526rpx" height="526rpx" border-radius="4rpx" :lazy-load="true"></u-image>
			</view>
			<view class="mqm-text">
				{{type==1?"扫描上面的二维码可以添加好友":"扫描上面的二维码可以添加群聊"}}
			</view>
		</view>

		<!-- 保存二维码 -->
		<view class="cu-modal bottom-modal" :class="modalName=='nameModal'?'show':''" @click.stop="hideModal">
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white item" @click="saveImg">
					保存图片
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModal">
					取消
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: "", //显示模态框名字
				QR_img: '',
				userInfo: global.userInfo, //用户信息
				type: 1, //类型
				thumb:"",//群头像
				title:"",//群标题
			}
		},
		onLoad(e) {
			this.type = e.type || 1;
			if (this.type == 1) {
				this.getData();
			} else {
				this.QR_img = e.url;
				this.thumb = e.thumb;
				this.title = e.title;
			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			stopFun() {
				return false;
			},
			// 获取我的二维码
			getData() {
				// myQR
				this.$api.post(global.apiUrls.userQrCode, {
						type: 1, //1默认 2强制刷新
					})
					.then(res => {
						if (res.data.code == 1) {
							this.QR_img = res.data.data.qcode;
						}
					})
					.catch(err => {
						// this.$popup.showToast('保存失败')
					})
			},
			// 保存图片
			saveImg() {
				var _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.QR_img,
					success: function() {
						_this.$message.info("已保存到相册");
						setTimeout(function() {
							_this.modalName = null
						}, 300)
					},
					complete(res) {
						console.log(res)
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "./my-qr.less";
</style>
