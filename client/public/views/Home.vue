<template>
  <Profile v-if="user && user.role == 'driver'"/>
  <RideSearch v-else/>
</template>

<script>
import RideSearch from './RideSearch';
import Profile from './Profile';
export default {
  components: {
    RideSearch: RideSearch,
    Profile: Profile
  },
  props: {
    user: {
      type: Object,
      default: null,
      required: false
    }
  }
}
</script>

<style>

</style>
