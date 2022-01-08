import { createStore } from 'vuex'

var data = localStorage.getItem("userSaveInfo")
let preUserInfo;
try {
  preUserInfo = JSON.parse(data) || {};
} catch (SyntaxError) {
  preUserInfo = {};
}

export default createStore({
  state: {
    token: preUserInfo.token || null,
    id: preUserInfo.id || null,
    role: preUserInfo.role || null,
    defAddr: null,
    searchKeyword: null,
  },
  mutations: {
    setUser(state, info) {
      localStorage.setItem("userSaveInfo", JSON.stringify(info))
      state.token = info.token;
      state.id = info.id;
      state.role = info.role;
    },
    clear(state) {
      localStorage.clear()
      state.token = null,
      state.id = null,
      state.role = null
    },
    setDefAddr(state, addr) {
      state.defAddr = addr
    },
    setKeyword(state, str) {
      state.searchKeyword = str
    }
  },
  actions: {
    searchKeyword(state, value) {
      state.commit("setKeyword", value)
    }
  },
  modules: {
  }
})
