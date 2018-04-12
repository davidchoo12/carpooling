<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <p>Email: {{ user.email }}</p>
        <p>Name: {{ user.name }}</p>
        <p>Contact: {{ user.contact }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: this.$parent.user
    }
  }
}
</script>

<style>

</style>
