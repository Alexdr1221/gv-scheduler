<template>
  <q-page>
    <q-toggle v-model="darkStatus" color="primary" keep-color label="Dark Mode" @click="darkUpdate"/>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    //Internal Varaibles
    const $q = useQuasar()

    //Exposed Variables
    const darkStatus = ref($q.dark.isActive)

    //Exposed Functions
    function darkUpdate() {
      $q.dark.toggle(darkStatus.value)
    }

    return {
      darkStatus,
      darkUpdate
    }
  }
}
</script>

<style>

</style>
