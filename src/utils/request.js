import axios from 'axios'
import defaultSettings from '@/settings'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import Qs from "qs"
import {getToken} from "@/utils/auth";

const normalRequest = axios.create({
  baseURL: defaultSettings.baseAPI,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [function (data) {
    // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    return Qs.stringify(data);
  }],
});

// request interceptor
normalRequest.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // let each request carry token
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
normalRequest.interceptors.response.use(
  response => {
    // if the custom code is not 200, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: response.data || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(new Error(response.data || 'Error'))
    }
    return response.data
  },
  error => {
    if (error.response && error.response.status) {
      // 401: 未登录, 403 token过期
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      if (error.response.status === 401 || error.response.status === 403) {
        MessageBox.confirm('You haven\'t login , or your token is out of dated. Please re-login', 'Warning', {
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
        });
      } else {
        Message({
          message: error.response.data.message || error.response.data,
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(error.response);
      }
    } else {
      Message({
        message: 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
  }
);

export function GetList(path) {
  let url = "/info/list" + (path ? "?fid=" + path : "");
  return new Promise(((resolve, reject) => {
    normalRequest.get(url).then(response => {
      resolve(response)
    }).catch(() => {
      reject()
    })
  }))
}

export function GetUserInfo() {
  return new Promise((resolve => {
    normalRequest.get("/info/user").then(response => {
      resolve(response)
    })
  }))
}

export function GetType(type) {
  return new Promise((resolve, reject) => {
    normalRequest.get("/info/type?type=" + type).then(response => {
      resolve(response)
    }).catch(() => {
      reject()
    })
  })
}

export function GetToken(username, password) {
  return new Promise((resolve, reject) => {
    normalRequest.post('/auth/token', {user: username, password: password}).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function SendDeleteUser() {
  return new Promise(resolve => {
    normalRequest.post('/auth/unsubscribe').then(() => {
      resolve()
    });
  })
}

export function GetShareLink(id) {
  return new Promise((resolve => {
    normalRequest.post("/auth/share", {id: id}).then(response => {
      resolve(response)
    })
  }))
}

export function SendRegister(name, email) {
  return new Promise(resolve => {
    normalRequest.post('/auth/register', {username: name, email: email,}).then(() => {
      resolve()
    });
  })
}

export function ForgetPwd(user) {
  return new Promise(resolve => {
    normalRequest.post('/auth/password', {user: user}).then(() => {
      resolve()
    })
  })
}

export function SendResetEmail(email, password) {
  return new Promise(resolve => {
    normalRequest.post('/auth/email', {email: email, password: password,}).then(() => {
      resolve()
    });
  })
}

export function GetFolder(fid) {
  let url = '/folder/get' + (fid !== '0' ? '?fid=' + fid : '')
  return new Promise(resolve => {
    normalRequest.get(url).then(response => {
      resolve(response.folder)
    });
  })
}

export function AddFolder(name, fid) {
  return new Promise(((resolve, reject) => {
    normalRequest.post("/folder/new", {name: name, fid: fid}).then(response => {
      resolve(response.folder)
    }).catch(() => {
      reject()
    });
  }))
}

export function Delete(type, id) {
  let url = (type === 0 ? "/folder/" : "/file/") + id
  return new Promise(((resolve, reject) => {
    normalRequest.delete(url).then(() => {
      resolve()
    }).catch(() => {
      reject()
    })
  }))
}

export function Rename(type, name, id) {
  let url = (type === 0 ? "/folder/" : "/file/") + id
  return new Promise(((resolve, reject) => {
    normalRequest.put(url, {
      name: name,
    }).then(() => {
      resolve()
    }).catch(() => {
      reject()
    });
  }))
}

export function CopyOrMove(type, id, fid, copy) {
  let url = (type === 0 ? "/folder/" : "/file/") + id
  return new Promise(((resolve, reject) => {
    normalRequest.put(url, {
      fid: fid,
      copy: copy
    }).then(() => {
      resolve()
    }).catch(() => {
      reject()
    });
  }))
}

export function Register(name, pwd, email, code) {
  return new Promise(resolve => {
    normalRequest.post('/user/new', {
      username: name,
      password: pwd,
      code: code,
      email: email,
    }).then(() => {
      resolve()
    })
  })
}

export function ResetPwd(token, pwd) {
  return new Promise(resolve => {
    normalRequest.put('/user/password', {token: token, password: pwd}).then(() => {
      resolve()
    })
  })
}

export function ResetEmail(id, email, code) {
  return new Promise((resolve => {
    normalRequest.put('/user/' + id + '/email', {email: email, code: code,}).then(response => {
      resolve(response)
    });
  }))
}

export function ResetPwdOrigin(id, oldPwd, newPwd) {
  return new Promise((resolve => {
    normalRequest.put('/user/' + id + '/password', {origin: oldPwd, password: newPwd,}).then(() => {
      resolve()
    });
  }))
}

export function DeleteUser(id, code) {
  return new Promise(resolve => {
    normalRequest.delete('/user/' + id + '?code=' + code).then(() => {
      resolve()
    });
  })
}
