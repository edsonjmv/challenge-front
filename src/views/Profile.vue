<template>
  <div class="profile">
    <v-container v-if="user" fluid>
      <v-row class="fill-height">
        <v-col align-self="start" cols="12" sm="4">
          <v-card class="mx-auto" max-width="374">
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-img height="250" :src="user.picture.large"></v-img>
            <v-card-title
              >{{ user.name.first }} {{ user.name.last }}</v-card-title
            >
            <v-card-text>
              <div class="my-4 subtitle-1">Email: {{ user.email }}</div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              Location: {{ user.location.street.number }}
              {{ user.location.street.name }}, {{ user.location.city }}
              {{ user.location.state }} {{ user.location.country }},
              {{ user.location.postcode }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <vl-map
            :load-tiles-while-animating="true"
            :load-tiles-while-interacting="true"
            data-projection="EPSG:4326"
            style="height: 400px"
          >
            <vl-view
              :zoom.sync="zoom"
              :center.sync="center"
              :rotation.sync="rotation"
            ></vl-view>

            <vl-feature id="point">
              <vl-geom-point :coordinates="coordinates"></vl-geom-point>
            </vl-feature>

            <vl-layer-tile id="osm">
              <vl-source-osm></vl-source-osm>
            </vl-layer-tile>
          </vl-map>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn
            v-if="!isFavorite()"
            depressed
            color="success"
            @click="onFavoriteChange(false)"
          >
            Add to favorites
          </v-btn>
          <v-btn v-else depressed color="error" @click="onFavoriteChange(true)">
            Remove from favorites
          </v-btn>
          <v-alert v-if="alertText" dense text type="success" class="mt-6">
            {{ alertText }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {User} from '@/interfaces/RandomUsers';
import axios from 'axios';

@Component({})
export default class Profile extends Vue {
  user: User = this.$store.state.user;

  alertText = '';

  zoom = 6;

  rotation = 0;

  center = [0, 0];

  coordinates = [0, 0];

  mounted(): void {
    this.user ? this.initializeMap() : this.$router.push('/');
  }

  initializeMap(): void {
    const longitude = Number(this.user.location.coordinates.longitude);
    const latitude = Number(this.user.location.coordinates.latitude);
    this.coordinates = [longitude, latitude];
    this.center = [longitude, latitude];
  }

  isFavorite(): boolean {
    const favorites: User[] = this.$store.state.favorites;
    return Boolean(favorites.find(({email}) => email === this.user.email));
  }

  async onFavoriteChange(isFavorite: boolean): Promise<void> {
    const endpoint = 'http://localhost:3000/favorites';
    if (isFavorite) {
      await axios.put(endpoint, {user: this.user});
    } else {
      await axios.post(endpoint, {user: this.user});
    }
    this.$store.dispatch('loadFavorites');
    this.showAlert(isFavorite);
  }

  showAlert(isFavorite: boolean): void {
    this.alertText = isFavorite
      ? 'User removed from favorites!'
      : 'User added to favorites succesfully!';
    setTimeout(() => (this.alertText = ''), 5000);
  }
}
</script>
