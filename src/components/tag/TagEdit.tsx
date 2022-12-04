import {defineComponent} from "vue";
import {MainLayout} from "../../layouts/MainLayout";
import s from './Tag.module.scss'
import {Button} from "../../shared/Button";
import {TagForm} from "./TagForm";
import {BackIcon} from "../../shared/BackIcon";
import {useRoute, useRouter} from "vue-router";
import {Dialog} from "vant";
import {http} from "../../shared/Http";

export const TagEdit = defineComponent({
  setup: (props, context) => {
    const route = useRoute();
    console.log(route.params.id);
    const numberId = parseInt(route.params.id!.toString())
    if (Number.isNaN(numberId)) {
      return <div>id 不存在</div>
    }
    const router = useRouter()
    const onError = () => {
      Dialog.alert({title: '出错', message: '删除失败'}).then(r => console.log(r))
    }
    const onDelete = async (options?: { withItems?: boolean }) => {
      await Dialog.confirm({
        title: '删除标签',
        message: '确定删除该标签吗？'
      })
      await http.delete(`/tags/${numberId}`, {
        withItems: options?.withItems ? 'true' : 'false'
      }, {
        _autoLoading: true
      }).catch(onError)
      router.back()
    }
    return () => (
      <MainLayout>{{
        title: () => '编辑标签',
        icon: () => <BackIcon/>,
        default: () => <>
          <TagForm id={numberId}/>
          <div class={s.actions}>
            <Button level='danger' class={s.removeTags} onClick={() => onDelete()}>删除标签</Button>
            <Button level='danger' class={s.removeTagsAndItems}
                    onClick={() => onDelete({withItems: true})}>删除标签和记账</Button>
          </div>
        </>
      }}</MainLayout>
    )
  }
})