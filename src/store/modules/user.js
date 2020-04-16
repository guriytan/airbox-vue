import {getToken, setToken, removeToken} from '@/utils/auth'
import {GetToken} from "@/utils/request";

const getDefaultState = () => {
  return {
    token: getToken(),
  }
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
};

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo;
    return new Promise((resolve, reject) => {
      GetToken(username.trim(), password).then(res => {
        commit('SET_TOKEN', res.token);
        setToken(res.token);
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // user logout
  logout({commit}) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve()
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

