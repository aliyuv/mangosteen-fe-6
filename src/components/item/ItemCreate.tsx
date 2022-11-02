import {defineComponent} from "vue";
import s from './ItemCreate.module.scss'

export const ItemCreate = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>hi</div>
    )
  }
})