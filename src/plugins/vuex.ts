import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    users: [],
    favorites: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setFavorites(state, favorites) {
      state.favorites = favorites;
    }
  },
  actions: {
    async loadUsers({commit}): Promise<void> {
      const response = await axios.get(
        'https://randomuser.me/api/?results=500'
      );
      const users = response.data.results ? response.data.results : [];
      commit('setUsers', users);
    },
    async loadFavorites({commit}) {
      const response = await axios.get('http://localhost:3000/favorites');
      const favorites = response.data.results ? response.data.results : [];
      commit('setFavorites', favorites);
    }
  }
});
