<!-- @format -->

<template>
  <v-card flat id="familyEditGeneral">
    <v-card-title>
      Family Information
    </v-card-title>
    <v-card-text>
      <v-text-field
        id="name"
        label="Family Name"
        v-model="family.name"
      ></v-text-field>
      <v-text-field
        id="alias"
        label="Alias"
        v-model="family.alias"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="onSave" color="accent">
        Save
      </v-btn>
      <v-btn @click="onReset">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FamilyEditGeneral",
  data: function() {
    return {
      family: {
        id: null,
        name: "",
        alias: ""
      }
    };
  },
  mounted: function() {
    this.initLocalFamily();
  },
  computed: {
    computedFamily() {
      let families = this.$store.getters["Profiles/families"];
      return families[0];
    }
  },
  methods: {
    initLocalFamily: function() {
      this.family.id = this.computedFamily.id;
      this.family.name = this.computedFamily.name;
      this.family.alias =
        this.computedFamily.alias === undefined
          ? null
          : this.computedFamily.alias;
    },
    onSave: function() {
      this.$store.dispatch("Profiles/setFamily", this.family);
    },
    onReset: function() {
      this.family.alias = null;
    }
  }
};
</script>
