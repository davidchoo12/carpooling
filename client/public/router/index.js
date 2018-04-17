import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
// import RideSearch from '../views/RideSearch';
import BidRide from '../views/BidRide';
import Profile from '../views/Profile';
import BidList from '../views/BidList';
import RideList from '../views/RideList';
import RideForm from '../views/RideForm';
import Login from '../views/Login';
import Register from '../views/Register';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      props: true
    },
    {
      path: '/ride/:id',
      component: BidRide,
      props: true
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/mybids',
      component: BidList
    },
    {
      path: '/myrides',
      component: RideList
    },
    {
      path: '/myrides/add',
      component: RideForm
    },
    {
      path: '/myrides/:id',
      component: RideForm,
      props: { isUpdate: true }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/login/driver',
      component: Login,
      props: { forDriver: true }
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/register/driver',
      component: Register,
      props: { forDriver: true }
    }
  ],
});
