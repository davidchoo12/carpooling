import Vue from 'vue';
import Router from 'vue-router';
import Vehicles from '@/views/Vehicles';
import VehicleForm from '@/views/VehicleForm';
import Rides from '@/views/Rides';
import RideForm from '@/views/RideForm';
import Bids from '@/views/Bids';
import BidForm from '@/views/BidForm';
// import Datatable from '@/components/Datatable';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/vehicle',
      component: Vehicles,
    },
    {
      path: '/vehicle/new',
      component: VehicleForm,
    },
    {
      path: '/vehicle/:id',
      component: VehicleForm,
    },
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
    {
      path: '/bid',
      component: Bids,
    },
    {
      path: '/bid/new',
      component: BidForm,
    },
    {
      path: '/bid/:passenger_user_email/:ride_id',
      component: BidForm,
    },
  ],
});
