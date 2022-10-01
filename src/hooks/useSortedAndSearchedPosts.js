import { computed, ref } from 'vue'

export default function useSortedPosts(sortedPosts) {
  const searchQuery = ref('')
  const sortedAndSearchedPosts = computed(() => {
    return sortedPosts.value.filter((item) =>
        item.title.includes(searchQuery.value.toLocaleLowerCase())
      )
  })

  return {
    searchQuery,
    sortedAndSearchedPosts,
  }
}
