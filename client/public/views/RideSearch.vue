<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-8">
        <RideSearchItem
          v-for="ride in rideList"
          :key="ride"
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
  data() {
    return {
      rideList: [
        {
          id: 1,
          startLocation: 'Kent Ridge Street 11 Block 21 SG 521214',
          endLocation: 'Jurong East Street 21 Block 11 SG 521287',
          departureTimestamp: '4/11/2018 3:25 PM',
          minBid: '$20.00'
        },
        {
          id: 2,
          startLocation: 'Kent Ridge Street 11 Block 21 SG 521214',
          endLocation: 'Jurong East Street 21 Block 11 SG 521287',
          departureTimestamp: '4/11/2018 3:25 PM',
          minBid: '$20.00'
        }
      ]
    }
  }
}
</script>

<style>

</style>
