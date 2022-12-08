import {defineComponent} from "vue"
import {Center} from "./Center"
import {Icon} from "./Icon"
import s from './ComingSoon.module.scss'

export const ComingSoon = defineComponent({
  setup: (props, context) => {
    return () => (
      <div>
        <Center class={s.pig_wrapper}>
          <Icon name="pig" class={s.pig}/>
        </Center>
        <p class={s.text}>敬请期待</p>
      </div>
    )
  }
})
