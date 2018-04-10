<template>
  <form @submit.prevent="submitForm">
    <div
      v-if="$route.params.id"
      class="form-group row">
      <label class="col-sm-2 col-form-label">Id</label>
      <div class="col-sm-10">
        <input
          v-model="$route.params.id"
          readonly
          class="form-control-plaintext"
          type="text"
          placeholder="1">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Start Location</label>
      <div class="col-sm-10">
        <input
          v-model="formData.start_location"
          type="text"
          class="form-control"
          placeholder="COM1 Computing Drive">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Start Datetime</label>
      <div class="col-sm-10">
        <input
          v-model="formData.start_datetime"
          type="datetime-local"
          class="form-control"
          placeholder="2018-12-31 23:59">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">End Location</label>
      <div class="col-sm-10">
        <input
          v-model="formData.end_location"
          type="text"
          class="form-control"
          placeholder="COM2 Computing Drive">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">End Datetime</label>
      <div class="col-sm-10">
        <input
          v-model="formData.end_datetime"
          type="datetime-local"
          class="form-control"
          placeholder="2018-12-31 23:59">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Pax</label>
      <div class="col-sm-10">
        <input
          v-model.number="formData.pax"
          type="number"
          class="form-control"
          placeholder="4">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Starting bid</label>
      <div class="col-sm-10">
        <input
          v-model.number="formData.starting_bid"
          type="text"
          class="form-control"
          placeholder="10">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Bid closing time</label>
      <div class="col-sm-10">
        <input
          v-model="formData.bid_closing_time"
          type="datetime-local"
          class="form-control"
          placeholder="2018-12-01 23:59">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Driver IC number</label>
      <div class="col-sm-10">
        <input
          v-model.number="formData.driver_ic_num"
          type="text"
          max-length="9"
          class="form-control"
          placeholder="S1234567X">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Vehicle Car Plate</label>
      <div class="col-sm-10">
        <input
          v-model.number="formData.vehicle_car_plate"
          type="text"
          max-length="8"
          class="form-control"
          placeholder="S1234ABC">
      </div>
    </div>
    <button
      type="submit"
      class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        start_location: '',
        start_datetime: '',
        end_location: '',
        end_datetime: '',
        pax: '',
        starting_bid: '',
        bid_closing_time: '',
        driver_ic_num: '',
        vehicle_car_plate: ''
      }
    }
  },
  created () {
    if(this.$route.params.id) {
      const id = this.$route.params.id;
      fetch('/api/ride/' + id, {
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .then(body => {
          Object.assign(this.formData, body);
        });
    }
  },
  methods: {
    submitForm () {
      fetch('/api/ride', {
        method: this.$route.params.id ? 'PUT' : 'POST',
        body: JSON.stringify(this.formData),
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json'
        },
      })
      .then(res => res.text())
      .then(body => this.$toasted.show(body, {
        action: {
          text: '✕',
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        }
      }))
      .catch(err => this.$toasted.show(err));
    }
  }
}
</script>