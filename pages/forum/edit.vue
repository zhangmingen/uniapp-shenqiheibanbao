<template>
	<view class="search">
		<cu-custom bgColor="bg-white text-xl solid-bottom" :isBack="false">
			<block slot="right">
				<view class="action margin-left-sm" @click="BackPage">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="submit-btn bg-blu text-df margin-right" @click.top="formSubmit">
					发表
				</view>
			</block>
		</cu-custom>

		<view class="content padding-lg">
			<textarea maxlength="500" placeholder="这一刻的想法" class="w-100 textarea-style" v-model="content"></textarea>
			<!-- 插入图片 -->
			<view class="cu-form-group padding-0 padding-top-sm">
				<view class="grid col-3 grid-square flex-sub" v-if="type!='video' && !videoUrl">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @click="ViewImage" :data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @click.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @click="ChooseImagePhotos" v-if="imgList.length<9">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
				<view class="flex justify-center w-100" v-else>
					<video id="myVideo" :src="videoUrl" class="video" :poster="videoUrl+'?x-oss-process=video/snapshot,t_0,f_jpg'"></video>
				</view>
			</view>
			<!-- 选择发布板块 -->
			<view class="text-xl text-bold padding-tb solid-bottom"> 选择发布版块 </view>
			<view class="" v-for="(item,index) in selectionList" :key="index" @click.stop="switchFun(item)">
				<view class="flex align-center justify-between text-lg padding-tb solid-bottom">
					{{item.title}}
					<text class="lg text-black cuIcon-right" :class="item.status?'cuIcon-right-90':''"></text>
				</view>
				<view class="children margin-left-sm" v-show="item.status" v-for="(item1,index1) in item.child" :key="index1"
				 @click.stop="switchFun(item1)">
					<view class="flex align-center justify-between text-df padding-tb solid-bottom">
						{{item1.title}}
						<view class="text-lg" v-if="item1.child.length>0"> <text class="lg text-gray cuIcon-right" :class="item1.status?'cuIcon-right-90':''"></text>
						</view>
					</view>
					<view class="children2 margin-left" v-show="item1.status" v-for="(item2,index2) in item1.child" :key="index2"
					 @click.stop="seleId=item2.id">
						<view class="flex align-center justify-between text-sm padding-tb solid-bottom">
							{{item2.title}}
							<view class="text-lg"> <text class="lg text-gray" :class="item2.id==seleId?'cuIcon-roundcheckfill text-blu':'cuIcon-roundcheck'"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 占位 -->
				<view class="placeholderSolid" v-if="item.status"> </view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		UploadImage
	} from '@/common/utils/index';
	let timer = null;
	export default {
		data() {
			return {
				content: "", // 发表内容

				videoUrl: "", //video地址
				videoUrl_id: "", //video地址id

				imgList: [], //发表图片
				imgList_id: [], //发表图片id

				seleId: "", //发布分类所选id
				selectionList: [], //分类列表
				type: "", //type 发布类型 default image video
			}
		},
		onLoad(options) {
			this.type = options.type || 'default';
			// 获取发布分类
			this.getClassList();
			if (this.type == 'image') {
				this.imgList = global.fileArr;
				this.imgList_id = global.fileId;
			} else if (this.type == 'video') {
				this.videoUrl = global.fileArr;
				this.videoUrl_id = global.fileId;
			}else if (this.type == 'edit') {
				var edit = uni.getStorageSync('EDIT');
				console.log(edit)
				this.content=edit.content;
				this.videoUrl=edit.videoUrl;
				this.videoUrl_id=edit.videoUrl_id;
				this.imgList=edit.imgList;
				this.imgList_id=edit.imgList_id;
			}
			// 初始化全局变量
			global.fileArr="";
			global.fileId="";
		},
		methods: {
			// 表单提交
			formSubmit: function(e) {
				let _this = this;
				if (this.isLoading) return;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					var obj = {
						content: _this.content,
						cate_id: _this.seleId
					}
					// 进行表单验证操作
					let validateRes = this.doValidate(obj);
					if (validateRes) {
						this.$message.info(validateRes);
						return;
					}

					// 类型判断
					if (_this.videoUrl) {
						obj.type = 'video';
						obj.file_url = _this.videoUrl_id;
					} else if (_this.imgList.length > 0) {
						obj.type = 'image';
						obj.file_url = _this.imgList_id.join(",");
					} else {
						obj.type = 'default';
					}

					// 发布论坛
					uni.showLoading();
					this.$api.post(global.apiUrls.publishingBBS, obj).then(res => {
						setTimeout(() => {
							this.isLoading = false;
							uni.hideLoading();
							if (res.data.code == 1) {
								uni.removeStorageSync('EDIT');
								this.$message.info(res.data.msg);
								var pages = getCurrentPages(); //当前页
								var beforePage = pages[pages.length - 2]; //上个页面
								if (beforePage.$vm.pagingListToggle) beforePage.$vm.pagingListToggle();
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 500)
							} else {
								this.$message.info(res.data.msg);
							}
						}, 500)
					})
				}, 300);
			},
			// 进行表单字段值校验
			doValidate(data) {
				// 昵称
				if (!data.content.trim()) {
					return '请输入你要发表的内容';
				}

				if (!data.cate_id) {
					return '请选择发布版块'
				}

				return '';
			},
			BackPage() {
				var _this = this;
				if (_this.content || _this.videoUrl || _this.imgList.length>0) {
					this.$popup.showModal("将此次编辑保留？", '', '不保留', '保留')
						.then((res) => {
							if (res) {
								var obj = {
									content: _this.content,
									videoUrl: _this.videoUrl,
									videoUrl_id: _this.videoUrl_id,
									imgList: _this.imgList,
									imgList_id: _this.imgList_id
								}
								console.log(obj)
								uni.setStorageSync('EDIT', obj);
								uni.navigateBack({
									delta: 1
								});
							} else {
								uni.removeStorageSync('EDIT');
								uni.navigateBack({
									delta: 1
								});
							}
						})
				} else {
					uni.navigateBack({
						delta: 1
					});
				}

			},
			ChooseImagePhotos() {
				let _this = this;
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: (res) => {
						if (_this.imgList.length + res.tempFilePaths.length > 9) return _this.$message.info('最多上传9张图片');
						uni.showLoading();
						new UploadImage(res.tempFilePaths, {
							complete: function(res) {
								if (res.length) {
									for (var i = 0; i < res.length; i++) {
										_this.imgList = _this.imgList.concat(res[i].path);
										_this.imgList_id = _this.imgList_id.concat(res[i].id);
										if (i == res.length) uni.hideLoading();
									}
								}
							}
						});
					}
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张照片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							console.log(this.imgList,this.imgList_id)
							this.imgList.splice(e.currentTarget.dataset.index, 1);
							this.imgList_id.splice(e.currentTarget.dataset.index, 1);
						}
					}
				})
			},
			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 获取论坛分类
			getClassList() {
				let _this = this;
				this.$api.post(global.apiUrls.BBSClassification, {
					id: ""
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						this.selectionList = res.data;
					}
				})
			},
			// 发布板块切换
			switchFun(item) {
				item.status = item.status ? false : true;
				this.$forceUpdate()
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
	.placeholderSolid{
		height: 8rpx;
		background-color: #F1F1F1;
	}
	.video {
		display: block;
		width: 90%;
		margin: 0 auto;
	}
	.submit-btn {
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
	}

	.textarea-style {
		height: 200rpx;
	}

	.cuIcon-right {
		display: inline-block;
		transition: all .3s;
	}

	.cuIcon-right-90 {
		transform: rotate(90deg);
	}

	#myVideo {
		height: 800rpx;
	}
</style>
