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
          <label
            v-if="updatingBid"
            for="bid-input">Updating my bid</label>
          <label
            v-else
            for="bid-input">I am willing to pay</label>
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
            v-if="!updatingBid"
            type="submit"
            class="btn btn-large btn-primary">
            BID NOW
          </button>
          <button
            v-if="updatingBid"
            type="submit"
            class="btn btn-large btn-primary">
            Update
          </button>
          <button
            v-if="updatingBid"
            type="button"
            class="btn btn-large btn-danger"
            @click="deleteBid">
            Delete bid
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
      required: false
    }
  },
  data () {
    return {
      updatingBid: false,
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
  // watch: {
  //   user: {
  //     function (oldUser, newUser) {
  //       console.log('watch user', oldUser, newUser);
  //       if (newUser) {
  //         fetch('/api/bid/' + newUser.email + '/' + this.$route.params.id, {
  //           credentials: 'same-origin'
  //         })
  //         .then(res => res.json())
  //         .then(body => {
  //           if (body.amount) {
  //             this.updatingBid = true;
  //             this.inputBid = body.amount;
  //           }
  //         })
  //         .catch(err => this.$toasted.show(err));
  //       }
  //     },
  //     deep: true
  //   }
  // },
  created () {
    if (this.$parent.user) {
      fetch('/api/bid/' + this.$parent.user.email + '/' + this.$route.params.id, {
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(body => {
        if (body.amount) {
          this.updatingBid = true;
          this.inputBid = parseFloat(body.amount.substr(1));
        }
      })
      .catch(err => this.$toasted.show(err));
    }
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
      this.minBid = ride.min_success_bid || ride.starting_bid;
      this.inputBid = this.inputBid ? this.inputBid : parseFloat(this.minBid.substr(1)); // set input bid if not yet set
    })
    .catch(err => this.$toasted.show(err));
  },
  methods: {
    formatDateString(d) {
      return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours >= 12 ? 'AM' : 'PM'}`;
    },
    submitForm() {
      fetch('/api/bid', {
        method: this.updatingBid ? 'PUT' : 'POST',
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
          this.$router.push('/login');
        } else {
          return res.text();
        }
      })
      .then(body => {
        this.$toasted.show(body);
        this.$router.push('/mybids');
      })
      .catch(err => this.$toasted.show(err));
    },
    deleteBid() {
      console.log('delete bid');
      fetch('/api/bid', {
        method: 'DELETE',
        body: JSON.stringify({
          ride_id: this.$route.params.id
        }),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(res => {
        if (res.redirected) {
          this.$router.push('/login');
        } else {
          return res.text();
        }
      })
      .then(body => {
        this.$toasted.show(body);
        this.$router.push('/mybids');
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
