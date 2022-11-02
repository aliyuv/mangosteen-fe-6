import {defineComponent} from "vue";
import s from './ItemCreate.module.scss'
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>{{
        title: () => '记一笔',
        icon: () => <Icon name='left'/>,
        default: () => <>
          main
        </>
      }}</MainLayout>
    )
  }
})