const state = {
  userInfo: {}
}

const mutations = {
  // 改变名字
  changeName(state,userInfo){
    state.userInfo = userInfo;
  }
}

const userInfo = {
  state,
  mutations
}

export default userInfo;
