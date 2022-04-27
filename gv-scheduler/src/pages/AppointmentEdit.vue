<template>
  <q-page>
    <q-select v-if="newAppointment == 'true'" :disable="fixedClient" class="q-mx-sm q-my-lg" filled @popup-hide="ClientSelected" v-model="selectedClient" label="Client" :options="clientNames" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="service" label="Service" :options="services"/>
    <q-input class="q-mx-sm q-my-lg" filled v-model="payment" type="number" label="Payment Amount" prefix="$" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="date" label="Date">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input class="q-mx-sm q-my-lg" filled v-model="time" lebel="Time" >
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
    <q-input class="q-mx-sm q-my-lg" v-model.number="duration" label="Duration" type="number" hint="minutes" filled />
    <div class="q-my-lg" align="center">
      <q-btn class="q-mx-sm" color="primary" @click="cancelChanges" label="Cancel"/>
      <q-btn class="q-mx-sm" color="primary" :disable="saveDisable" @click="saveChanges" label="Save"/>
    </div>
    <div align="center">
      <q-btn v-if="newAppointment == 'false'" color="negative" @click="confirm = true" label="Delete"/>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to delete the appointment?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="RemoveAppointment" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios';

export default {
  props: {
    clientId: String,
    appId: String
  },
  setup(props) {
    //Internal Varaibles
    const $router = useRouter()
    const $route = useRoute()
    const BASEURL = 'http://localhost:3000/clients/'
    var clients = null
    var client = null
    var clientId = null
    var appId = null

    //Exposed Variables
    const services = ['House Cleaning', 'Landscaping']
    const clientNames = ref([])
    const newAppointment = ref()
    const selectedClient = ref()
    const service = ref()
    const payment = ref()
    const time = ref()
    const date = ref()
    const saveDisable = ref()
    const duration = ref()
    const confirm = ref()
    const fixedClient = ref(false)

    // Lifecycle Hooks
    onMounted(async () => {
      newAppointment.value = $route.query.newAppointment
      if (newAppointment.value == 'false')
      {
        appId = props.appId
        clientId = props.clientId
        console.log(props)
        console.log("Importing Appointment Info...")
        try {
          const res = await axios.get(BASEURL + props.clientId)
          client = res.data
          console.log(client)
          service.value = client.appointment[appId].service
          payment.value = client.appointment[appId].paymentAmount
          date.value = client.appointment[appId].date
          time.value = client.appointment[appId].time
          duration.value = client.appointment[appId].duration
        } catch (error) {
          console.error(error);
          $router.push('/clientNotFound')
        }
      }
      else if (newAppointment.value == 'true' && props.clientId)
      {
        console.log("Importing Client Info...")
        clientId = props.clientId
        fixedClient.value = true
        try {
          const res = await axios.get(BASEURL + props.clientId)
          client = res.data
          if ((client.appointment.length - 1) >= 0)
          {
            appId = 1 + client.appointment[client.appointment.length - 1].id
          }
          else
          {
            appId = 0
          }
          selectedClient.value = client.name
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
    function ClientSelected() {
      console.log(selectedClient.value)
      saveDisable.value = false
      clientId = clients.findIndex((clients) => clients.name==selectedClient.value)

      let lastAppointment = clients[clientId].appointment.length - 1
      if (lastAppointment >= 0)
      {
        appId = 1 + client.appointment[client.appointment.length - 1].id
      }
      else
      {
        appId = 0
      }
      client = clients[clientId]
    }

    function saveChanges() {
      if (newAppointment.value == 'true')
      {
        var app = {
          id: appId,
          service: service.value,
          paymentAmount: payment.value,
          date: date.value,
          time: time.value,
          duration: duration.value
        }

        if (app.id == 0)
        {
          client.appointment = []
        }
        client.appointment.push(app)
      }
      else
      {
      console.log("Saving Changes...")
      client.appointment[appId].service = service.value
      client.appointment[appId].paymentAmount = payment.value
      client.appointment[appId].date = date.value
      client.appointment[appId].time = time.value
      client.appointment[appId].duration = duration.value
      }
      console.log(client.appointment)
      updateClient()
      $router.back()
    }

    function cancelChanges() {
      console.log("Cancelling Changes...")
      $router.back()
    }

    async function updateClient() {
        try {
          const res = await axios.put(BASEURL + clientId, client)
        } catch (error) {
          console.error(error)
        }
      }

      async function RemoveAppointment(){
      client.appointment.splice(appId, 1)
      updateClient()
      $router.back()
    }

    return {
      clientNames,
      newAppointment,
      selectedClient,
      service,
      payment,
      time,
      date,
      services,
      ClientSelected,
      saveChanges,
      cancelChanges,
      saveDisable,
      duration,
      confirm,
      RemoveAppointment,
      fixedClient
    }
  }
}
</script>

<style></style>
