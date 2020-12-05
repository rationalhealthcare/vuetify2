<!-- @format -->

<template>
  <v-card flat>
    <v-card-subtitle>
      General Family Information
    </v-card-subtitle>
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
  </v-card>
</template>

<script>
export default {
  name: "FamilyEditGeneral",
  data: function() {
    return {
      family: {
        name: "",
        alias: ""
      }
    };
  }
};
</script>
