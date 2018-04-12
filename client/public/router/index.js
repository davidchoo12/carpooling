import Vue from 'vue';
import Router from 'vue-router';
import RideSearch from '../views/RideSearch';
import BidRide from '../views/BidRide';
import Profile from '../views/Profile';
import BidList from '../views/BidList';

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
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/mybids',
      component: BidList
    }
  ],
});
