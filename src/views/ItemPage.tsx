import {defineComponent, PropType} from "vue";
import {RouterView} from "vue-router";
import s from './ItemPage.module.scss'
export const ItemPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <RouterView/>
    )
  }
})