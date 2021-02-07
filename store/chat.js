// 单聊
// "id": 10,ID <number>
// "from_uid": 11,发送者UID <number>
// "to_uid": 8,接受者UID <number>
// "show_time": 0,... <number>
// "content": "你们已经互为好友了，赶快开始聊天吧",消息内容 <string>
// "duration": "0",语音时长 <string>
// "msg_type": "1",1文本2图片3音频 4表情 <string>
// "sound_num": "0",音频时长 <string>
// "sendtime": "01/16日 15:39",发送时间 <string>
// "readtime": 0,... <number>
// "group_id": 0,群组ID <number>
// "is_read": 0,... <number>
// "is_hidden": 1,是否删除:1正常显示,2A删除,3B删除,4都删除 5=撤回 <number>
// "msg_id": 8,... <number>
// "char_type": 2,文字类型:1=正常 2=邀请消息 <number>
// "withdraw_user_id": 0,撤回消息用户ID <number>
// "u_head_img": "http://heibanbao.niurenjianzhan.com/uploads/images/20210116/9ec52726038a5989b1721c74a2805aa7.png",发送人头像 <string>
// "t_head_img": "http://heibanbao.niurenjianzhan.com/uploads/images/20210116/128e4a18aaa02b2ef1ce88855ce7de45.png"接收人头像 <string>
const state = {
	roomInfo: {
		type: "", //聊天类型 类型:1好友，2群聊
		msg_id: "", //聊天ID 消息列表获得
		to_id:"",//对方id 群聊id
	},
	msg_list: [], //单聊或群聊聊天记录
}

const mutations = {
	// 房间信息
	updataRoomInfo(state, val) {
		console.log('chat房间信息更新')
		state.roomInfo = val;
	},
	// 聊天信息记录
	updataMsg_list(state, val) {
		console.log('chat聊天信息记录更新')
		state.msg_list = val;
	}
}

const chat = {
	state,
	mutations
}

export default chat
