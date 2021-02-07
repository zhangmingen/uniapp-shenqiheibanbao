<template>
	<view class="personal">
		<cu-custom bgColor="bg-eded text-xl" :isBack="true">
			<block slot="content">个人信息</block>
		</cu-custom>
		<view class="padding-lr bg-white text-333">
			<view class="cu-form-group p-lr-0 padding-tb text-lg" @tap="showModal" data-target="headModal">
				<view class="flex-shrink">头像</view>
				<view class="align-center flex flex-sub justify-end">
					<u-image :src="userInfo.head_img" mode="aspectFill" width="118rpx" height="118rpx" class="user-img flex-shrink" border-radius="8rpx" :lazy-load="true"></u-image>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg" @tap="showModal" data-target="nameModal">
				<view class="flex-shrink">昵称</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">{{userInfo.user_nickname}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg">
				<view class="flex-shrink">我的ID</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">{{userInfo.invite_code}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left visibility"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg" @tap="showModal" data-target="sexModal">
				<view class="flex-shrink">性别</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">{{userInfo.sex==1?'男':userInfo.sex==2?'女':'未填写'}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg">
				<view class="flex-shrink">地区</view>
				<view class="align-center flex flex-sub justify-end" @tap="toggleTab()">
					<view class="text-cut text-666">{{userInfo.address || "未填写"}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view>
			<view class="cu-form-group p-0 text-lg" @tap="showModal" data-target="personalizedModal">
				<view class="flex-shrink">个性签名</view>
				<view class="align-center flex flex-sub justify-end">
					<view class="text-cut text-666">{{userInfo.signature || "未填写"}}</view>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left flex-shrink"></image>
				</view>
			</view>
		</view>
		<view class="padding-lr bg-white text-333" @click.stop="handleJump" data-url="/pages/home/my-qr/my-qr">
			<view class="cu-form-group p-0 text-lg margin-top">
				<view>二维码名片</view>
				<view class="align-center flex">
					<image src="../../static/imgs/icon/qr.png" class="qrcode flex-shrink" mode="aspectFill"></image>
					<image src="../../static/imgs/icon/right.png" mode="aspectFill" class="right-icon margin-left"></image>
				</view>
			</view>
		</view>
		<view class="submit text-white bg-theme text-center" @click="formSubmit">
			保存
		</view>
		<!-- 姓名 -->
		<view class="cu-modal bottom-modal" :class="modalName=='nameModal'?'show':''" @click.stop="hideModal" @touchmove.stop.prevent>
			<view class="cu-dialog padding-lr bg-white" @click.stop="stopFun">
				<view class="close">
					<view class="text-center text-lg">修改姓名</view>
					<view class="cuIcon-close" @click.stop="hideModal"></view>
				</view>
				<textarea maxlength="10" placeholder="多行文本输入框" v-model="user_nickname" class="textarea-box text-left padding"></textarea>
				<view class="text-center text-lg padding-tb" @click.top="usernameFun">
					确定
				</view>
			</view>
		</view>
		<!-- 性别 -->
		<view class="cu-modal bottom-modal" :class="modalName=='sexModal'?'show':''" @click.stop="hideModal" @touchmove.stop.prevent>
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white item solid-bottom" @click="sexFun(1)">
					男
				</view>
				<view class="text-center text-lg bg-white item" @click="sexFun(2)">
					女
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModal">
					取消
				</view>
			</view>
		</view>
		<!-- 头像 -->
		<view class="cu-modal bottom-modal" :class="modalName=='headModal'?'show':''" @click.stop="hideModal" @touchmove.stop.prevent>
			<view class="cu-dialog bg-eded modalName" @click.stop="stopFun">
				<view class="text-center text-lg bg-white item solid-bottom" @click="carera('camera')">
					拍照
				</view>
				<view class="text-center text-lg bg-white item" @click="carera('album')">
					相册选择
				</view>
				<view class="text-center text-lg margin-top-sm bg-white item" @click.stop="hideModal">
					取消
				</view>
			</view>
		</view>
		<!-- 个性签名 -->
		<view class="cu-modal bottom-modal" :class="modalName=='personalizedModal'?'show':''" @click.stop="hideModal" @touchmove.stop.prevent>
			<view class="cu-dialog padding-lr bg-white" @click.stop="stopFun">
				<view class="close">
					<view class="text-center text-lg">个性签名</view>
					<view class="cuIcon-close" @click.stop="hideModal"></view>
				</view>
				<textarea maxlength="200"  placeholder="请输入个性签名" v-model="signature" class="textarea-box text-left padding"></textarea>
				<view class="text-center text-lg padding-tb" @click.top="signatureFun">
					确定
				</view>
			</view>
		</view>
		<!-- 地区选择组件 -->
		<w-picker mode="region" :defaultVal="defaultVal" @confirm="onConfirm" ref="region" themeColor="#007aff"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		UploadImage
	} from '@/common/utils/index';
	let timer = null;
	export default {
		data() {
			return {
				isLoading: false,
				modalName: "", //显示模态框名字
				userInfo: JSON.parse(JSON.stringify(global.userInfo)),
				defaultVal: [1], // 城市编码
				cityArr: [], // 对应的省市区
				address: "", //地区文本
				head_img: "", //用户头像
				head_img_id: "", //用户头像id

				user_nickname: "", //编辑框修改姓名
				signature: "", //编辑框个性签名
			}
		},
		onShow() {
			
		},
		onLoad() {
			// 监听上传头像
			uni.$on('uAvatarCropper', path => {
				this.uploadUserImg(path);
			})
			// 初始化可修改文本
			this.userInfo = JSON.parse(JSON.stringify(global.userInfo));
			this.user_nickname = this.userInfo.user_nickname;
			this.signature = this.userInfo.signature;
		},
		onUnload() {
			uni.$off("uAvatarCropper");
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
			carera(type) {
				let _this = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], //从相册选择
					success: function(res) {
						_this.hideModal();
						// 抽离出uview-ui中的头像裁剪插件来使用
						uni.navigateTo({
							url: '/fu-templete/pages/mine-template/u-avatar-cropper/u-avatar-cropper?destWidth=150&rectWidth=250&fileType="jpg"&myImgUrl=' +
								res.tempFilePaths[0],
							animationDuration: 0
						})
					}
				});
			},
			// 所在地选择
			onConfirm(result) {
				let {
					province,
					city,
					area
				} = result.obj;
				let text = [province.label, city.label, area.label];
				let code = [province.value, city.value, area.value];
				console.log(text, code)
				this.address = text.join('-');
				this.cityArr = text;
				this.defaultVal = code;
				this.userInfo.address = this.address;
			},
			toggleTab() {
				this.$refs['region'].show();
			},
			// 上传用户头像
			uploadUserImg(blob) {
				uni.showLoading()
				let _this = this;
				// 开始上传
				new UploadImage([blob], {
					complete: function(res) {
						uni.hideLoading();
						if (res.length) {
							_this.userInfo.head_img = res[0].path;
							_this.userInfo.head_img_id = res[0].id;
						}
					}
				});
			},
			// 表单提交
			formSubmit: function(e) {
				if (this.isLoading) return;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					var obj = {};
					var userInfo = JSON.parse(JSON.stringify(this.userInfo));
					obj.address = userInfo.address || "";
					obj.user_nickname = userInfo.user_nickname || "";
					obj.signature = userInfo.signature || "";
					obj.sex = userInfo.sex || 0;
					obj.birthday = 2021;
					if (userInfo.head_img_id) {
						obj.head_img = userInfo.head_img_id || 0;
					}
					// 进行表单验证操作
					let validateRes = this.doValidate(obj);
					if (validateRes) {
						this.$message.info(validateRes);
						return;
					}

					// 保存注册信息
					this.isLoading = true;
					uni.showLoading();
					this.$api.post(global.apiUrls.editUserinfo, obj).then(res => {
						setTimeout(() => {
							this.isLoading = false;
							uni.hideLoading();
							if (res.data.code == 1) {
								// 更新本地缓存
								uni.setStorageSync('USER_INFO', res.data.data.userinfo);
								// 更新global
								global.userInfo = res.data.data.userinfo;
								this.$message.info('保存成功');
								setTimeout(function(){
									uni.navigateBack({
										delta:1
									})
								},500)
							} else {
								this.$message.info(res.data.msg);
							}
						}, 500)
					})
				}, 300);
			},
			// 进行表单字段值校验
			doValidate(userInfo) {
				// 昵称
				if (!userInfo.user_nickname.trim()) {
					return '请输入您的用户昵称';
				}

				if (userInfo.user_nickname.trim().length > 10) {
					return '请检查您的昵称(最多10个字符)'
				}

				// 性别
				if (userInfo.sex == 0) {
					return '请选择您的性别'
				}

				// 省份
				if (!userInfo.address) {
					return '请选择省份';
				}

				return '';
			},
			// 修改性别
			sexFun(sex) {
				this.userInfo.sex = sex;
				this.hideModal();
			},
			// 修改username
			usernameFun() {
				this.userInfo.user_nickname = this.user_nickname.replace(/\n/g," ");
				this.hideModal();
			},
			// 修改signature
			signatureFun() {
				this.userInfo.signature = this.signature;
				this.hideModal();
			},
		}
	}
</script>

<style lang="less" scoped>
	.cu-dialog {
		border-radius: 24rpx 24rpx 0px 0px !important;
	}

	.close {
		height: 120rpx;
		line-height: 120rpx;
		position: relative;

		.cuIcon-close {
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto 0;
			font-size: 40rpx;
		}
	}

	.textarea-box {
		margin: 0 auto;
		width: 686rpx;
		min-height: 300rpx;
		height: 500rpx;
		background: #F7F7F7;
		border-radius: 8rpx;
	}

	.right-icon {
		width: 14rpx;
		height: 24rpx;
	}

	.text-cut {
		width: 460rpx;
		text-align: right;
	}

	.user-img {
		width: 118rpx;
		height: 118rpx;
	}

	.qrcode {
		width: 32rpx;
		height: 32rpx;
	}

	.submit {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		margin: 0 auto;
		margin-top: 200rpx;
	}
</style>
