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
    <q-list class="q-mx-sm q-my-lg">
      <div class="row">
        <q-item-label class="col-11" header>Appointments</q-item-label>
        <q-btn class="col" color="accent" icon="add" :to="{name: 'AppointmentEdit', params: { clientId: client.id } ,query: {newAppointment: true}}"/>
      </div>
      <q-item
        v-for="appointment in client.appointment"
        :key="appointment.id"
        class="q-my-sm"
        clickable
        v-ripple
        :to="{name: 'AppointmentEdit', params: { clientId: client.id, appId: appointment.id }, query: {newAppointment: false}}">
        <q-item-section>
          <q-item-label>{{ appointment.service }}</q-item-label>
          <q-item-label caption lines="1">{{ appointment.date }} | {{ appointment.time }} | {{ appointment.duration }} minutes</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-input disable class="q-mx-sm q-my-lg" filled v-model="client.notes" autogrow label="Notes" />
    <div align="center">
      <q-btn color="negative" @click="confirm = true" label="Delete"/>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to delete the client?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="RemoveClient" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    const confirm = ref(false)

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
    async function RemoveClient(){
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
      RemoveClient,
      confirm
    }
  }
}

</script>

<style>

</style>
