export default {
	data() {
		return {
			allowOnloadGetList: true, // 是否允许页面onload生命周期进入后立马执行getlist
			minixPagingListsApi: '', // 接口地址
			pageingListApiMethod: 'post', // 接口请求方法
			pagingListPage: 1, // 分页
			pagingListAllowLoadMore: true, // 允许加载更多
			pagingListLoadedAll: false, // 已加载全部数据
			pagingListNoListData: false, // 没有列表数据,
			isOrder: false, // 订单页面
			listData: [],


			commentMixins: false, //comment页面使用
			
			iRelease:false,//iRelease页面获取用户信息使用
			iReleaseUserInfo:"",//iRelease页面用户主页用户信息
		}
	},

	computed: {
		listDataLength() {
			return this.listData.length
		}
	},

	// 下拉刷新
	onPullDownRefresh() {
		if (this.allowOnloadGetList) {
			this.pagingListToggle(() => {
				uni.stopPullDownRefresh();
			});
		} else {
			uni.stopPullDownRefresh();
		}
	},


	onload() {
		if (this.allowOnloadGetList) this.pagingListGetLists();
	},

	//上拉加载更多
	onReachBottom() {
		this.pagingListGetLists();
	},

	methods: {

		// 列表切换
		pagingListToggle(fn) {
			this.pagingListPage = 1
			this.pagingListAllowLoadMore = true
			this.pagingListLoadedAll = false
			this.pagingListNoListData = false
			// this.listData = []
			if (fn) this.pagingListGetLists(fn);
			else this.pagingListGetLists();
		},

		// 获取列表数据
		pagingListGetLists(fn) {
			if (!this.pagingListAllowLoadMore || this.pagingListLoadedAll || this.pagingListNoListData) return;
			this.pagingListAllowLoadMore = false;
			let postData = {
				page: this.pagingListPage,
				limit: global.PAGE_SIZE
			}
			if (this.pagingListPostData) {
				postData = Object.assign({}, postData, this.pagingListPostData());
			}
			uni.showLoading({
				title:"加载中..."
			});
			this.$api[this.pageingListApiMethod](this.minixPagingListsApi, postData).then(res => {
				if (res.data.code == 1) {
					if (this.commentMixins) {
						if (this.pagingListBeforeResponseData) res.data.data = this.pagingListBeforeResponseData(res);
						let tempLists = res.data.data.data,
							totalPage = res.data.data.last_page,
							listData = this.listData;
							if (this.pagingListResponseData) tempLists = this.pagingListResponseData(tempLists);
							
							if (this.pagingListPage == 1) {
								this.listData = tempLists;
							} else {
								this.listData.push(...tempLists);
							}
							
							this.pagingListAllowLoadMore = true;
							if (this.pagingListPage >= totalPage) this.pagingListLoadedAll = true;
							if (this.pagingListPage == 1 && this.listData.length == 0) this.pagingListNoListData = true;
							this.pagingListPage = this.pagingListPage + 1;
					} else {
						if (this.pagingListBeforeResponseData) res.data.data.arr = this.pagingListBeforeResponseData(res);
						let tempLists = res.data.data.arr.data,
							totalPage = res.data.data.arr.last_page,
							listData = this.listData;
							if(this.iRelease){
								this.iReleaseUserInfo = res.data.data.userInfo;
							}
							if (this.pagingListResponseData) tempLists = this.pagingListResponseData(tempLists);
							if (this.pagingListPage == 1) {
								this.listData = tempLists;
							} else {
								this.listData.push(...tempLists);
							}
							
							this.pagingListAllowLoadMore = true;
							if (this.pagingListPage >= totalPage) this.pagingListLoadedAll = true;
							if (this.pagingListPage == 1 && this.listData.length == 0) this.pagingListNoListData = true;
							this.pagingListPage = this.pagingListPage + 1;
					}
					// if (this.pagingListResponseData) tempLists = this.pagingListResponseData(tempLists);
					// this.listData.push(...tempLists);
					// if (this.forumIndex) {
					// 	this.forum_num = res.data.data.forum_num
					// }

					// this.pagingListAllowLoadMore = true;
					// if (this.pagingListPage >= totalPage) this.pagingListLoadedAll = true;
					// if (this.pagingListPage == 1 && this.listData.length == 0) this.pagingListNoListData = true;
					// this.pagingListPage = this.pagingListPage + 1;
				} else {
					this.pagingListAllowLoadMore = true;
					this.pagingListLoadedAll = true;
					if (this.pagingListPage == 1 && this.listData.length == 0) this.pagingListNoListData = true;
				}
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
				if (fn) fn();
			}).catch(err => {
				console.log(err)
				this.pagingListAllowLoadMore = true;
			})
		}
	}
}
