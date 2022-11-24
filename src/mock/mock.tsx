import {AxiosRequestConfig} from "axios"
import {faker} from "@faker-js/faker"

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN')

export const mockSession: Mock = (config) => {
  return [200, {
    jwt: faker.random.word()
  }]
}