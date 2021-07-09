import { ApiInstance } from "@/api"

export default {
    namespaced: true,
    state: {
        repositories: [],
        forks: [],
        selectedRepository: {}
    },
    mutations: {
        SET_REPOSITORIES_ARRAY(state, repositories) {
            state.repositories = [...repositories]
        },
        SET_FORKS_ARRAY(state, forks) {
            state.forks = [...forks]
        },
        SET_SELECTED_REPOSITORY(state, selectedRepository) {
            state.selectedRepository = selectedRepository
        },
    },
    getters: {
        getRepositories: state => state.repositories,
        getForks: state => state.forks,
        getSelectedRepository: state => state.selectedRepository,
    },
    actions: {
        async setRepositories({ commit, rootGetters }) {
            try {
                const response =
                    await ApiInstance
                        .get(`/users/${rootGetters['search/getSearchValue']}/repos?per_page=${rootGetters['pagination/getItemsPerPage']}&page=${rootGetters['pagination/getSelectedPage']}`)
                commit('SET_REPOSITORIES_ARRAY', response.data)
            } catch (error) {
                console.log(error)
            }
        },
        setSelectedRepository({ commit, state, dispatch }, repositoryId) {
            const selectedRepository = state.repositories.filter(repository => repository.id === repositoryId)[0]
            // trying to keep all logic in vuex so i created another function that sets total page pagination value
            dispatch('pagination/setForkTotalPage', selectedRepository.forks_count, { root: true })

            commit('SET_SELECTED_REPOSITORY', selectedRepository)
        },
        async setForks({ commit, state, rootGetters }) {
            try {
                const response =
                    await ApiInstance
                        .get(state.selectedRepository.forks_url.replace(process.env.VUE_APP_API_URL, '') + `?per_page=${rootGetters['pagination/getItemsPerPage']}&page=${rootGetters['pagination/getSelectedPage']}`)
                commit('SET_FORKS_ARRAY', response.data)
            } catch (error) {
                console.log(error)
            }
        }
    }
}