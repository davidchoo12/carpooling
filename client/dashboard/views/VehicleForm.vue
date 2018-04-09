<template>
  <form @submit.prevent="submitForm">
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Car plate</label>
      <div class="col-sm-10">
        <input
          v-model="$route.params.car_plate"
          class="form-control-plaintext"
          type="text"
          minlength="8"
          maxlength="8"
          placeholder="ABC1234D">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Model</label>
      <div class="col-sm-10">
        <input
          v-model="formData.model"
          type="text"
          class="form-control"
          placeholder="Toyota Camry">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Seat</label>
      <div class="col-sm-10">
        <input
          v-model="formData.seat"
          type="number"
          class="form-control"
          min="1"
          max="4"
          placeholder="4">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Driver IC Number</label>
      <div class="col-sm-10">
        <input
          v-model="formData.driver_ic_num"
          type="text"
          class="form-control"
          minlength="9"
          maxlength="9"
          placeholder="S1234567X">
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
        car_plate: '',
        model: '',
        seat: '',
        driver_ic_num: ''
      }
    }
  },
  created () {
    if(this.$route.params.id) {
      const id = this.$route.params.id;
      fetch('/api/vehicle/' + id)
        .then(res => res.json())
        .then(body => {
          Object.assign(this.formData, body);
        });
    }
  },
  methods: {
    submitForm () {
      fetch('/api/vehicle', {
        method: this.$route.params.id ? 'PUT' : 'POST',
        body: JSON.stringify(this.formData),
        headers: {
          'content-type': 'application/json'
        }
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