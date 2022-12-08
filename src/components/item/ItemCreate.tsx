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
import {hasError, validate} from "../../shared/validate"

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const formData = reactive<Partial<Item>>({
      kind: 'expenses',
      tag_ids: [],
      happen_at: new Date().toISOString(),
      amount: 0,
    })
    const errors = reactive<FormErrors<typeof formData>>({kind: [], tag_ids: [], happen_at: [], amount: []})
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
      Object.assign(errors, {kind: [], tag_ids: [], happen_at: [], amount: []})
      Object.assign(errors, validate(formData, [
        {key: 'kind', type: 'required', message: '类型不能为空'},
        {key: 'tag_ids', type: 'required', message: '标签不能为空'},
        {key: 'happen_at', type: 'required', message: '日期不能为空'},
        {key: 'amount', type: 'required', message: '金额不能为空'},
        {key: 'amount', type: 'notEqual', value: 0, message: '金额不能为零'}
      ]))
      if (hasError(errors)) {
        Dialog.alert({
          title: '出错',
          message: Object.values(errors).filter(v => v.length > 0).join('\n')
        })
        return
      }
      await http.post<Resources<Item>>('/items', formData, {_mock: 'itemCreate', _autoLoading: true}).catch(onError)
      await router.push('/items')
    }
    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <BackIcon/>,
        default: () => <>
          <div class={s.wrapper}>
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab value="expenses" name="支出">
                <Tags kind="expenses" v-model:selected={formData.tag_ids![0]}/>
              </Tab>
              <Tab value="income" name="收入">
                <Tags kind="income" v-model:selected={formData.tag_ids![0]}/>
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad v-model:amount={formData.amount} v-model:happenAt={formData.happen_at} onSubmit={onsubmit}/>
            </div>
          </div>
        </>
      }}</MainLayout>
    )
  }
})