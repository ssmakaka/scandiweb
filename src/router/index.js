import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import AddProduct from '@/pages/AddProduct.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
  },
  {
    path: '/add',
    name: 'add-product',
    component: AddProduct,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
