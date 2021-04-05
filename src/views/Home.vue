<template>
  <div class="home">
    <users-table :users.sync="$store.state.users"> </users-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import usersTable from '@/components/UsersTable.vue';

@Component({
  components: {
    usersTable
  }
})
export default class Home extends Vue {
  mounted(): void {
    this.$store.dispatch('loadUsers');
    this.$store.dispatch('loadFavorites');
  }
}
</script>
