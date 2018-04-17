<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <p><b>Email: </b>{{ user.email }}</p>
        <p><b>Name: </b>{{ user.name }}</p>
        <p><b>Contact: </b>{{ user.contact }}</p>
      </div>
    </div>
    <h3 v-if="user && user.role == 'driver'">My vehicles</h3>
    <div
      v-if="user && user.role == 'driver'"
      class="row">
      <div class="col-12 row mb-3">
        <div
          v-for="v in vehicles"
          :key="v.car_plate"
          class="col-6">
          <p><b>Car Plate: </b>{{ v.car_plate }}</p>
          <p><b>Model: </b>{{ v.model }}</p>
          <p><b>Seats: </b>{{ v.seat }}</p>
          <button
            class="btn btn-primary"
            @click="showUpdateForm(v.car_plate, v.model, v.seat)">Update</button>
          <button
            class="btn btn-danger"
            @click="deleteVehicle(v.car_plate)">Delete</button>
        </div>
      </div>
      <div class="col-12 row">
        <button
          v-if="isFormAvailable && !isFormVisible"
          class="btn btn-primary"
          @click="isFormVisible = true; formData.isUpdateForm = false">
          + Add Vehicle
        </button>
        <form
          v-if="isFormVisible"
          class="col-12 form-inline"
          @submit.prevent="submitForm">
          <div class="form-group mr-3">
            <input
              v-model="formData.car_plate"
              :readonly="formData.isUpdateForm"
              :class="{ 'form-control-plaintext': formData.isUpdateForm, 'form-control': !formData.isUpdateForm }"
              type="text"
              placeholder="Car Plate"
              required>
          </div>
          <div class="form-group mr-3">
            <input
              v-model="formData.model"
              class="form-control"
              type="text"
              placeholder="Car Model"
              required>
          </div>
          <div class="form-group mr-3">
            <input
              v-model="formData.seat"
              class="form-control"
              type="number"
              placeholder="Car Seats"
              required>
          </div>
          <button
            type="submit"
            class="btn btn-primary mr-2">
            Save
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="isFormVisible = false">
            Cancel
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
      user: this.$parent.user,
      vehicles: [],
      isFormAvailable: true,
      isFormVisible: false,
      formData: {
        car_plate: '',
        model: '',
        seat: '',
        isUpdateForm: false
      }
    }
  },
  created () {
    if (!this.$parent.user) {
      this.$router.push('/login');
    }
    this.updateVehicles();
  },
  methods: {
    submitForm () {
      fetch('/api/vehicle', {
        method: this.formData.isUpdateForm ? 'PUT' : 'POST',
        body: JSON.stringify({...this.formData, driver_ic_num: this.user.ic_num}), // submit with ic_num
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(this.updateVehicles)
      .catch(this.$toasted.show);
    },
    updateVehicles () {
      if (this.user && this.user.role == 'driver') {
        // reset form
        this.isFormVisible = false;
        this.formData = {
          car_plate: '',
          model: '',
          seat: '',
          isUpdateForm: false
        };
        fetch('/api/vehicle', {
          credentials: 'same-origin'
        })
        .then(res => res.json())
        .then(data => {
          this.vehicles = data;
          this.isFormAvailable = data.length < 2;
        })
        .catch(this.$toasted.show);
      }
    },
    showUpdateForm (car_plate, model, seat) {
      this.formData = { car_plate, model, seat };
      this.formData.isUpdateForm = true;
      this.isFormVisible = true;
    },
    deleteVehicle (car_plate) {
      fetch('/api/vehicle', {
        method: 'DELETE',
        body: JSON.stringify({car_plate: car_plate}),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(this.updateVehicles)
      .catch(this.$toasted.show);
    }
  }
}
</script>

<style>

</style>
