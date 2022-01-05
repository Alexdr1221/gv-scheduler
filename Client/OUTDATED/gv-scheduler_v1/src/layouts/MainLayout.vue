<template>
  <q-layout view="hhh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>
          G&V Clean Break Scheduler
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="600"
        bordered
      >
        <q-scroll-area class="fit">
          <q-list>

            <template v-for="(menuItem, index) in menuList">
              <q-item :to="menuItem.link" :key="index" clickable exact :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
            </template>

          </q-list>
        </q-scroll-area>
      </q-drawer>


    <q-page-container>
        <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
const menuList = [
  {
    icon: 'schedule',
    label: 'Schedule',
    link: '/',
    separator: false
  },
  {
    icon: 'person',
    label: 'Client List',
    link: '/clients',
    separator: false
  },
  {
    icon: 'settings',
    label: 'Settings',
    link: '/settings',
    separator: false
  }
  // {
  //   icon: 'help',
  //   label: 'Help',
  //   link: '/help',
  //   separator: true
  // }
]

export default {
  name: "MainLayout",
  data() {
    return {
      drawer: false,
      menuList
    }
  }
}
</script>
