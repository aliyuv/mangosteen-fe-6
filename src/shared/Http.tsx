import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {mockSession, mockTagIndex} from "../mock/mock";

type GetConfig = Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>
type PostConfig = Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>
type PatchConfig = Omit<AxiosRequestConfig, 'url' | 'data'>
type DeleteConfig = Omit<AxiosRequestConfig, 'params'>

export class Http {
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    })
  }

  //read
  get<R = unknown>(url: string, query?: Record<string, string>, config?: GetConfig) {
    return this.instance.request<R>({...config, url: url, method: 'get', params: query})
  }

  //create
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
    return this.instance.request<R>({...config, url: url, method: 'post', data})
  }

  //update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
    return this.instance.request<R>({...config, url: url, method: 'patch', data})
  }

  //destroy
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
    return this.instance.request<R>({...config, url: url, params: query, method: 'delete'})
  }
}

const mock = (response: AxiosResponse) => {
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && location.hostname !== '192.168.50.20') {
    return false //返回false，不使用mock data
  }
  switch (response.config?.params?._mock) { // _mock是自定义的参数，用于判断是否使用mock data
    case 'tagIndex':
      [response.status, response.data] = mockTagIndex(response.config) //mockSession是一个函数，返回一个数组 [status, data] 作为mock data  [200, {jwt : '123'}]
      return true //返回true表示已经mock了
  }
  return false //返回false，不使用mock data
}

export const http = new Http('/api/v1')

http.instance.interceptors.request.use(config => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers!.Authorization = `Bearer ${jwt}`
  }
  return config
})

http.instance.interceptors.response.use(response => {
  //篡改response
  mock(response)
  return response

}, error => {
  if (mock(error.response)) {
    return error.response
  } else {
    throw error
  }
})

http.instance.interceptors.response.use(response => {
  return response
}, (error) => {
  if (error.response) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 429) {
      window.alert('请求过于频繁，请稍后再试')
    }
  }
  throw error
})