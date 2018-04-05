<template>
  <div>
    <router-link
      to="/user/new"
      class="btn btn-primary">Add user</router-link>
    <datatable
      :row-identifiers="['email']"
      data-url="/api/user"
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
