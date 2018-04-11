<template>
  <form @submit.prevent="submitForm">
    <div
      class="form-group row">
      <label class="col-sm-2 col-form-label">Passenger User Email</label>
      <div class="col-sm-10">
        <input
          v-model="formData.passenger_user_email"
          :readonly="$route.params.passenger_user_email"
          :class="{ 'form-control-plaintext': $route.params.passenger_user_email, 'form-control': !$route.params.passenger_user_email }"
          type="email"
          placeholder="passenger@gmail.com">
      </div>
    </div>
    <div
      class="form-group row">
      <label class="col-sm-2 col-form-label">Ride Id</label>
      <div class="col-sm-10">
        <input
          v-model="formData.ride_id"
          :readonly="$route.params.ride_id"
          :class="{ 'form-control-plaintext': $route.params.ride_id, 'form-control': !$route.params.ride_id }"
          type="number"
          placeholder="1">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Amount</label>
      <div class="col-sm-10">
        <input
          v-model="formData.amount"
          type="text"
          class="form-control"
          placeholder="$10.00">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Time</label>
      <div class="col-sm-10">
        <input
          v-model="formData.time"
          type="text"
          class="form-control"
          placeholder="2018-12-31 23:59">
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
        passenger_user_email: '',
        ride_id: '',
        amount: '',
        time: ''
      }
    }
  },
  created () {
    if(this.$route.params.passenger_user_email && this.$route.params.ride_id) {
      const passenger_user_email = this.$route.params.passenger_user_email;
      const ride_id = this.$route.params.ride_id;
      fetch('/api/bid/' + passenger_user_email + '/' + ride_id, {
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
      fetch('/api/bid', {
        method: this.$route.params.passenger_user_email && this.$route.params.ride_id ? 'PUT' : 'POST',
        body: JSON.stringify(this.formData),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
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