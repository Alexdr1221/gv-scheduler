<template>
  <q-page v-if="client">
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.name" label="Name" />
    <q-input disable class="q-mx-sm q-my-lg" filled type="tel" mask="(###) ###-####" v-model="client.phone" label="Phone Number" />
    <q-input disable class="q-mx-sm q-my-lg" filled type="email" v-model="client.email" label="Email" />
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.street" label="Street" />
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.city" label="City" />
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.state" label="State" maxlength="2" />
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.zip" label="Zip" maxlength="5" />
    <q-select disable class="q-mx-sm q-my-lg" filled v-model="client.paymentMethod" label="Payment Method" />
    <q-input disable class="q-mx-sm q-my-lg" filled type="number" v-model="client.paymentAmount" label="Payment Amount" prefix="$" />
    <q-btn class="q-mx-sm q-my-lg" label="Appointments" :to="{name: 'AppointmentEdit', params: { id: client.id }, query: {newAppointment: false}}" />
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.notes" autogrow label="Notes" />
    <div align="center">
      <q-btn color="negative" @click="removeClient" label="Delete"/>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="edit" :to="{name: 'ClientEdit', params: {id: client.id}, query: {newClient: false}}" color="accent" />
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
const BASEURL = 'http://localhost:3000/clients/';

export default {
  props: ['id'],
  data() {
    return {
      client: null
    }
  },
  async mounted(){
    try {
      const res = await axios.get(BASEURL + this.id);
      this.client = res.data;
    } catch (error) {
      console.error(error);
      this.$router.push('/clientNotFound')
    }
  },
  methods:{
    async removeClient(){
      try {
        const res = await axios.delete(BASEURL + this.id);
        console.log("Client Removed")
        this.$router.go(-1)
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style>

</style>
