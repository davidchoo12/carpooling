<template>
  <div>
    <router-link
      to="/ride/new"
      class="btn btn-primary">Add ride</router-link>
    <datatable
      :row-identifiers="['id']"
      :columns="['Id', 'Start Location', 'Start Datetime', 'End Location', 'End Datetime', 'Pax', 'Starting Bid', 'Bid Closing Time', 'Driver IC Number', 'Vehicle Car Plate']"
      data-url="/api/ride"
    />
  </div>
</template>

<script>
import Datatable from '@/components/Datatable';
export default {
  components: {
    'datatable': Datatable
  }
}
</script>
