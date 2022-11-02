import {defineComponent, PropType} from "vue";
import s from './Tabs.module.scss'

export const Tabs = defineComponent({
  props: {
    selected: {
      type: String as PropType<string>,
      required: false
    },
    onUpdateSelected: {
      type: Function as PropType<(name: string) => void>,
      required: false
    }
  },
  setup: (props, context) => {
    return () => {
      //检查子组件是否是Tab
      const tabs = context.slots.default?.()
      console.log((tabs as any)[0].type === Tab);
      if (!tabs) return () => null //如果没有子组件，返回null
      //循环子组件，如果是Tab，就渲染
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].type !== Tab) {
          throw new Error('Tabs组件的子组件必须是Tab')
        }
      }
      return <div class={s.tabs}>
        <ol class={s.tabs_nav}>
          {tabs.map((item) =>
            <li
              class={item.props?.name === props.selected ? s.selected : ''}
              onClick={() => context.emit('update:selected', item.props?.name)}
            >
              {item.props?.name}
            </li>
          )}
        </ol>
        <div>{tabs.find(item => item.props?.name === props.selected)}</div>
      </div>
    }
  }
})

export const Tab = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    }
  },
  setup: (props, context) => {
    return () => (
      <div>{context.slots.default?.()}</div>
    )
  }
})