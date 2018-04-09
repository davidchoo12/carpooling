<template>
  <div>
    <router-link
      to="/user/new"
      class="btn btn-primary">Add ride</router-link>
    <datatable
      :row-identifiers="['id']"
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
