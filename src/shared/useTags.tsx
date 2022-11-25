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
    hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count //之前页的数量不就是 (pager.page - 1) * pager.per_page 么？ 为什么还要加上 resources.length ？
    console.log('pager.page', pager.page, 'pager.per_page', pager.per_page, 'pager.count ', pager.count, 'resources.length', resources.length)
    page.value += 1
  }
  onMounted(fetchTags)
  return {page, hasMore, tags, fetchTags}
}