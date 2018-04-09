<template>
  <div>
    <router-link
      to="/bid/new"
      class="btn btn-primary">Add bid</router-link>
    <datatable
      :row-identifiers="['passenger_user_email', 'ride_id']"
      data-url="/api/bid"
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
