<template>
  <q-page>
    <q-input class="q-mx-sm q-my-lg" filled v-model="name" label="Name" />
    <q-input class="q-mx-sm q-my-lg" filled counter type="tel" mask="(###) ###-####" v-model="phone" maxlength="14" label="Phone Number" />
    <q-input class="q-mx-sm q-my-lg" filled type="email" v-model="email" label="Email" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="street" label="Street" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="city" label="City" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="state" :options="states" label="State"/>
    <q-input class="q-mx-sm q-my-lg" filled counter v-model="zip" label="Zip" maxlength="5" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="paymentMethod" :options="paymentMethods" label="Payment Method" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="notes" autogrow label="Notes" />
    <div align="center">
      <q-btn class="q-mx-sm" color="primary" @click="cancelChanges" label="Cancel"/>
      <q-btn class="q-mx-sm" color="primary" @click="saveChanges" label="Save"/>
    </div>
  </q-page>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios';

export default {
  props: {
    id: String
  },
  setup (props) {
    //Internal Varaibles
    const BASEURL = 'http://localhost:3000/clients/'
    const $router = useRouter()
    const $route = useRoute()
    var newId = 0

    //Exposed Variables
    const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    const paymentMethods = ["Paypal", "Venmo", "Cash App", "Cash", "Check"]
    var client = null
    const name = ref()
    const phone = ref()
    const email = ref()
    const street = ref()
    const city = ref()
    const state = ref()
    const zip = ref()
    const paymentMethod = ref()
    const notes = ref()

    // Lifecycle Hooks
    onMounted(async () => {
      if ($route.query.newClient == 'true'){
        try {
          const res = await axios.get(BASEURL);
          newId = 1 + res.data[res.data.length - 1].id;
          console.log(newId)
        } catch (error) {
          console.error(error);
        }
      }
      else{
        try {
          const res = await axios.get(BASEURL + props.id);
          client = res.data;
          name.value = client.name
          phone.value = client.phone
          email.value = client.email
          street.value = client.street
          city.value = client.city
          state.value = client.state
          zip.value = client.zip
          paymentMethod.value = client.paymentMethod
          notes.value = client.notes
        } catch (error) {
          console.error(error);
        }
      }
    })

    //Exposed Functions
    function cancelChanges(){
          if ($route.query.newClient == 'true')
          {
            console.log("New Client Canceled")
            $router.back()

          }
          else
          {
            console.log("Changes Canceled");
            $router.back()
          }
      }

      function saveChanges(){
          client = {
            id: newId,
            letter: name.value[0],
            name: name.value,
            phone: phone.value,
            email: email.value,
            street: street.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            paymentMethod: paymentMethod.value,
            appointment: { },
            notes: notes.value
          }
          if ($route.query.newClient == 'true')
          {
            console.log("Uploading new client...")
            uploadClient()
          }
          else
          {
            console.log("Updating client...")
            updateClient()
          }
          $router.back()
      }

      async function uploadClient(){
        try {
          const res = await axios.post(BASEURL, client)
        } catch (error) {
          console.error(error)
        }
      }

      async function updateClient(){
        try {
          const res = await axios.put(BASEURL + props.id, client)
        } catch (error) {
          console.error(error)
        }
      }

    return {
      states,
      paymentMethods,
      name,
      phone,
      email,
      street,
      city,
      state,
      zip,
      paymentMethod,
      notes,
      cancelChanges,
      saveChanges
    }
  }
}
</script>

<style></style>
