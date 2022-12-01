import {defineComponent} from "vue";
import {TimeTabsLayout} from "../layouts/TimeTabsLayout";
import {Charts} from "../components/statistic/Charts";

export const StatisticsPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <TimeTabsLayout rerenderOnSwitchTab={true} component={Charts} hideThisYear={true}/>
    )
  }
})