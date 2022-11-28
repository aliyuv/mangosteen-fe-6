import {AxiosResponse} from "axios"
import {computed, onMounted, ref} from "vue"

type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>
export const useTags = (fetcher: Fetcher) => {
  const page = ref(0)
  const hasMore = ref(false)
  const tags = ref<Tag[]>([])
  const fetchTags = async () => {
    const response = await fetcher(page.value)
    const {resources, pager} = response.data
    tags.value.push(...resources)
    //那之前页的数量不就是 (page-1)*per_page 了吗？ 为什么要用总数减去之前页的数量？ 为什么不直接用 pager.total_count ？ 因为 pager.total_count 是总数，不是总页数 。
    hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count // 之前页的数量 = 上一页的页数 * 每页的数量 + 当前页的数量 < 总数
    page.value += 1
  }
  onMounted(fetchTags)
  return {page, hasMore, tags, fetchTags}
}