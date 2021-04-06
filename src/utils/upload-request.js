import axios from 'axios'
import defaultSettings from '@/settings'
import {getToken} from "@/utils/auth";

// create an axios instance
const uploadRequest = axios.create({
  baseURL: defaultSettings.baseAPI, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  headers: {
    'Authorization': getToken(),
  },
});

export default function UploadFile(md5, fid, item) {
  let formData = new FormData();
  formData.append('file', item.file);
  return new Promise(((resolve, reject) => {
    uploadRequest({
      url: "/file/upload",
      method: 'post',
      data: formData,
      params:{father_id:fid, hash:md5, size:item.file.size},
      cancelToken: item.cancelToken.token,
      //上传进度
      onUploadProgress: (progressEvent) => {
        item.percentage = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
      }
    }).then(response => {
      resolve(response.data.file)
    }).catch(err => {
      reject(err)
    })
  }))
}
