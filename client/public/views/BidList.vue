<template>
  <div class="container">
    <div
      v-for="bid in bidList"
      :key="bid"
      class="item row justify-content-center">
      <div class="col-9">
        <p>Bid amount: {{ bid.amount }}</p>
        <p>Bid time: {{ bid.time }}</p>
        <div>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ bid.ride.startLocation }}
          <br>
          <span
            class="oi oi-arrow-bottom"
            title="arrow bottom"
            aria-hidden="true" />
          <br>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ bid.ride.endLocation }}
        </div>
        <small>Depart at:</small>
        <br>
        <span>{{ bid.ride.departureTimestamp }}</span>
      </div>
      <div class="col-3 text-center">
        <router-link
          :to="'ride/' + bid.id"
          class="btn btn-large btn-primary">
          Update Bid
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bidList: []
    }
  },
  created () {
    if (!this.$parent.user) {
      this.$router.push('/login');
    }
    console.log(this.formatDateString);
    fetch('/api/bid/' + this.$parent.user.email, {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => {
      data.forEach(bid => {
        let r = {};
        r.id = bid.ride_id;
        r.amount = bid.amount;
        const t = new Date(bid.time);
        r.time = this.formatDateString(t);
        r.ride = {};
        r.ride.startLocation = bid.ride.start_location;
        r.ride.endLocation = bid.ride.end_location;
        const d = new Date(bid.ride.start_datetime);
        r.ride.departureTimestamp = this.formatDateString(d);
        this.bidList.push(r); // repopulate bidList
      })
    })
    .catch(err => this.$toasted.show(err));
  },
  methods: {
    formatDateString(d) {
      return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours >= 12 ? 'AM' : 'PM'}`;
    }
  }
}
</script>

<style>

</style>
