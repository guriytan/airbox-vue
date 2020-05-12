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

export default function UploadFile(md5, folderID, item) {
  let url = "/file/upload";
  if (folderID) {
    url += "?fid=" + folderID;
  }
  let formData = new FormData();
  formData.append('size', item.file.size)
  formData.append('md5', md5)
  if (item.file.webkitRelativePath) {
    let path = item.file.webkitRelativePath
    formData.append('folder', path.substring(0, path.lastIndexOf("/")))
  }
  formData.append('file', item.file);
  return new Promise(((resolve, reject) => {
    uploadRequest({
      url: url,
      method: 'post',
      data: formData,
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
