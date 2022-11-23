import {RouteRecordRaw} from "vue-router";
import {First} from "../components/welcome/First";
import {FirstActions} from "../components/welcome/FirstActions";
import {Forth} from "../components/welcome/Forth";
import {ForthActions} from "../components/welcome/ForthActions";
import {Second} from "../components/welcome/Second";
import {SecondActions} from "../components/welcome/SecondActions";
import {Third} from "../components/welcome/Third";
import {ThirdActions} from "../components/welcome/ThirdActions";
import {StartPage} from "../views/StartPage";
import {Welcome} from "../views/Welcome";
import {ItemPage} from "../views/ItemPage";
import {ItemList} from "../components/item/ItemList";
import {ItemCreate} from "../components/item/ItemCreate";
import {TagPag} from "../views/TagPag";
import {TagEdit} from "../components/tag/TagEdit";
import {TagCreate} from "../components/tag/TagCreate";
import {SignInPage} from "../views/SignInPage";
import {StatisticsPage} from "../views/StatisticsPage";
import {http} from "../shared/Http";

export const routes: RouteRecordRaw[] = [
  {path: '/', redirect: '/welcome'},
  {
    path: '/welcome',
    component: Welcome,
    beforeEnter: (to, from, next) => {
      localStorage.getItem('skipFeatures') === 'yes' ? next('/start') : next()
    },
    children: [
      {path: '', redirect: '/welcome/1'},
      {path: '1', name: "Welcome1", components: {main: First, footer: FirstActions},},
      {path: '2', name: "Welcome2", components: {main: Second, footer: SecondActions},},
      {path: '3', name: "Welcome3", components: {main: Third, footer: ThirdActions},},
      {path: '4', name: "Welcome4", components: {main: Forth, footer: ForthActions},},
    ]
  },
  {path: '/start', component: StartPage},
  {
    path: '/items', component: ItemPage,
    //请求 /me 接口，如果返回错误 401，说明用户未登录，跳转到登录页
    beforeEnter: async (to, from, next) => {
      await http.get('/me').catch(() => {
        next('/sign_in?return_to=' + to.path) // 未登录，跳转到登录页 并且把当前页面的地址传给登录页 以便登录成功后跳转回来 例如：/items => /sign_in?return_to=/items
      })
      next()
    },
    children: [
      {path: '', component: ItemList},
      {path: 'create', component: ItemCreate},
    ]
  },
  {
    path: '/tags', component: TagPag,
    children: [
      {path: 'create', component: TagCreate},
      {path: ':id/edit', component: TagEdit},
    ]
  },
  {
    path: '/sign_in', component: SignInPage
  },
  {
    path: '/statistics', component: StatisticsPage
  }
]