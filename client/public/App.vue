<template>
  <div id="app">
    <navbar />
    <router-view class="col-sm-9 offset-sm-3 col-md-10 offset-md-2"/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
export default {
  name: 'App',
  components: {
    'navbar': Navbar,
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
</style>