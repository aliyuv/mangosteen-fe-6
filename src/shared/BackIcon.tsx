import {defineComponent} from "vue";
import {Icon} from "../shared/Icon";
import {useRoute, useRouter} from "vue-router";

export const BackIcon = defineComponent({
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const onClick = () => {
      const {return_to} = route.query
      if (return_to) {
        router.push(return_to.toString()).then(r => console.log(r))
      } else {
        router.back()
      }
    }
    return () => <Icon name='left' onClick={onClick}/>
  }
})
