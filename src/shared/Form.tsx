import {computed, defineComponent, PropType, ref} from "vue";
import s from './Form.module.scss'
import {EmojiSelect} from "./EmojiSelect";
import {DatetimePicker, Popup} from "vant";
import {Time} from "./time";
import {Button} from "./Button";

export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
    }
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    )
  }
})

export const FormItem = defineComponent({
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: [String, Number]
    },
    type: {
      type: String as PropType<'text' | 'emojiSelect' | 'date' | 'validationCode' | 'select'>,
    },
    error: {
      type: String
    },
    placeholder: String,
    options: {
      type: Array as PropType<Array<{ value: string | number, text: string }>>
    }
  },
  emits: ['update:modelValue'],
  setup: (props, context) => {
    const refDateVisible = ref(false)
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input
            value={props.modelValue}
            placeholder={props.placeholder}
            onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
            class={[s.formItem, s.input]}
          />
        case 'emojiSelect':
          return <EmojiSelect
            modelValue={props.modelValue?.toString()}
            onUpdateModelValue={value => context.emit('update:modelValue', value)}
            class={[s.formItem, s.emojiList, s.error]}
          />
        case 'validationCode':
          return <>
            <input class={[s.formItem, s.input, s.validationCodeInput]} placeholder={props.placeholder}/>
            <Button class={[s.formItem, s.button, s.validationCodeButton]}>发送验证码</Button>
          </>
        case 'select':
          return <select class={[s.formItem, s.select]}>
            {props.options?.map(option => <option value={option.value}>{option.text}</option>)}
          </select>
        case 'date':
          return <>
            <input readonly={true} value={props.modelValue}
                   placeholder={props.placeholder}
                   onClick={() => refDateVisible.value = true}
                   class={[s.formItem, s.input]}
            />
            <Popup position='bottom' v-model:show={refDateVisible.value}>
              <DatetimePicker value={props.modelValue} type='date' title='选择年月日'
                              onConfirm={(date: Date) => {
                                context.emit('update:modelValue', new Time(date).format())
                                refDateVisible.value = false
                              }}
                              onCancel={() => refDateVisible.value = false}
              />
            </Popup>
          </>
        case undefined:
          return context.slots.default?.()
      }
    })
    return () => {
      return <div class={s.formRow}>
        <label class={s.formLabel}>
          {props.label && <span class={s.formItem_name}>{props.label}</span>}
          <div class={s.formItem_value}>
            {content.value}
          </div>
          <div class={s.formItem_errorHint}>
            <span>{props.error ?? ' '}</span>
          </div>
        </label>
      </div>
    }
  }
})