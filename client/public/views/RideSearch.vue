<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-6">
        <h2 class="search-form-title">Select your route</h2>
        <form
          class="search-form"
          @submit.prevent="updateList">
          <div class="form-group">
            <label for="start-location-input">Pick-up Location</label>
            <input
              id="start-location-input"
              v-model="formData.startLocation"
              type="text"
              class="form-control"
              required>
          </div>
          <div class="form-group">
            <label for="end-location-input">Drop-off Location</label>
            <input
              id="end-location-input"
              v-model="formData.endLocation"
              type="text"
              class="form-control"
              required>
          </div>
          <div class="form-group row">
            <div class="col-6">
              <label for="departure-date-input">Depart On</label>
              <input
                id="departure-date-input"
                v-model="formData.startDate"
                type="date"
                class="form-control">
            </div>
            <div class="col-6">
              <button
                class="btn btn-primary"
                type="submit">SEARCH
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-8">
        <RideSearchItem
          v-for="ride in rideList"
          :key="ride.id"
          :id="ride.id"
          :start-location="ride.startLocation"
          :end-location="ride.endLocation"
          :departure-timestamp="ride.departureTimestamp"
          :min-bid="ride.minBid"/>
      </div>
    </div>
  </div>
</template>

<script>
import RideSearchItem from '../components/RideSearchItem.vue';
export default {
  components: {
    'RideSearchItem': RideSearchItem
  },
  data () {
    return {
      formData: {
        startLocation: '',
        endLocation: '',
        startDate: ''
      },
      rideList: [
        // {
        //   id: '1',
        //   startLocation: 'Kent Ridge Street 11 Block 21 SG 521214',
        //   endLocation: 'Jurong East Street 21 Block 11 SG 521287',
        //   departureTimestamp: '4/11/2018 3:25 PM',
        //   minBid: '$20.00'
        // },
        // {
        //   id: '2',
        //   startLocation: 'Kent Ridge Street 11 Block 21 SG 521214',
        //   endLocation: 'Jurong East Street 21 Block 11 SG 521287',
        //   departureTimestamp: '4/11/2018 3:25 PM',
        //   minBid: '$20.00'
        // }
      ]
    }
  },
  created () {
    fetch('/api/ride/', {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(data => {
      data.forEach(ride => {
        let r = {};
        r.id = ride.id;
        r.startLocation = ride.start_location;
        r.endLocation = ride.end_location;
        const d = new Date(ride.start_datetime);
        r.departureTimestamp = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours >= 12 ? 'AM' : 'PM'}`;
        r.minBid = ride.min_success_bid || ride.starting_bid;
        this.rideList.push(r); // repopulate rideList
      })
    })
    .catch(err => this.$toasted.show(err));
  },
  methods: {
    updateList () {
      fetch('/api/ride/search', {
        method: 'POST',
        body: JSON.stringify(this.formData),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(res => res.json())
      .then(data => {
        this.rideList = []; // empty rideList
        data.forEach(ride => {
          let r = {};
          r.id = ride.id;
          r.startLocation = ride.start_location;
          r.endLocation = ride.end_location;
          const d = new Date(ride.start_datetime);
          r.departureTimestamp = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours() % 12}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours >= 12 ? 'AM' : 'PM'}`;
          r.minBid = ride.min_success_bid || ride.starting_bid;
          this.rideList.push(r); // repopulate rideList
        });
      })
      .catch(err => this.$toasted.show(err));
    }
  }
}
</script>

<style>
  .search-form .btn {
    position: absolute;
    right: 15px;
    bottom: 0;
  }
  .search-form {
    border: 1px solid #6f42c1;
    padding: 15px;
    margin-bottom: 30px;
  }
  .search-form-title {
    background-color: #6f42c1;
    color: white;
    margin: 0;
    margin-top: 15px;
    padding: 15px;
  }
</style>
