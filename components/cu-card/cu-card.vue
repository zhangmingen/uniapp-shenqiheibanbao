<template>
	<view :class="comment?'pb-100':''">
		<view class="flex padding solid-bottom bg-white">
			<view class="">
				<u-image :src="showData.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="user-img flex-shrink"
				 border-radius="8rpx" :lazy-load="true" @click="handleJumpFun('/pages/friendData/friendData?id='+showData.user_id,comment)"></u-image>
			</view>
			<view class="cu-card dynamic flex-sub" :class="isCard?'no-card':''">
				<view class="cu-item" @click.stop="comment?commentFun(true):jumpDetail(showData.aid)">
					<view class="item-head flex justify-between padding-left padding-bottom-xs" @click.stop="jumpDetail(showData.aid)">
						<view class="name flex align-center">{{showData.user_nickname}} <text class="margin-left-sm lable text-white text-xs"
							 v-if="showData.cate_name">{{showData.cate_name}}</text></view>
						<view class="del" v-if="showData.is_me" @click.stop="delBBS(showData.aid,comment)">删除</view>
					</view>
					<view class="padding-left padding-bottom-xs text-break" @click.stop="jumpDetail(showData.aid)">
						{{!comment?showAllText(showData.content):showData.content}}
					</view>
					<view class="padding-left fulltext" @click.stop="jumpDetail(showData.aid)" v-if="showData.content && showData.content.length>60 && !comment">全文</view>
					<view class="grid flex-sub padding-lr padding-top bg-img" :class="showData.file_url.length>1?'col-3 grid-square':''"
					 v-if="showData.type=='image' && showData.file_url.length>1" @tap.stop>
						<u-image class="bg-img" :src="item" mode="aspectFill" v-for="(item,index) in showData.file_url" :key="index"
						 @click="ViewImage(showData.file_url,item)"></u-image>
					</view>
					<view class="padding-left" v-if="showData.type=='image' && showData.file_url.length==1">
						<view style="width: 50%;" @tap.stop>
							<u-image class="bg-img" :src="item" width="100%" mode="widthFix" v-for="(item,index) in showData.file_url" :key="index"
							 @click="ViewImage(showData.file_url,item)"></u-image>
						</view>
					</view>
					<view class="videoClass padding-left" v-if="showData.type=='video' && showData.file_url.length==1 && !comment"
					 @click="jumpDetail(showData.aid)">
						<u-image class="bg-img" :src="item+'?x-oss-process=video/snapshot,t_0,f_jpg'" height="400rpx" mode="aspectFill"
						 v-for="(item,index) in showData.file_url" :key="index"></u-image>
						<image src="../../static/imgs/icon/paly.png" mode="aspectFill" class="playImg"></image>
					</view>
					<view class=" padding-left" v-if="showData.type=='video' && showData.file_url.length==1 && comment">
						<video autoplay :src="showData.file_url[0]" controls class="video"></video>
						<!-- :show-fullscreen-btn="false" -->
						<!-- :poster="showData.file_url[0]+'?x-oss-process=video/snapshot,t_0,f_jpg'" -->
					</view>
					<view class="flex align-center padding-left padding-top">
						<view class="text-sm text-999">
							{{showData.time || showData.time_value}}
						</view>
						<view class="flex align-center justify-end text-grey text-sm text-right flex-sub text-df">
							<!-- <text class="cuIcon-attentionfill margin-lr-xs"></text> 10 -->
							<view class="padding-tb-xs flex align-center handle" @click.stop="likeBBS(showData)">
								<image :src="showData.is_like==1?'/static/imgs/icon/like_act.png':'/static/imgs/icon/like.png'" mode="aspectFill"></image>
								{{showData.like_num || 0}}
							</view>
							<view class="padding-tb-xs margin-lr-lg flex align-center handle" @click.stop="comment?commentFun():jumpDetail(showData.aid)">
								<image src="../../static/imgs/icon/comment.png" mode=""></image> {{showData.comment_size || 0}}
							</view>
							<view class="padding-tb-xs flex align-center handle" @click.stop="favBBS(showData)">
								<image :src="showData.is_collect==1?'../../static/imgs/icon/fav_act.png':'../../static/imgs/icon/fav.png'" mode=""></image>
								{{showData.fav_num || 0}}
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>

		<view class="flex padding bg-white solid-bottom" v-if="comment && commentList &&commentList.length>0" v-for="(item,index) in commentList"
		 :key="index" @click="focusFun(item)">
			<u-image :src="item.head_img" mode="aspectFill" width="72rpx" height="72rpx" class="user-img flex-shrink"
			 border-radius="8rpx" :lazy-load="true"></u-image>
			<view class="cu-card dynamic flex-sub" :class="isCard?'no-card':''">
				<view class="cu-item">
					<view class="item-head flex justify-between padding-left padding-bottom-xs">
						<view class="name">{{item.user_nickname}}</view>
						<view class="del" v-if="user_id==item.user_id || showData.user_id == user_id" @click.stop="deleteCommentFun(item,1)">删除</view>
					</view>
					<view class="padding-left padding-bottom-xs text-break">
						{{item.comment}}
					</view>
					<view class="bg-eee margin-left" v-if="item.comment_level.length>0" @click.stop>
						<view class="flex padding-sm" v-for="(comment,index) in item.comment_level" :key="index" >
							<u-image :src="comment.head_img" mode="aspectFill" width="56rpx" height="56rpx" class="user-img1 flex-shrink"
							 border-radius="8rpx" :lazy-load="true"></u-image>
							<view class="cu-card dynamic flex-sub" :class="isCard?'no-card':''">
								<view class="cu-item bg-eee">
									<view class="item-head flex justify-between padding-left padding-bottom-xs">
										<view class="name text-df">{{comment.user_nickname}}</view>
										<view class="del" v-if="showData.user_id == user_id || item.user_id==user_id || comment.user_id==user_id"
										 @click.stop="deleteCommentFun(comment,2,item)">删除</view>
									</view>
									<view class="padding-left padding-bottom-xs text-break">
										回复@{{comment.reply_user_nickname}}：{{comment.comment}}
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>

			</view>
		</view>

		<view class="text-center text-sm text-666 padding" v-if="comment && commentList.length<=0">
			这里还没有评论~
		</view>
		<!-- input -->
		<view class="padding-lr bg-f6f6 commentBox text-df" v-if="comment">
			<view class="text-sm text-333 padding-bottom-xs" v-if="reply_id">回复{{reply_name}}：</view>
			<view class="flex align-center ">
				<input type="text" class="flex-sub text-df text-left padding-lr" :focus="focusStu" maxlength="100" v-model="commentText"
				 placeholder="说点什么吧" @confirm="submitFun" @blur="blurFun" />
				<view class="submit" @click="submitFun">发送</view>
			</view>
		</view>
		<uni-popup ref="popup1" type="dialog">
			<uni-popup-dialog type="info" title="确定要删除该论坛吗？" :before-close="true" @confirm="confirm" @close="close"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog type="info" title="确定要删除该评论吗？" :before-close="true" @confirm="confirmTwo" @close="close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	var timer = null;
	export default {
		data() {
			return {
				isCard: true,
				commentText: "", //评论内容
				user_id: global.userInfo.id,

				reply_id: "", //回复id
				reply_user_id: "", //回复用户的id
				reply_name: "", //回复用户名
				inputHeight: "", //输入框高度
				focusStu: false, //评论焦点，
				delbbsobj: null, //删除论坛
			};
		},
		name: 'cu-card',
		props: {
			comment: {
				type: Boolean,
				default: false
			},
			showData: {
				type: Object,
				default: null
			},
			commentList: {
				type: Array,
				default: null
			},
		},
		computed: {
			// 显示全部文字处理
			showAllText: function() {
				return function(text) {
					if (text != null && text.length > 60) {
						return text.substring(0, 60) + "...";
					}
					return text || "";
				};
			},
		},
		methods: {
			close(done) {
				done()
			},
			confirm(done) {
				var _this = this;
				done()
				var id = this.delbbsobj.id;
				var status = this.delbbsobj.status;
				this.$api.post(global.apiUrls.deleteBBS, {
					id: id
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						// 是否在评论页删除
						if (status) {
							this.$message.info(res.msg);
							var pages = getCurrentPages(); //当前页
							var beforePage = pages[pages.length - 2]; //上个页面
							if (beforePage.$vm.refreshdata) beforePage.$vm.refreshdata(id);
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 500)
						} else {
							this.$emit('refreshdata', id);
						}
					}
				})
			},
			confirmTwo(done) {
				var _this = this;
				done()
				var item = this.delbbsobj.item;
				var tier = this.delbbsobj.tier;
				var comment = this.delbbsobj.comment;
				_this.$api.post(global.apiUrls.deleteComment, {
					id: item.aid
				}).then(res => {
					var res = res.data;
					if (res.code == 1) {
						// 如果评论已经删除不能再回复
						if (_this.reply_id == item.aid) _this.commentFun();
						this.$emit('delFlush', item, tier, comment);
				
						var pages = getCurrentPages(); //当前页
						var beforePage = pages[pages.length - 2]; //上个页面
						if (beforePage.$vm.refreshComment) beforePage.$vm.refreshComment(_this.showData.aid, false);
					}
				})
			},
			blurFun(val) {
				this.focusStu = false
			},
			// 预览图片
			ViewImage(item, url) {
				uni.previewImage({
					urls: item,
					current: url
				});
			},
			// 跳转个人资料
			handleJumpFun(url, comment) {
				// if (!comment) return
				uni.navigateTo({
					url: url
				})
			},
			jumpDetail(id) {
				if (this.comment) return;
				uni.navigateTo({
					url: "/pages/home/comment?id=" + id
				})
			},
			// 删除论坛
			delBBS(id, status) {
				let _this = this;
				_this.delbbsobj = {
					id:id,
					status:status
				}
				this.$refs.popup1.open();

			},
			likeBBS(item) {
				let _this = this;
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.collectLike, {
						like_id: item.aid,
						type: 1,
						be_id: item.user_id,
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							if (item.is_like == 1) {
								item.is_like = 0;
								item.like_num -= 1;
							} else {
								item.is_like = 1
								item.like_num += 1;
							}
							if (this.comment) {
								var pages = getCurrentPages(); //当前页
								var beforePage = pages[pages.length - 2]; //上个页面
								if (beforePage.$vm.refreshLike) beforePage.$vm.refreshLike(item.aid);
							}
						}
					})
				}, 100)
			},
			favBBS(item) {
				let _this = this;
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					this.$api.post(global.apiUrls.collectBBS, {
						collect_id: item.aid,
						type: 1,
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							if (item.is_collect == 1) {
								item.is_collect = 0;
								item.fav_num -= 1;
							} else {
								item.is_collect = 1
								item.fav_num += 1;
							}
							if (this.comment) {
								var pages = getCurrentPages(); //当前页
								var beforePage = pages[pages.length - 2]; //上个页面
								if (beforePage.$vm.refreshFav) beforePage.$vm.refreshFav(item.aid);
							}
						}
					})
				}, 100)
			},
			// 评论
			submitFun() {
				let _this = this;
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					if (!this.commentText.trim()) return this.$message.info('请输入评论内容');
					this.$api.post(global.apiUrls.forumCommentAdd, {
						f_id: _this.showData.aid,
						comment: _this.commentText,
						reply_id: _this.reply_id,
						reply_user_id: _this.reply_user_id
					}).then(res => {
						var res = res.data;
						if (res.code == 1) {
							_this.commentText = "";
							this.$emit('commentSuccess', _this.showData.aid);

							var pages = getCurrentPages(); //当前页
							var beforePage = pages[pages.length - 2]; //上个页面
							if (beforePage.$vm.refreshComment) beforePage.$vm.refreshComment(_this.showData.aid, true);
						}
					})
				}, 300)
			},
			// 回复获取焦点
			focusFun(item) {
				console.log(item)
				this.reply_id = item.aid; //回复id
				this.reply_user_id = item.user_id; //回复用户的id
				this.reply_name = item.user_nickname;
				this.focusStu = true; // 获取焦点
			},
			// 点击评论
			commentFun(stu = false) {
				if (stu) {
					this.reply_id = ""; //回复id
					this.reply_user_id = ""; //回复用户的id
					this.reply_name = "";
					return;
				}
				this.reply_id = ""; //回复id
				this.reply_user_id = ""; //回复用户的id
				this.reply_name = "";
				this.focusStu = true; // 获取焦点
			},
			// 删除评论 tier 删除评论的层级
			deleteCommentFun(item, tier, comment = null) {
				let _this = this;
				_this.delbbsobj = {
					item:item,
					tier:tier,
					comment:comment
				}
				this.$refs.popup2.open();


			}
		}
	}
