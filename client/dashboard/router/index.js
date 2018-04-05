import Vue from 'vue';
import Router from 'vue-router';
import Users from '@/views/Users';
import UserForm from '@/views/UserForm';
// import Datatable from '@/components/Datatable';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/user',
      component: Users,
    },
    {
      path: '/user/new',
      component: UserForm,
    },
    {
      path: '/user/:email',
      component: UserForm,
    },
  ],
});
