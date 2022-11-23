import {routes} from './config/routes';
import {createApp} from 'vue'
import {App} from './App'
import {createRouter} from 'vue-router'
import {history} from './shared/history';
import '@svgstore';
import {fetchMe, mePromise} from "./shared/me";

const router = createRouter({history, routes})

fetchMe().then()

const whiteList: Record<string, 'exact' | 'startWith'> = {
  '/': 'exact',
  '/start': 'exact',
  '/welcome': 'startWith',
  '/sign_in': 'startWith',
}
router.beforeEach((to, from) => {
  for (const key in whiteList) {
    const value = whiteList[key]
    if (value === 'exact' && to.path === key) {
      return true
    }
    if (value === 'startWith' && to.path.startsWith(key)) {
      return true
    }
  }
  return mePromise!.then(
    () => true,
    () => '/sign_in?return_to=' + to.path
  )
})
const app = createApp(App)
app.use(router)
app.mount('#app')
