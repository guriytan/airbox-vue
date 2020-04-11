import axios from 'axios'
import defaultSettings from '@/settings'
import {MessageBox, Message} from 'element-ui'
import Qs from "qs"
import store from "@/store";

const instance = axios.create({
  baseURL: defaultSettings.baseAPI,
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [function (data) {
    // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    return Qs.stringify(data);
  }],
  withCredentials: true
});

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if the custom code is not 200, it is judged as an error.
    let data = response.data;
    if (data.code !== 200) {
      Message({
        message: data.warning || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      if (data.code === 401) {
        // 401: Illegal token
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
        });
      }
      return Promise.reject(new Error(data.warning || 'Error'))
    } else {
      return data
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);

export default instance
