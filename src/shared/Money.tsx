import {defineComponent, PropType} from "vue";

export const Money = defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      required: true
    }
  },
  setup: (props, context) => {
    return () => (<span>{addZero(props.value / 100)}</span>)
  }
})

const addZero = (n: number) => {
  const nString = n.toString() // 1 => '1'
  //找出字符串中的小数点 1.1 => 1 1 => -1
  const dotIndex = nString.indexOf('.')
  if (dotIndex < 0) {
    return nString + '.00'
    //如果小数点后面的数字是一位的话，就在后面加一个0
  } else if (nString.substring(dotIndex).length === 2) {
    return nString + '0'
  } else {
    return nString
  }
}

export const getMoney = (n: number) => {
  return addZero(n / 100)
}