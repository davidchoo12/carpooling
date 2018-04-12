<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-9">
        <div>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ startLocation }}
          <br>
          <span
            class="oi oi-arrow-bottom"
            title="arrow bottom"
            aria-hidden="true" />
          <br>
          <span
            class="oi oi-map-marker"
            title="map marker"
            aria-hidden="true" />{{ endLocation }}
        </div>
        <span>Departing on {{ departureTimestamp }}</span>
        <br>
        <span>Arriving on {{ arrivalTimestamp }}</span>
        <br>
        <span>Bid closes on {{ bidCloseTimestamp }}</span>
      </div>
      <div class="col-3 text-center">
        <small>Minimum bid:</small>
        <br>
        <h5>{{ minBid }}</h5>
        <form @submit.prevent="submitForm">
          <label for="bid-input">I am willing to pay</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input
              id="bid-input"
              v-model="inputBid"
              type="number"
              class="form-control"
              required>
          </div>
          <button
            type="submit"
            class="btn btn-large btn-primary">
            BID NOW
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startLocation: '',
      endLocation: '',
      departureTimestamp: '',
      arrivalTimestamp: '',
      bidCloseTimestamp: '',
      minBid: '',
      vehicleModel: '',
      seatsLeft: '',
      inputBid: ''
    }
  },
  created () {
    fetch('/api/ride/' + this.$route.params.id, {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(ride => {
      this.startLocation = ride.start_location;
      this.endLocation = ride.end_location;
      this.departureTimestamp = this.formatDateString(new Date(ride.start_datetime));
      this.arrivalTimestamp = this.formatDateString(new Date(ride.end_datetime));
      this.bidCloseTimestamp = this.formatDateString(new Date(ride.bid_closing_time));
      this.minBid = ride.starting_bid;
      this.inputBid = parseFloat(this.minBid.substr(1));
    })
    .catch(err => this.$toasted.show(err));
  },
  methods: {
    formatDateString(d) {
      return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours >= 12 ? 'AM' : 'PM'}`;
    },
    submitForm() {
      fetch('/api/bid', {
        method: 'POST',
        body: JSON.stringify({
          ride_id: this.$route.params.id,
          amount: this.inputBid
        }),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(res => {
        if (res.redirected) {
          window.location.href = res.url;
        }
      })
      .catch(err => this.$toasted.show(err));
    }
  }
}
</script>

<style>
  .oi-map-marker:before {
    margin-right: 15px;
  }
</style>
