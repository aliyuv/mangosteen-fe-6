import {defineComponent, PropType} from "vue"
import {RouterView} from "vue-router"

export const ItemPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <RouterView/>
    )
  }
})
export default ItemPage