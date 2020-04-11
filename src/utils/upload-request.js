import axios from 'axios'
import defaultSettings from '@/settings'

// create an axios instance
const service = axios.create({
  baseURL: defaultSettings.baseAPI, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  withCredentials: true
});

export default service
