import {defineComponent, onMounted, PropType, reactive, ref, watch} from "vue";
import s from './ItemSummary.module.scss'
import {FloatButton} from "../../shared/FloatButton";
import {http} from "../../shared/Http";
import {Button} from "../../shared/Button";
import {Money} from "../../shared/Money";
import {Datetime} from "../../shared/Datetime";
import {Center} from "../../shared/Center";
import {Icon} from "../../shared/Icon";
import {RouterLink} from "vue-router";

export const ItemSummary = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false,
    },
    endDate: {
      type: String as PropType<string>,
      required: false,
    }
  },
  setup: (props, context) => {
    const items = ref<Item[]>([])
    const hasMore = ref(false)
    const page = ref(0)
    const fetchItems = async () => {
      if (!props.startDate || !props.endDate) {
        return
      }
      const response = await http.get<Resources<Item>>('/items', {
        happen_after: props.startDate,
        happen_before: props.endDate,
        page: page.value + 1
      }, {
        _mock: 'itemIndex',
        _autoLoading: true
      })
      const {resources, pager} = response.data
      items.value?.push(...resources)
      //resources.length 当前页的数量 pager.per_page 每页的数量 pager.page 当前页码
      // (page-1)*per_page 之前页的数量
      hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
      //为啥让page+1呢？因为page是从0开始的，而pager.page是从1开始的
      page.value += 1
    }
    onMounted(fetchItems)

    watch(() => [props.startDate, props.endDate], () => {
      items.value = []
      hasMore.value = false
      page.value = 0
      fetchItems().then(r => console.log(r))
    })
    const itemsBalance = reactive({
      expense: 0, income: 0, balance: 0
    })
    const fetchItemsBalance = async () => {
      if (!props.startDate || !props.endDate) {
        return
      }
      const response = await http.get('/items/balance', {
        happen_after: props.startDate,
        happen_before: props.endDate,
        page: page.value + 1,
        _mock: 'itemIndexBalance'
      })
      Object.assign(itemsBalance, response.data)
    }
    onMounted(fetchItemsBalance)
    watch(() => [props.startDate, props.endDate], () => {
      Object.assign(itemsBalance, {expense: 0, income: 0, balance: 0})
      fetchItemsBalance().then(r => console.log(r))
    })
    return () => (
      <div class={s.wrapper}>
        {
          items.value && items.value.length > 0 ? (
            <>
              <ul class={s.total}>
                <li>
                  <span>收入</span>
                  <Money value={itemsBalance.income}/>
                </li>
                <li>
                  <span>支出</span>
                  <Money value={itemsBalance.expense}/>
                </li>
                <li>
                  <span>净收入</span>
                  <Money value={itemsBalance.balance}/>
                </li>
              </ul>
              <ol class={s.list}>
                {items.value.map((item) => (
                  <li>
                    <div class={s.sign}>
                      <span>{item.tag_ids[0]}</span>
                    </div>
                    <div class={s.text}>
                      <div class={s.tagAndAmount}>
                        <span class={s.tag}>{item.tag_ids[0]}</span>
                        <span class={s.amount}>¥<Money value={item.amount}/></span>
                      </div>
                      <div class={s.time}><Datetime value={item.happen_at}/></div>
                    </div>
                  </li>
                ))}
              </ol>
              <div class={s.more}>
                {hasMore.value ?
                  <Button onClick={fetchItems}>加载更多</Button> :
                  <span>没有更多了</span>
                }
              </div>
            </>
          ) : (
            <>
              <Center class={s.pig_wrapper}>
                <Icon name="pig" class={[s.pig,s.sss]}/>
              </Center>
              <div class={s.button_wrapper}>
                <RouterLink to="/items/create">
                  <Button class={s.button}>开始记账</Button>
                </RouterLink>
              </div>
            </>
          )}
        <RouterLink to="/items/create">
          <FloatButton iconName='add'/>
        </RouterLink>
      </div>
    )
  },
})