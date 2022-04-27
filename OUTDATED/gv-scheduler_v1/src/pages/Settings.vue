<template>
  <q-page>
    <q-toggle v-model="value" color="primary" keep-color label="Dark Mode" @input="darkMode"/>
  </q-page>
</template>

<script>
export default {
    data() {
        return {
            value: false
        }
    },
    mounted(){
        this.value = this.$q.dark.isActive;
    },
    methods:{
        darkMode(){
            this.$q.dark.set(this.value)
        }
    }
    
}
</script>

<style>

</style>