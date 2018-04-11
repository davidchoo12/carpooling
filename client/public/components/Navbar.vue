<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a
      href=""
      class="navbar-brand">
      <img src="img/logopopo.jpg">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown">
      <span class="navbar-toggler-icon" />
    </button>
    <div
      id="navbarNavDropdown"
      class="collapse navbar-collapse justify-content-end">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            href=""
            class="nav-link">Login
          </a>
        </li>
        <li class="nav-item">
          <a
            href=""
            class="nav-link">Register
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import 'bootstrap/dist/js/bootstrap.min.js';
export default {
  name: 'Navbar'
}
</script>

<style scoped>
  .navbar-brand img {
    height: 40px;
  }
</style>
