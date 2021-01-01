<!-- @format -->

<template>
  <v-sheet>
    <v-tabs :value="selectedtab">
      <v-tab>Select </v-tab>
      <v-tab>Key In</v-tab>
    </v-tabs>
    <v-text-field
      id=""
      label="Doctor or organization name"
      vv-model=""
    ></v-text-field>
    <v-text-field id="" label="Address" vv-model=""></v-text-field>
  </v-sheet>
</template>

/* */
<script>
export default {
  name: "AppointmentNewConsultant",
  data: function() {
    return {
      selectedtab: 2
    };
  }
};
</script>
