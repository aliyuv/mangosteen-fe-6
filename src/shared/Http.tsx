import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from "axios";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export class Http {
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    })
  }

  //read
  get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>) {
    return this.instance.request<R>({...config, url: url, method: 'get', params: query})
  }

  //create
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'data' | 'url' | 'method'>) {
    return this.instance.request<R>({...config, url: url, method: 'post', data})
  }

  //update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'data' | 'url'>) {
    return this.instance.request<R>({...config, url: url, method: 'patch', data})
  }

  //destroy
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params'>) {
    return this.instance.request<R>({...config, url: url, params: query, method: 'delete'})
  }
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