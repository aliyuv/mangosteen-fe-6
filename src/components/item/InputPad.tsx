import {defineComponent, PropType, ref} from "vue";
import s from './InputPad.module.scss'
import {Icon} from "../../shared/Icon";
import {time} from "../../shared/time";
//@ts-ignore
import {DatetimePicker, Popup} from "vant";
export const InputPad = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    }
  },
  setup: (props, context) => {
    const now = new Date()
    const refDate = ref<Date>(now)
    const refDatePickerVisible = ref(false)
    const showDatePicker = () => refDatePickerVisible.value = true
    const hideDatePicker = () => refDatePickerVisible.value = false
    const setDate = (date: Date) => {refDate.value = date; hideDatePicker()}
    const refAmount = ref('0')
    const appendText = (n: number | string) => {
      const nString = n.toString()
      const doIndex = refAmount.value.indexOf('.')
      if(refAmount.value.length >= 13){
        return
      }
      if(doIndex >= 0 && refAmount.value.length - doIndex > 2){
        return
      }
      if(nString === '.'){
        if(doIndex >= 0){ //已经有小数点了
          return
        }
      }else if(nString === '0'){
        if(doIndex === -1){ //没有小数点
          if (refAmount.value === '0'){ //没有小数点，且第一位是0
            return
          }
        }
      }else {
        if (refAmount.value === '0'){ //第一位是0
          refAmount.value = ''
        }
      }

      refAmount.value += n.toString()
    }
    const buttons = [
      {text: '1', onClick: () => {appendText(1)}},
      {text: '2', onClick: () => {appendText(2)}},
      {text: '3', onClick: () => {appendText(3)}},
      {text: '4', onClick: () => {appendText(4)}},
      {text: '5', onClick: () => {appendText(5)}},
      {text: '6', onClick: () => {appendText(6)}},
      {text: '7', onClick: () => {appendText(7)}},
      {text: '8', onClick: () => {appendText(8)}},
      {text: '9', onClick: () => {appendText(9)}},
      {text: '0', onClick: () => {appendText(0)}},
      {text: '.', onClick: () => {appendText('.')}},
      {text: '清空', onClick: () => {refAmount.value = '0'}},
      {text: '提交', onClick: () => {}},
    ]
    return () => <>
      <div class={s.dateAndAmount}>
      <span class={s.date}>
        <Icon name='date' class={s.icon}/>
        <span>
          <span onClick={() =>showDatePicker()}>{time(refDate.value).format()}</span>
          <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
            <DatetimePicker value={refDate.value} type='date' title='选择年月日'
                            onConfirm={setDate} onCancel={hideDatePicker}/>
          </Popup>
        </span>
      </span>
        <span class={s.amount}>{refAmount.value}</span>
      </div>
      <div class={s.buttons}>
        {buttons.map(button =>
          <button onClick={button.onClick}>{button.text}</button>
          )}
      </div>
    </>
  }
})