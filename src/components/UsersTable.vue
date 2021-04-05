<template>
  <div class="users-table">
    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            label="Gender"
            :items="genders"
            v-model="gender"
            v-on:change="onFilterChange"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            label="Age"
            :items="ages"
            v-model="age"
            v-on:change="onFilterChange"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="3">
          <v-select
            label="Nationality"
            :items="nationalities"
            v-model="nationality"
            v-on:change="onFilterChange"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="3">
          <v-btn
            block
            depressed
            color="error"
            :disabled="!gender && !age && !nationality"
            v-on:click="onClearFilters"
          >
            Clear filters
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      class="elevation-1"
      item-key="email"
      :headers="headers"
      :items.sync="filteredUsers"
      :items-per-page="100"
      @click:row="onRowClick"
    >
      <template v-slot:[`item.full_name`]="{item}"
        >{{ item.name.title }} {{ item.name.first }}
        {{ item.name.last }}</template
      >
      <template v-slot:[`item.favorite`]="{item}">
        <v-simple-checkbox
          color="success"
          :value="isFavorite(item)"
          :ripple="false"
          @click="onFavoriteChange(item)"
        ></v-simple-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {User} from '@/interfaces/RandomUsers';
import axios from 'axios';

@Component({
  name: 'users-table'
})
export default class UsersTable extends Vue {
  @Prop()
  users!: User[];

  @Watch('users')
  onPropertyChanged(value: User[]): void {
    if (this.users) {
      this.filteredUsers = value;
      this.populateFilters(this.users);
    }
  }

  headers = [
    {text: 'Gender', value: 'gender'},
    {text: 'Name', sortable: false, value: 'full_name'},
    {text: 'Email', value: 'email'},
    {text: 'Nationality', value: 'nat'},
    {text: 'Date of birthday', value: 'dob.date'},
    {text: 'Date of registration', value: 'registered.date'},
    {text: 'Favorite', value: 'favorite'}
  ];

  filteredUsers: User[] = [];

  genders: string[] = [];

  nationalities: string[] = [];

  ages: number[] = [];

  gender = '';

  nationality = '';

  age = null;

  populateFilters(users: User[]): void {
    this.genders = users.map(({gender}) => gender);
    this.ages = users.map(({dob}) => dob.age).sort();
    this.nationalities = users.map(({nat}) => nat).sort();
  }

  onFilterChange(): void {
    this.filteredUsers = this.users.filter(({gender, dob, nat}) => {
      return (
        (!this.gender || gender === this.gender) &&
        (!this.age || dob.age === this.age) &&
        (!this.nationality || nat === this.nationality)
      );
    });
  }

  onClearFilters(): void {
    this.gender = '';
    this.nationality = '';
    this.age = null;
    this.onFilterChange();
  }

  onRowClick(user: User): void {
    this.$store.commit('setUser', user);
    this.$router.push('profile');
  }

  isFavorite(user: User): boolean {
    const favorites: User[] = this.$store.state.favorites;
    return Boolean(favorites.find(({email}) => email === user.email));
  }

  async onFavoriteChange(user: User): Promise<void> {
    const endpoint = 'http://localhost:3000/favorites';
    if (this.isFavorite(user)) {
      await axios.put(endpoint, {user});
    } else {
      await axios.post(endpoint, {user});
    }
    this.$store.dispatch('loadFavorites');
  }
}
</script>
