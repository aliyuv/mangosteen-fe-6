import {defineComponent, reactive} from 'vue'
import {MainLayout} from '../../layouts/MainLayout'
import {Tabs, Tab} from '../../shared/Tabs'
import {InputPad} from './InputPad'
import s from './ItemCreate.module.scss'
import {Tags} from './Tags'
import {useRouter} from "vue-router"
import {http} from "../../shared/Http"
import {AxiosError} from "axios"
import {Dialog} from "vant"
import {BackIcon} from "../../shared/BackIcon"

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const formDate = reactive({
      kind: '支出',
      tag_id: [],
      happen_at: new Date().toISOString(),
      amount: 0,
    })
    const router = useRouter()
    const onError = (error: AxiosError<ResourceError>) => {
      if (error.response?.status === 422) {
        Dialog.alert({
          title: '出错',
          message: Object.values(error.response.data.errors).join('\n')
        }).then(r => console.log(r))
      }
      throw error
    }
    const onsubmit = async () => {
      await http.post<Resources<Item>>('/items', formDate, {_mock: 'itemCreate',_autoLoading: true}).catch(onError)
      await router.push('/items')
    }
    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <BackIcon/>,
        default: () => <>
          <div class={s.wrapper}>
            <Tabs v-model:selected={formDate.kind} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={formDate.tag_id[0]}/>
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={formDate.tag_id[0]}/>
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad v-model:amount={formDate.amount} v-model:happenAt={formDate.happen_at} onSubmit={onsubmit}/>
            </div>
          </div>
        </>
      }}</MainLayout>
    )
  }
})