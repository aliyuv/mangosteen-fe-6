import {defineComponent, PropType, reactive} from "vue";
import {MainLayout} from "../../layouts/MainLayout";
import s from './Tag.module.scss'
import {Button} from "../../shared/Button";
import {TagForm} from "./TagForm";
import {BackIcon} from "../../shared/BackIcon";

export const TagEdit = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>{{
        title: () => '新建标签',
        icon: () => <BackIcon/>,
        default: () => <>
          <TagForm/>
          <div class={s.actions}>
            <Button level='danger' class={s.removeTags} onClick={() => {
            }}>删除标签</Button>
            <Button level='danger' class={s.removeTagsAndItems} onClick={() => {
            }}>删除标签和记账</Button>
          </div>
        </>
      }}</MainLayout>
    )
  }
})