</script>

<style lang="less" scoped>
	.video {
		display: block;
		width: 80%;
		height: 500rpx;
		margin: 0 auto;
	}

	.handle {
		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 6rpx;
			vertical-align: middle;
		}
	}

	.commentBox {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 10rpx 30rpx;
		z-index: 99999!important;

		input {
			background-color: #FFFFFF;
			height: 72rpx;
			border-radius: 8rpx;
		}

		.submit {
			margin-left: 32rpx;
			color: #225DAD;
		}
	}

	.videoClass {
		position: relative;
		width: 50%;

		.playImg {
			position: absolute;
			left: 36rpx;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			width: 72rpx;
			height: 72rpx;
		}
	}

	.pb-100 {
		padding-bottom: 100rpx;
	}

	.user-img {
		width: 72rpx;
		height: 72rpx;
	}

	.user-img1 {
		width: 56rpx;
		height: 56rpx;
	}

	.item-head {
		.name {
			font-size: 30rpx;
			color: #225DAD;
		}

		.del {
			font-size: 24rpx;
			color: #999999;
		}
	}

	.fulltext {
		font-size: 30rpx;
		color: #225DAD;
	}

	.lable {
		padding: 0;
		display: block;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 8px;
		padding: 0 10rpx;
		vertical-align: middle;
		background-color: rgba(0, 169, 252, .6);
	}
</style>
