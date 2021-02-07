export default {

	//oss直传
	queryAutograph:'/v1/60078a539be0c', //上传音频和图片

	// 登录个人中心
	aliSend: '/v1/5c78dca45ebc1', //发送验证码
	postloginByAccount: '/v1/5c78dbfd977cf', //密码登录 1
	postUserSocialLogin: '/v1/5d7660a421e69', //第三方登录
	getUserInfo: '/v1/5c78c4772da97', //获取会员详情 1
	editUserinfo: '/v1/5cb54af125f1c', // 编辑用户信息 1
	bindMobile:'/v1/5d5f4c28b8636', //新增（更换）绑定手机号
	uploadImg:'/v1/5d5fa8984f0c2', //上传图片 1
	getCollection:'/v1/6001569a46164', //收藏列表 1
	editBgPost:'/v1/60063988268bc', //修改背景图 1
	userQrCode:'/v1/60078fea3ea2c', //用户二维码 1
	systemsRegard:'/v1/6010b446c2aa8',//关于我们 1
	
	
	// 论坛
	getUnreadMessage:'/v1/60000a7c26327',//获得用户发布信息 1
	userPostInformation:'/v1/5ffd4d87025f1',//获得用户发布信息 1
	getMessageList:'/v1/5ffd03a66799c',//消息列表 
	deleteComment:'/v1/5ffd0075242cf',//评论删除 1
	forumCommentList:'/v1/5ffcffb9027fe',//论坛评论列表 1
	forumCommentAdd:'/v1/5ffcfefd7a744',//论坛评论添加 1
	deleteBBS:'/v1/5ffcfe3304f16',//删除论坛 1
	commentDetails:'/v1/5ffcfd3e1f8a7',//论坛详情 1
	collectBBS:'/v1/5d89f462c9c21',//收藏/取消收藏 论坛 1
	collectLike:'/v1/5ffcfa6a253c8',//论坛点赞/取消点赞 1
	BBSList:'/v1/5ffcf8b3db130',//论坛列表 1
	BBSClassification:'/v1/5ffcf7d31541d',//论坛分类 1
	publishingBBS:'/v1/5ffcf46649510',//发布论坛 1
	
	
	//单人聊天
	searchUser:'/v1/5ff6a0b8b453f', //搜索用户结果（非好友） 1
	chatUserinfo:'/v1/5ff6ae2c1c2d1', //点击头像获取用户详情 1
	addFriend:'/v1/5ff6c26090b42', //申请添加好友 1
	applyFriendList:'/v1/5ff6cee479969', //好友申请记录列表 1
	agreeFriend:'/v1/5ff6d3b30e02e', //同意添加好友  1
	refuseFriend:'/v1/5ff6d3df77160', //拒绝添加好友 1
	setNickname:'/v1/5ff6d64a8d8e4', //设置好友昵称  1
	getAddressList:'/v1/60014a4dbc964', //讯录好友列表 1
	delete_friend:'/v1/6000e2fc09abc', //删除好友 1
	set_is_not_disturb:'/v1/600a8ada8e33c', //设置是否免打扰 1
	
	//多人聊天
	cate_group_list:'/v1/5ffe67974d545', //群聊分类 1
	search_not_join_group:'/v1/5ffe6e37e739d', //搜索未加入的群聊 1
	join_group:'/v1/6000ebe63727e', //申请入群 1
	user_be_group:'/v1/60010368629e8', //用户所在群聊 1
	apple_group_list:'/v1/5ffebc4bdf80e', //入圈验证列表 1
	refuse_join:'/v1/5ffee05c654ba', //拒绝入群 1
	agree_join:'/v1/5ffed98d5f92b', //同意入群  1
	not_join_group_info:'/v1/5ffea5b99429f', //未加入群聊查看详情 1
	join_group_info:'/v1/6004e3be87039', //加入群聊查看详情 1
	complain_info:'/v1/5fffd9ab3bed0', //投诉原因  1
	complain_info_add:'/v1/600129e1073fb', //投诉 1
	set_group_notice:'/v1/6004f7883a513', //群主编辑群信息 1
	set_group_nickname:'/v1/60010809ea0e5', //设置群昵称 1
	show_all_user:'/v1/600105fece3a5', //显示全部群成员 1
	create_user_from_group:'/v1/600100a216bfb', //邀请好友入群 1
	delete_user_from_group:'/v1/6000ffe2d65ce', //删除群聊成员 1
	delete_group_user_list:'/v1/600678b124645', //删除群聊用户列表展示 1
	dissolution_group:'/v1/600695a6aa014', //解散群聊 1
	level_group:'/v1/60029d030cc60', //退出群聊 1
	
	// 消息
	chat_list:'/v1/6002a3f9a3270' ,//聊天记录列表  1
	msg_list:'/v1/6004f38f2439b',//单聊聊天内容  1
	say_msg:'/v1/5ffffa174ce56',//单聊发送消息  1
	chat_flush_msg:'/v1/600bba6e06216',//单聊用户清空聊天记录  1
	read_notReds_message:'/v1/600012cd626a5', //单聊清空未读消息数量  1
	delete_msg:'/v1/6004f352b6a03', //单聊删除消息  1
	withdraw_msg:'/v1/6004f36a626b2', //撤回单聊消息  1
	
	msg_group_list:'/v1/6005079b40d35', //群聊聊天记录列表 1
	say_group_msg:'/v1/600109e480543', //发送群聊消息  1
	withdraw_group_msg:'/v1/600e11415d7fb', //群聊撤回消息 1
	delete_group_msg:'/v1/6005229e54874', //群聊删除聊天记录 1
	group_flush_msg:'/v1/600e0f0961842', //清空群聊消息 1
	read_group_message:'/v1/600e69248866c', //群聊清空未读消息数量 1
	user_chat_list:'/v1/600e6a436d2a4', //搜索群聊和好友  1
	chat_left_delete:'/v1/600539371b3a2', //聊天列表删除  1
	
	chat_history_list:'/v1/6010bf2598c4b', //获取用户和客服历史聊天消息  1
	
	
	
}
