<template>
  <q-page v-if="clients" class="q-pa-sm" style="max-width: 100%">
    <q-list>
      <q-item
        v-for="client in clients"
        :key="client.id"
        class="q-my-sm"
        clickable
        v-ripple
        :to="{name: 'ClientDetail', params: { id: client.id }}"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ client.letter }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ client.name }}</q-item-label>
          <q-item-label caption lines="1">{{ client.phone }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" :to="{name: 'ClientEdit', params: {id: 0}, query: {newClient: true}}" color="accent" />
    </q-page-sticky>
  </q-page>

  <q-page v-else>
        <q-inner-loading showing>
        <q-spinner-gears size="100px" color="primary" />
        <h3>LOADING...</h3>
      </q-inner-loading>
  </q-page>
</template>

<script>
import axios from 'axios';
const BASEURL = 'http://localhost:3000/clients';

export default {

  data() {
    return {
      clients: []
    }
  },
  async mounted(){
    try {
      const res = await axios.get(BASEURL);
      this.clients = res.data;
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style>
</style>
