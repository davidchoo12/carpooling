<template>
  <div class="item row justify-content-center">
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
      <small>Depart at:</small>
      <br>
      <span>{{ departureTimestamp }}</span>
    </div>
    <div class="col-3 text-center">
      <small>Minimum bid:</small>
      <br>
      <h5>{{ minBid }}</h5>
      <button class="btn btn-large btn-primary">
        BID NOW!!!!
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RideSearchItem',
  props: {
    id: {
      type: String,
      required: true
    },
    startLocation: {
      type: String,
      required: true
    },
    endLocation: {
      type: String,
      required: true
    },
    departureTimestamp: {
      type: String,
      required: true
    },
    minBid: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
  .item {
    border-bottom: 1px solid grey;
    padding: 15px;
  }
  .oi-map-marker:before {
    margin-right: 15px;
  }
</style>
