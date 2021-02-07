<template>
	<view class="login">
		<!-- logo -->
		<image src="../static/logo.png" mode="aspectFill" class="login-icon"></image>
		<view class="text-xxl text-bold text-center">神奇黑板报</view>
		<view class="member-form padding-lr-lg padding-top">
			<!-- 选择登录方式 -->
			<view class="login-methods" v-if="false">
				<view class="text-center login-box">
					<image src="../static/imgs/icon/weixin.png" mode="aspectFill"></image>
					<image src="../static/imgs/icon/qq.png" mode="aspectFill"></image>
					<view class="login-text">
						选择登录方式
					</view>
				</view>
			</view>
			<!-- 绑定手机号 -->
			<view class="member-login" v-else >
				<view class="flex align-center justify-between member-input">
					<image src="../static/imgs/icon/login-phone.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
					<button class="yanZhengMa text-blu text-sm text-bold" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../static/imgs/icon/login-password.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" type="number" maxlength="6" v-model="vercode" placeholder="请输入验证码" />
				</view>
				<button class="edit-btn text-xl text-white" :class="formstatus?'bg-blu':''" :loading="is_click" @tap="reg">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import {
		validate
	} from '@/common/utils/index';
	let timer = null;
	export default {
		data() {
			return {
				is_click: false, //加载动画
				phone: '', //手机号
				vercode: '', //验证码
				verCodeBtnLoading: false, //获取验证码loading
				time: 60, //倒计时60S
				beginning: false, //显示倒计时
				formstatus: true, //表单校验是否通过
				loginmethods: false, //是否选择登录方式
			}
		},
		onLoad() {
			_this = this;
		},
		methods: {
			//发送验证码
			handleSendVerCode() {
				let {
					phone
				} = this;
				if (!validate(phone, 'phone')) {
					_this.$message.info('请正确输入手机号');
					return false;
				}
				if (_this.beginning) return false;
				if (_this.verCodeBtnLoading) return false;
				_this.verCodeBtnLoading = true;
				_this.$api.post(global.apiUrls.GetVerifyCode, {
						is_test: global.IS_DEV,
						mobile: phone,
						type: '2'
					})
					.then(res => {
						_this.verCodeBtnLoading = false;
						if (res.data.code == 1) {
							_this.$message.info('验证码已发送');
							_this.beginning = true;
							//显示倒计时
							clearInterval(_this.timer);
							//开始倒计时
							_this.timer = setInterval(() => {
								if (_this.time == 1) {
									//倒计时结束
									clearInterval(_this.timer);
									_this.time = 60;
									_this.beginning = false;
									return;
								}
								_this.time--;
							}, 1000);
						} else {
							_this.$message.info(res.data.msg);
						}
					});
			},
			//登录
			reg() {
				if (_this.is_click) {
					return;
				}
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					let {
						phone,
						password
					} = _this;

					if (!phone) {
						_this.$message.info('请输入手机号');
						return false;
					}
					if (!validate(phone, 'phone')) {
						_this.$message.info('请输入正确的手机号');
						return false;
					}
					if (!validate(password, 'password')) {
						_this.$message.info('请输入字母加数字6-12位密码');
						return false;
					}

					_this.is_click = true;
					_this.$api.post(global.apiUrls.postloginByAccount, {
						mobile: phone,
						password: password
					}).then(res => {
						_this.is_click = false;
						if (res.data.code == 1) {
							_this.$message.info(res.data.msg);
							global.token = res.data.data.userinfo.user_token
							global.userInfo = res.data.data.userinfo
							uni.setStorageSync('USER_TOKEN', global.token)
							uni.setStorageSync('USER_INFO', global.userInfo)
							uni.$emit('appLoginSuccess', {
								msg: '登录成功'
							})
							setTimeout(() => {
								uni.reLaunch({
									url: "/pages/home/home"
								})
							}, 500)

						} else {
							_this.$message.info(res.data.msg);
						}
					})
				}, 300)
			},
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
		overflow: hidden;
	}
</style>
<style scoped lang="less">
	.login-icon {
		display: block;
		width: 172rpx;
		height: 172rpx;
		border: 8rpx;
		margin: 0 auto;
		margin-top: 160rpx;
		margin-bottom: 48rpx;
	}

	.icon-img {
		width: 38rpx;
		height: 38rpx;
		margin-top: -1rpx;
	}

	.member-login {
		margin-top: 100rpx;
	}

	.member-input {
		height: 110rpx;
		line-height: 110rpx;
		border-bottom: 1px solid #EEEEEE;
		padding: 30rpx 32rpx;

		input {
			font-size: 32rpx;
			padding: 0 20rpx;
		}
	}

	.edit-btn {
		width: 600rpx;
		height: 88rpx;
		background: #CCEDFE;
		border-radius: 45rpx;
		margin-top: 99rpx;

		&:after {
			border: none !important;
		}
	}

	.yanZhengMa {
		height: 90upx;
		line-height: 90upx;
		padding: 0;
		background: none;

		&:after {
			border: none !important;
		}
	}

	.login-box {
		margin-top: 550rpx;

		image {
			width: 72rpx;
			height: 72rpx;

			&:first-child {
				margin-right: 72rpx;
			}
		}

		.login-text {
			margin-top: 64rpx;
			font-size: 26rpx;
			color: #CED1D7;
		}
	}
</style>
