import {computed, defineComponent, PropType} from "vue"
import {Time} from "./time"


export const Datetime = defineComponent({
  props: {
    value: {
      type: [Date, String] as PropType<Date | string>,
      required: true
    },
    format: {
      type: String as PropType<string>,
      default: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  setup: (props, context) => {
    const toDisplay = computed(() => new Time(props.value).format(props.format))
    return () => (<div>{toDisplay.value}</div>)
  }
})