<template>
  <div id="app">
    <navbar :user="user" />
    <router-view :user="user" />
  </div>
</template>

<script>
import Navbar from './components/Navbar';
export default {
  name: 'App',
  components: {
    'navbar': Navbar,
  },
  data () {
    return {
      user: null
    }
  },
  created () {
    fetch('/api/user', {
      credentials: 'same-origin'
    })
    .then(res => res.text())
    .then(body => {
      if (body)
        this.user = JSON.parse(body);
    });
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
</style>