<template>
  <div class="favorites">
    <download-csv :data="csvData" :name="'Favorites.csv'">
      <v-btn depressed>
        Download csv
      </v-btn>
    </download-csv>
    <users-table :users.sync="$store.state.favorites"> </users-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import usersTable from '@/components/UsersTable.vue';
import {FavoritesCsvItem} from '@/interfaces/FavoritesCsvItem';
import {User} from '@/interfaces/RandomUsers';

@Component({
  components: {
    usersTable
  }
})
export default class Favorites extends Vue {
  csvData: FavoritesCsvItem[] = [];

  @Watch('$store.state.favorites')
  onPropertyChanged(): void {
    this.prepareDataForCsv();
  }

  mounted(): void {
    this.$store.dispatch('loadFavorites');
  }

  prepareDataForCsv(): void {
    this.csvData = this.$store.state.favorites.map((fav: User) => {
      return {
        Gender: fav.gender,
        Name: `${fav.name.title} ${fav.name.first} ${fav.name.last}`,
        Email: fav.email,
        Nationality: fav.nat,
        'Date of birthday': fav.dob.date,
        'Date of registration': fav.registered.date
      };
    });
  }
}
</script>
