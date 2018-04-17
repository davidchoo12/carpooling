<template>
  <div class="container">
    <form @submit.prevent="submitForm">
      <div class="form-group row">
        <div class="col-6">
          <label for="start-location-input">Pick-up Location</label>
          <input
            id="start-location-input"
            v-model="formData.start_location"
            type="text"
            class="form-control"
            required>
        </div>
        <div class="col-6">
          <label for="start-datetime-input">Pick-up Timestamp</label>
          <input
            id="start-datetime-input"
            v-model="formData.start_datetime"
            type="datetime-local"
            class="form-control"
            required>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-6">
          <label for="end-location-input">Destination</label>
          <input
            id="end-location-input"
            v-model="formData.end_location"
            type="text"
            class="form-control"
            required>
        </div>
        <div class="col-6">
          <label for="end-datetime-input">Arrival Timestamp</label>
          <input
            id="end-datetime-input"
            v-model="formData.end_datetime"
            type="datetime-local"
            class="form-control"
            required>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-3">
          <label for="pax-input">Pax</label>
          <input
            id="pax-input"
            v-model="formData.pax"
            min="2"
            max="6"
            type="number"
            class="form-control"
            required>
        </div>
        <div class="col-3">
          <label for="starting-bid-input">Starting bid</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input
              id="starting-bid-input"
              v-model="formData.starting_bid"
              type="number"
              class="form-control"
              required>
          </div>
        </div>
        <div class="col-3">
          <label for="bid-closing-time-input">Bid Closing Time</label>
          <input
            id="bid-closing-time-input"
            v-model="formData.bid_closing_time"
            type="datetime-local"
            class="form-control"
            required>
        </div>
        <div class="col-3">
          <label>Vehicle</label>
          <div
            v-for="v in vehicles"
            :key="v.car_plate"
            class="form-check">
            <input
              id="vehicle-radio"
              v-model="formData.vehicle_car_plate"
              :value="v.car_plate"
              class="form-check-input"
              type="radio"
              required>
            <label
              class="form-check-label"
              for="vehicle-radio">
              {{ v.car_plate }}
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="btn btn-primary">Save
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      vehicles: [],
      formData: {
        start_location: '',
        start_datetime: '',
        end_location: '',
        end_datetime: '',
        pax: 4,
        starting_bid: '',
        bid_closing_time: '',
        vehicle_car_plate: ''
      }
    }
  },
  created () {
    if (!this.$parent.user) {
      this.$router.push('/login/driver');
    }
    fetch('/api/vehicle', {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => {
      this.vehicles = data;
    })
    .catch(this.$toasted.show);
  },
  methods: {
    submitForm () {
      fetch('/api/ride', {
        method: this.isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify({...this.formData, driver_ic_num: this.$parent.user.ic_num}), // submit with ic_num
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(this.$router.push('/myrides'))
      .catch(this.$toasted.show);
    }
  }
}
</script>

<style>

</style>