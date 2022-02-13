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
    <q-btn class="q-mx-sm q-my-lg" label="Appointments" :to="{name: 'AppointmentEdit', params: { clientId: client.id, appId: 0 }, query: {newAppointment: false}}" />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

export default {
  props: {
    id: String
  },
  setup(props) {
    // Internal Variables
    const $router = useRouter()
    const BASEURL = 'http://localhost:3000/clients/';

    // Exposed Variables
    const client = ref()

    // Lifecycle Hooks
    onMounted(async () => {
      try {
        const res = await axios.get(BASEURL + props.id);
        client.value = res.data;
      } catch (error) {
        console.error(error);
        $router.push('/clientNotFound')
      }
    })

    // Exposed Functions
    async function removeClient(){
      try {
        const res = await axios.delete(BASEURL + props.id);
        console.log("Client Removed")
        $router.back()
      } catch (error) {
        console.error(error);
      }
    }

    return {
      client,
      removeClient
    }
  }
}



</script>

<style>

</style>
