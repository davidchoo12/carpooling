import Vue from 'vue';
import Router from 'vue-router';
import Rides from '@/views/Rides';
import RideForm from '@/views/RideForm';
// import Datatable from '@/components/Datatable';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/ride',
      component: Rides,
    },
    {
      path: '/ride/new',
      component: RideForm,
    },
    {
      path: '/ride/:id',
      component: RideForm,
    },
  ],
});
