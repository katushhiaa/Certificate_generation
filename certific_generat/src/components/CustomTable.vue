<template>
    <div>
      <p>This components extends the
        <code>b-table</code> and pass allong all props except the
        <code>items</code> one, in which we add our dynamic className allowing colors.
      </p>
      <p>Passed items : <br />
      <pre>{{ JSON.stringify(items) }}</pre>
      </p>
      <p>Passed fields : <br />
      <pre>{{ JSON.stringify(fields) }}</pre><br />Note that the <code>admin</code> field 
      doesn't exist in the <code>items</code>, it's filled via a slot template and 
      therefore cannot be styled despite out best efforts.
      </p>
      <b-table striped bordered :items="itemsWithColumnClasses" v-bind="$props">
        <template v-slot:admin="data" >{{ data.item.role === 2 ? "No" : "Yes" }}</template>
      </b-table>
    </div>
  </template>
  
  <script>
import { BTable } from "bootstrap-vue";
  
  export default {
    name: "CustomTable",
    extends: BTable,
    computed: {
      itemsWithColumnClasses() {
        let items = this.items;
        items = this.addRoleColumnColorClassName(items);
        // doesn't work since admin is not a real field
        // this doesn't remove the previous styles since our method merges value
        items = this.addAdminColumnColorClassName(items);
        return items;
      }
    },
    methods: {
      addRoleColumnColorClassName(items) {
        return this._addColumnColorClasses(items, "role", {
          2: "danger",
          _default: "success"
        });
      },
      addAdminColumnColorClassName(items) {
        return this._addColumnColorClasses(items, "admin", {
          Yes: "success",
          No: "danger"
        });
      },
      _addColumnColorClasses(items, field_key, mapping) {
        let itemsWithVariants = items.map(elm => {
          let _cellVariants = { ...elm._cellVariants }; // keep existing
          const value = elm[field_key]; // grab value for mapping lookup
          // if a value exists in the mapping table, use it or fallback to a default if one has been provided
          _cellVariants[field_key] =
            mapping[value] !== undefined ? mapping[value] : mapping._default;
          // return the themed cell
          return {
            ...elm,
            _cellVariants // shortcut syntax
          };
        });
        // console.log( itemsWithVariants );
        return itemsWithVariants;
      }
    }
  };
  </script>