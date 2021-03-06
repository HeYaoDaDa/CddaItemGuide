import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'search',
        path: 'search',
        component: () => import('pages/SearchResultPage.vue'),
      },
      {
        name: 'gridByCddaItemType',
        path: 'gride/cddaItemType/:type',
        component: () => import('src/pages/GridByType.vue'),
      },
      {
        name: 'cddaItem',
        path: 'cddaItems/:type/:id',
        component: () => import('pages/CddaItemPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
