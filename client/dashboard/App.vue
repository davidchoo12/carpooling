<template>
  <div id="app">
    <navbar />
    <div class="container-fluid">
      <div class="row">
        <sidebar />
        <!-- <img src="./assets/logo.png"> -->
        <router-view class="col-sm-9 offset-sm-3 col-md-10 offset-md-2"/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default {
  name: 'App',
  components: {
    'navbar': Navbar,
    'sidebar': Sidebar
  }
};
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
* {
  box-sizing: border-box;
}
</style>
