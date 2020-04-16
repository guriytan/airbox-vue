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

export default function UploadFile(folderID, item, cancelToken) {
  let url = "/file/upload?";
  if (folderID) {
    url += "fid=" + folderID + "&";
  }
  let formData = new FormData();
  if (item.file.webkitRelativePath) {
    let path = item.file.webkitRelativePath
    formData.append(path.substring(0, path.lastIndexOf("/")), item.file);
  } else {
    formData.append('file', item.file);
  }
  return new Promise(((resolve, reject) => {
    uploadRequest({
      url: url + 'size=' + item.file.size,
      method: 'post',
      data: formData,
      cancelToken: cancelToken.token,
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
