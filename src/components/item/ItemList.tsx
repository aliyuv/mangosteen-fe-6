import {defineComponent, ref} from "vue";
import s from './ItemList.module.scss'
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";
import {Tab, Tabs} from "../../shared/Tabs";

export const ItemList = defineComponent({
  setup: (props, context) => {
    const refSelected = ref('本月')
    return () => (
      <MainLayout>{{
        title: () => '山竹记账',
        icon: () => <Icon name='menu'/>,
        default: () => (
          <Tabs classPrefix={'customTabs'} v-model:selected={refSelected.value}>
            <Tab name='本月'>
              <div>本月</div>
            </Tab>
            <Tab name='今年'>
              <div>今年</div>
            </Tab>
            <Tab name='自定义时间'>
              <div>自定义时间</div>
            </Tab>
          </Tabs>
        )
      }}</MainLayout>
    )
  }
})