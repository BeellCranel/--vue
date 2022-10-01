import axios from 'axios'

export const postModule = {
  state: () => ({
    posts: [],
    isPostsLoading: false,
    selectedSort: '',
    searchQuery: '',
    page: 1,
    limit: 10,
    totalPages: 0,
    sortOptions: [
      { value: 'title', name: 'По названию' },
      { value: 'body', name: 'По содержимому' },
    ],
  }),
  getters: {
    sortedPosts(state) {
      return [...state.posts].sort((post1, post2) => {
        return post1[state.selectedSort]?.localeCompare(
          post2[state.selectedSort]
        )
      })
    },
    sortedAndSearchedPosts(state, getters) {
      return getters.sortedPosts.filter((item) =>
        item.title.includes(state.searchQuery)
      )
    },
  },
  mutations: {
    setPosts(state, posts) {
      state.posts = posts
    },
    setLoading(state, bool) {
      state.isPostsLoading = bool
    },
    setSelectedSort(state, selectedSort) {
      state.selectedSort = selectedSort
    },
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery
    },
    setPage(state, page) {
      state.page = page
    },
    setTotalPages(state, totalPages) {
      state.totalPages = totalPages
    },
  },
  actions: {
    async fetchPosts({ state, commit }) {
      try {
        commit('setLoading', true)
        const respons = await axios.get(
          'https://jsonplaceholder.typicode.com/posts',
          {
            params: {
              _page: state.page,
              _limit: state.limit,
            },
          }
        )
        commit(
          'setTotalPages',
          Math.ceil(respons.headers['x-total-count'] / state.limit)
        )
        commit('setPosts', respons.data)
      } catch (e) {
        console.log(e)
      } finally {
        commit('setLoading', false)
      }
    },
    async loadMorePosts({ state, commit }) {
      try {
        commit('setPage', (state.page += 1))
        const respons = await axios.get(
          'https://jsonplaceholder.typicode.com/posts',
          {
            params: {
              _page: state.page,
              _limit: state.limit,
            },
          }
        )
        commit(
          'setTotalPages',
          Math.ceil(respons.headers['x-total-count'] / state.limit)
        )
        commit('setPosts', [...state.posts, ...respons.data])
      } catch (e) {
        console.log(e)
      }
    },
  },
  namespaced: true,
}
