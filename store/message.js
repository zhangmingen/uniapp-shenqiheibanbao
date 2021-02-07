const state = {
	messageList: [], // 消息列表 1
	friend_user_num: 0, //添加好友推送数量 1
	forum_num: 0, //index论坛socket 消息数量通知
	groupNum: 0, //入群申请数量
}

const mutations = {
	// 消息列表    
	updatamMssageList(state, messageList) {
		console.log('index消息列表更新')
		state.messageList = messageList;
	},
	// 入群申请数量   
	updataGroupNum(state, num) {
		console.log('入群申请数量')
		state.groupNum = num;
		var numTotal = Number(state.friend_user_num) + Number(state.groupNum);
		if (numTotal > 0) {
			uni.setTabBarBadge({
				index: 3,
				text: numTotal > 99 ? '99+' : numTotal + ""
			})
		} else {
			uni.removeTabBarBadge({
				index: 3
			})
		}
	},
	// 添加好友推送数量
	updataAddFriend(state, num) {
		console.log('index添加好友推送数量', num);
		state.friend_user_num = num;
		var numTotal = Number(state.friend_user_num) + Number(state.groupNum);
		if (numTotal > 0) {
			uni.setTabBarBadge({
				index: 3,
				text: numTotal > 99 ? '99+' : numTotal + ""
			})
		} else {
			uni.removeTabBarBadge({
				index: 3
			})
		}
	},
	//论坛socket 消息数量通知
	updataMessageNum(state, forum_num) {
		console.log('index论坛socket 消息数量更新', forum_num)
		state.forum_num = forum_num;
		if (forum_num > 0) {
			uni.setTabBarBadge({
				index: 2,
				text: forum_num > 99 ? '99+' : forum_num + ""
			})
		} else {
			uni.removeTabBarBadge({
				index: 2
			})
		}
	},
}

const message = {
	state,
	mutations
}

export default message;
