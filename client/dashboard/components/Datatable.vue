<template>
  <div
    v-if="tableData.length > 0"
    class="datatable">
    <table class="table table-striped">
      <thead>
        <tr>
          <th
            v-for="col in Object.keys(tableData[0])"
            :key="col"
            scope="col">
            {{ col }}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in tableData"
          :key="row.id">
          <th
            v-for="col in Object.keys(row)"
            v-if="col == 'id'"
            :key="col"
            scope="row">
            {{ row[col] }}
          </th>
          <td
            v-else>
            {{ row[col] }}
          </td>
          <td>
            <div
              class="btn-group"
              role="group"
              aria-label="Edit or Delete">
              <router-link
                :to="{ path: rowIdentifiers.map(e => row[e]).join('-') }"
                append
                tag="button"
                class="btn btn-outline-secondary btn-sm">Edit</router-link>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="deleteRow(row)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    dataUrl: {
      type: String,
      required: true
    },
    rowIdentifiers: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  created () {
    fetch(this.dataUrl, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(body => this.tableData = body);
  },
  methods: {
    deleteRow (row) {
      const reqBody = {};
      this.rowIdentifiers.forEach(e => reqBody[e] = row[e]);
      fetch(this.dataUrl, {
        method: 'DELETE',
        body: JSON.stringify(reqBody),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(res => res.text())
      .then(body => {
        this.$toasted.show(body);
        const index = this.tableData.indexOf(row);
        if(index > -1)
          this.tableData.splice(index, 1); // remove row
      })
      .catch(err => this.$toasted.show(err));
    }
  },
}
</script>
