<template>
  <div>
    <router-link
      to="/vehicle/new"
      class="btn btn-primary">Add Vehicle</router-link>
    <datatable
      :row-identifiers="['car_plate']"
      :columns="['Car plate', 'Model', 'Seat', 'Driver IC Number']"
      data-url="/api/vehicle"
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