import {defineComponent, reactive, ref} from "vue";
import s from './SignInPage.module.scss'
import {hasError, validate} from "../shared/validate";
import {MainLayout} from "../layouts/MainLayout";
import {Icon} from "../shared/Icon";
import {Form, FormItem} from "../shared/Form";
import {Button} from "../shared/Button";
import {http} from "../shared/Http";
import {useBool} from "../hooks/useBooll";
import {useRoute, useRouter} from "vue-router";
import {BackIcon} from "../shared/BackIcon";
import {useMeStore} from "../stores/useMeStore";

export const SignInPage = defineComponent({
  setup: (props, context) => {
    const meStore = useMeStore()
    const formData = reactive({
      email: '',
      code: ''
    })
    const refValidationCode = ref<any>()
    const errors = reactive({
      email: [],
      code: []
    })
    const {ref: refDisabled, toggle, on: disabled, off: enable} = useBool(false)
    const router = useRouter()
    const route = useRoute()
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        email: [],
        code: []
      })
      Object.assign(errors, validate(formData, [
        {key: 'email', type: 'required', message: '必填'},
        {key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址'},
        {key: 'code', type: 'required', message: '必填'},
        {key: 'code', type: 'pattern', regex: /^\d{6}$/, message: '必须是 6 位数字'},
      ]))
      if (!hasError(errors)) {
        const response = await http.post<{ jwt: string }>('/session', formData, {_autoLoading: true}).catch(onError)
        localStorage.setItem('jwt', response.data.jwt)
        //1. 通过路由参数传递
        // await router.push('/sign_in?return_to=' + encodeURIComponent(route.fullPath))
        //2. 通过路由元信息传递
        const returnTo = route.query.return_to?.toString()
        meStore.refreshMe()
        router.push(returnTo || '/') //如果returnTo存在就跳转到returnTo 不存在就跳转到首页

      }
    }
    const onError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors)
      }
      throw error
    }
    const onClickSendValidationCode = async () => {
      disabled()
      await http.post('/validation_codes', {email: formData.email}, {
        _autoLoading: true,
      }).catch(onError).finally(enable) //不管成功还是失败，都要把按钮恢复可用
      //成功
      refValidationCode.value.startCount()
    }
    return () => (
      <MainLayout>{
        {
          title: () => '登录',
          icon: () => <BackIcon/>,
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon class={s.icon} name="mangosteen"/>
                <h1 class={s.appName}>山竹记账</h1>
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem label="邮箱地址" type="text"
                          placeholder='请输入邮箱，然后点击发送验证码'
                          v-model={formData.email} error={errors.email?.[0]}/>
                <FormItem ref={refValidationCode} label="验证码" type="validationCode"
                          placeholder='请输入六位数字'
                          countFrom={1}
                          disabled={refDisabled.value}
                          onClick={onClickSendValidationCode}
                          v-model={formData.code} error={errors.code?.[0]}/>
                <FormItem style={{paddingTop: '96px'}}>
                  <Button type='submit'>登录</Button>
                </FormItem>
              </Form>
            </div>
          )
        }
      }</MainLayout>
    )
  }
})