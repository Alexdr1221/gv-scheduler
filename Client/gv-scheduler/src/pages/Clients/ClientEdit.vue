<template>
  <q-page v-if="client">
    <q-input class="q-mx-sm q-my-lg" filled v-model="client.name" label="Name" />
    <q-input class="q-mx-sm q-my-lg" filled counter type="tel" mask="(###) ###-####" v-model="client.phone" maxlength="14" label="Phone Number" />
    <q-input class="q-mx-sm q-my-lg" filled type="email" v-model="client.email" label="Email" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="client.street" label="Street" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="client.city" label="City" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="client.state" :options="states" label="State"/>
    <q-input class="q-mx-sm q-my-lg" filled counter v-model="client.zip" label="Zip" maxlength="5" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="client.paymentMethod" :options="paymentMethods" label="Payment Method" />
    <q-input class="q-mx-sm q-my-lg" filled type="number" v-model="client.paymentAmount" label="Payment Amount" prefix="$" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="client.notes" autogrow label="Notes" />
    <div align="center">
      <q-btn class="q-mx-sm" color="primary" @click="cancelChanges" label="Cancel"/>
      <q-btn class="q-mx-sm" color="primary" @click="saveChanges" label="Save"/>
    </div>
  </q-page>
  <q-page v-else-if="this.$route.query.newClient">
    <q-input class="q-mx-sm q-my-lg" filled v-model="newClient.name" label="Name" />
    <q-input class="q-mx-sm q-my-lg" filled counter type="tel" mask="(###) ###-####" v-model="newClient.phone" maxlength="14" label="Phone Number" />
    <q-input class="q-mx-sm q-my-lg" filled type="email" v-model="newClient.email" label="Email" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="newClient.street" label="Street" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="newClient.city" label="City" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="newClient.state" :options="states" label="State"/>
    <q-input class="q-mx-sm q-my-lg" filled counter v-model="newClient.zip" label="Zip" maxlength="5" />
    <q-select class="q-mx-sm q-my-lg" filled v-model="newClient.paymentMethod" :options="paymentMethods" label="Payment Method" />
    <q-input class="q-mx-sm q-my-lg" filled type="number" v-model="newClient.paymentAmount" label="Payment Amount" prefix="$" />
    <q-input class="q-mx-sm q-my-lg" filled v-model="newClient.notes" autogrow label="Notes" />
    <div align="center">
      <q-btn class="q-mx-sm" color="primary" @click="cancelChanges" label="Cancel"/>
      <q-btn class="q-mx-sm" color="primary" @click="saveChanges" label="Save"/> 
    </div>
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
const BASEURL = 'http://localhost:3000/clients/'
const paymentMethods = ["Paypal", "Venmo", "Cash App", "Cash", "Check"];
const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export default {
  props: ['id'],
  data() {
    return {
        clients: [],
        client: null,
        newClient:{
            id: 0,
            letter: '',
            name: '',
            phone: '',
            email: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            paymentMethod: '',
            paymentAmount: 0,
            notes: ''
        },
        paymentMethods,
        states
    }
  },
  async mounted(){
      if (this.$route.query.newClient){
        try {
          const res = await axios.get(BASEURL);
          this.clients = res.data;
        } catch (error) {
          console.error(error);
        }
      }
      else{
        try {
          const res = await axios.get(BASEURL + this.id);
          this.client = res.data;
        } catch (error) {
          console.error(error);
      }
    }

   
  },
  methods: {
      cancelChanges(){
          if (this.$route.query.newClient)
          {
            console.log("New Client Canceled")
            this.$router.back()            
            
          } 
          else
          {
            console.log("Changes Canceled");
            this.$router.back()
          }
      },
      saveChanges(){
          if (this.$route.query.newClient)
          {
            this.newClient.id = this.clients.length + 1;
            this.newClient.letter = this.newClient.name[0]
            this.uploadClient()
            console.log("New Client Created")
            this.$router.go(-1)            
          } 
          else
          {
            this.client.letter = this.client.name[0]
            this.updateClient()
            console.log("Changes Saved")
            this.$router.go(-1)  
          }
      },
      async uploadClient(){
        try {
          const res = await axios.post(BASEURL, this.newClient)
        } catch (error) {
          console.error(error)
        }
      },
      async updateClient(){
        try {
          const res = await axios.put(BASEURL + this.id, this.client)
        } catch (error) {
          console.error(error)
        }
      }
  }
}
</script>

<style></style>
