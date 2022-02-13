<template>
  <q-page>
    <q-select v-if="fromSchedule == 'true'" class="q-mx-sm q-my-lg" filled @popup-hide="LoadAppointment" v-model="selectedClient" label="Client" :options="clientNames" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="service" label="Service" :options="services"/>
    <q-input class="q-mx-sm q-my-lg" filled v-model="payment" type="number" label="Payment Amount" prefix="$" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="time" >
      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="time" mask="hh:mm A">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input class="q-mx-sm q-my-lg" filled v-model="date">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="MM-DD-YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div align="center">
      <q-btn class="q-mx-sm" color="primary" @click="cancelChanges" label="Cancel"/>
      <q-btn class="q-mx-sm" color="primary" :disable="saveDisable" @click="saveChanges" label="Save"/>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios';

export default {
  props: {
    id: String
  },
  setup(props) {
    //Internal Varaibles
    const $q = useQuasar()
    const $router = useRouter()
    const $route = useRoute()
    const BASEURL = 'http://localhost:3000/clients/'
    var clients = null
    var client = null
    var selId = null

    //Exposed Variables
    const services = ['House Cleaning', 'Landscaping']
    const clientNames = ref([])
    const fromSchedule = ref()
    const selectedClient = ref()
    const service = ref()
    const payment = ref()
    const time = ref()
    const date = ref()
    const saveDisable = ref()

    // Lifecycle Hooks
    onMounted(async () => {
      fromSchedule.value = $route.query.newAppointment
      if ($route.query.newAppointment == 'false')
      {
        console.log("Importing Client Info...")
        try {
          const res = await axios.get(BASEURL + props.id)
          client = res.data
          console.log(client)
          service.value = client.appointment.service
          payment.value = client.appointment.paymentAmount
          date.value = client.appointment.date
          time.value = client.appointment.time
        } catch (error) {
          console.error(error);
          $router.push('/clientNotFound')
        }
      }
      else
      {
        console.log("Loading Client List...")
        saveDisable.value = true
        try {
          const res = await axios.get(BASEURL)
          clients = res.data
          console.log(clients)
        } catch (error) {
          console.error(error);
          $router.push('/clientNotFound')
        }
        for (let index in clients)
        {
          clientNames.value.push(clients[index].name)
        }
      }
    })

    //Exposed Functions
    function LoadAppointment() {
      console.log(selectedClient.value)
      saveDisable.value = false
      selId = clients.findIndex((clients) => clients.name==selectedClient.value)
      client = clients[selId]
      service.value = client.appointment.service
      payment.value = client.appointment.paymentAmount
      date.value = client.appointment.date
      time.value = client.appointment.time
    }

    function saveChanges() {
      console.log("Saving Changes...")
      client.appointment.service = service.value
      client.appointment.paymentAmount = payment.value
      client.appointment.date = date.value
      client.appointment.time = time.value
      console.log(client.appointment)
      updateClient()
      $router.back()
    }

    function cancelChanges() {
      console.log("Cancelling Changes...")
      $router.back()
    }

    async function updateClient() {
        if ($route.query.newAppointment == 'false')
        {
          try {
            const res = await axios.put(BASEURL + props.id, client)
          } catch (error) {
            console.error(error)
          }
        }
        else
        {
          try {
            const res = await axios.put(BASEURL + selId, client)
          } catch (error) {
            console.error(error)
          }
        }
      }

    return {
      clientNames,
      fromSchedule,
      selectedClient,
      service,
      payment,
      time,
      date,
      services,
      LoadAppointment,
      saveChanges,
      cancelChanges,
      saveDisable
    }
  }
}
</script>

<style></style>
