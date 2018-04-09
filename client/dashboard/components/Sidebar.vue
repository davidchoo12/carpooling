<template>
  <div class="sidebar col-sm-3 col-md-2">
    <ul class="nav nav-sidebar">
      <!-- <li><router-link to="/">Overview</router-link></li> -->
      <li><router-link to="ride">Rides</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: 51px;
    bottom: 0;
    left: 0;
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f5f5f5;
  }
  .nav {
    flex-direction: column;
  }
  .nav > li {
    padding: 10px 0;
  }
</style>
