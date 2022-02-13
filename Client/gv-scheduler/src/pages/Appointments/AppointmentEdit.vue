<template>
  <q-page>
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
      <q-btn class="q-mx-sm" color="primary" @click="saveChanges" label="Save"/>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios';
const BASEURL = 'http://localhost:3000/clients/'

export default {
  props: {
    id: String
  },
  setup(props) {
    //Internal Varaibles
    const $q = useQuasar()
    const $router = useRouter()
    const $route = useRoute()
    var client = null

    //Exposed Variables
    const services = ['House Cleaning', 'Landscaping']
    var service = ref()
    var payment = ref()
    var time = ref()
    var date = ref ()

    // Lifecycle Hooks
    onMounted(async () => {
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
    })

    //Exposed Functions
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
        try {
          const res = await axios.put(BASEURL + props.id, client)
        } catch (error) {
          console.error(error)
        }
      }

    return {
      service,
      payment,
      time,
      date,
      services,
      saveChanges,
      cancelChanges
    }
  }
}
</script>

<style></style>
