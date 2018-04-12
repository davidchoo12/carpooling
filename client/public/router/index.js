import Vue from 'vue';
import Router from 'vue-router';
import RideSearch from '../views/RideSearch';
import BidRide from '../views/BidRide';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: RideSearch,
    },
    {
      path: '/ride/:id',
      component: BidRide,
    }
  ],
});
