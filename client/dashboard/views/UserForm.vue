<template>
  <form @submit.prevent="submitForm">
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input
          v-model="formData.email"
          :readonly="$route.params.email"
          :class="{ 'form-control-plaintext': $route.params.email, 'form-control': !$route.params.email }"
          type="email"
          placeholder="johndoe@gmail.com">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Password</label>
      <div class="col-sm-10">
        <input
          v-model="formData.password"
          type="password"
          class="form-control"
          placeholder="Password (minimum 8 characters)"
          minlength="8">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-10">
        <input
          v-model="formData.name"
          type="text"
          class="form-control"
          placeholder="John Doe">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">Contact</label>
      <div class="col-sm-10">
        <input
          v-model.number="formData.contact"
          type="text"
          class="form-control"
          placeholder="81234567">
      </div>
    </div>
    <button
      type="submit"
      class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        email: '',
        password: '',
        name: '',
        contact: ''
      }
    }
  },
  created () {
    if(this.$route.params.email) {
      const email = this.$route.params.email;
      fetch('/api/user/' + email)
        .then(res => res.json())
        .then(body => {
          Object.assign(this.formData, body);
        });
    }
  },
  methods: {
    submitForm () {
      fetch('/api/user', {
        method: this.$route.params.email ? 'PUT' : 'POST',
        body: JSON.stringify(this.formData),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.text())
      .then(body => this.$toasted.show(body, {
        action: {
          text: '✕',
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        }
      }))
      .catch(err => this.$toasted.show(err));
    }
  }
}
</script>
