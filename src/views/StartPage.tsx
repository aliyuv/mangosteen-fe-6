import {defineComponent, ref} from 'vue';
import {Button} from '../shared/Button';
import {FloatButton} from '../shared/FloatButton';
import s from './StartPage.module.scss';
import {Center} from "../shared/Center";
import {Icon} from "../shared/Icon";
import {Overlay, OverlayIcon} from "../shared/Overlay";
import {RouterLink} from "vue-router";
import {MainLayout} from "../layouts/MainLayout";

export const StartPage = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }
    return () => (

      <MainLayout>{
        {
          title: () => '山竹记账',
          icon: () => <OverlayIcon/>,
          default: () => <>
            <Center class={s.pig_wrapper}>
              <Icon name='pig' class={s.pig}/>
            </Center>
            <div class={s.button_wrapper}>
              <RouterLink to='/items/create'>
                <Button class={s.button}>开始记账</Button>
              </RouterLink>
            </div>
            <RouterLink to='/items/create'>
              <FloatButton iconName='add'/>
            </RouterLink>
          </>
        }
      }</MainLayout>
    )
  }
})