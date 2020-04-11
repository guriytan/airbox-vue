import {getToken, setToken, removeToken} from '@/utils/auth'
import instance from "@/utils/request";

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
      instance.post('/user/login', {user: username.trim(), password: password})
        .then(response => {
          commit('SET_TOKEN', response.token);
          setToken(response.token);
          resolve()
        }).catch(error => {
        reject(error)
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

