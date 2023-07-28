import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/DataTable.vue')
      },
      {
        path: 'datatable',
        name: 'datatable',
        component: () => import('../pages/DataTable.vue'),
        children: [
          {
            path: 'basic',
            name: 'datatable-basic',
            component: () => import('../pages/BasicDatatable.vue')
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
];

export default routes;
