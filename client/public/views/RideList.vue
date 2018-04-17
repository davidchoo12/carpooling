<template>
  <div class="container">
    <h3>My Rides</h3>
    <router-link
      to="/myrides/add"
      class="btn btn-primary">+ Add Ride
    </router-link>
    <div class="row">
      <span v-if="!rides.length">You have no rides</span>
      <div
        v-for="r in rides"
        :key="r.id"
        class="col-4">
        <div>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ r.start_location }}
          <br>
          <span
            class="oi oi-arrow-bottom"
            title="arrow bottom"
            aria-hidden="true" />
          <br>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ r.end_location }}
        </div>
        <small>Depart at:</small>
        <br>
        <span>{{ r.start_datetime }}</span>
        <br>
        <small>Arrive at:</small>
        <br>
        <span>{{ r.end_datetime }}</span>
        <br>
        <small>Pax:</small>
        <br>
        <span>{{ r.pax }}</span>
        <br>
        <small>Starting bid:</small>
        <br>
        <span>{{ r.starting_bid }}</span>
        <br>
        <small>Bid closing time:</small>
        <br>
        <span>{{ r.bid_closing_time }}</span>
        <br>
        <small>Vehicle:</small>
        <br>
        <span>{{ r.vehicle_car_plate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rides: []
    }
  },
  created () {
    if (!this.$parent.user) {
      this.$router.push('/login/driver');
    }
    fetch('/api/ride', {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => this.rides = data)
    .catch(this.$toasted.show);
  }
}
</script>

<style>

</style>
