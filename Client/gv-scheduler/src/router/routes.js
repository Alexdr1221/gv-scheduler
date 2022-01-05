
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Schedule',
        component: () => import('src/pages/Schedule'),
      },

      {
        path: '/clients',
        name: 'Clients',
        component: () => import('src/pages/Clients/Clients.vue'),
      },

      {
        path: '/clients/details/:id',
        name: 'ClientDetail',
        component: () => import('src/pages/Clients/ClientDetail.vue'),
        props: true
      },

      {
        path: 'clients/edit/:id',
        name: 'ClientEdit',
        component: () => import('src/pages/Clients/ClientEdit.vue'),
        props: true
      },

      {
        path: '/settings',
        name: 'Settings',
        component: () => import('src/pages/Settings.vue'),
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
