<template>
  <div>
    <v-layout row>
      <v-flex xs12 md8 lg10>
        <v-card class="grey lighten-5" elevation="0">
          <v-card-text>
            <p class="headline mb-0">
              Navigation Drawer
            </p>
          </v-card-text>

          <v-radio-group v-model="selected">
            <v-radio
              v-for="(option, index) in this.navDrawerUserOptions"
              :key="index"
              :label="option.name"
              :value="option.key"
            ></v-radio>
          </v-radio-group>

          <v-card-text dense class="body-2">
            <v-switch
              label="Expand on hover"
              v-model="expandOnHover"
              persistent-hint
              hint="Applies to the mini variant. Expands the drawer when you hover
              over it, or tap it, if on a mobil device."
            >
            </v-switch>

            <v-switch
              label="Dense"
              v-model="dense"
              persistent-hint
              hint="Sets the navigation items closer together."
            >
            </v-switch>

            <v-switch
              label="Right"
              v-model="right"
              persistent-hint
              hint="Displays the navigation drawer on the right of the screen"
            >
            </v-switch>
          </v-card-text>

          <!-- BUTTONS -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="onApply" color="accent">
              Apply
            </v-btn>
            <v-btn text color="accent">
              Reset
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
"use strict";
export default {
  name: "NavDrawerPreferences",
  data: function() {
    return {
      selected: null,
      dense: true,
      right: true,
      expandOnHover: true
    };
  },
  mounted: function() {
    this.selected = this.$store.getters["AppState/navDrawerUserSettings"].key;
  },
  computed: {
    navDrawerUserOptions: function() {
      return this.$store.getters["UserPrefs/navDrawerUserOptions"];
    }
  },
  methods: {
    onApply: function() {
      var uid = this.$store.getters["Auth/user"].uid;
      var prefs = {
        navDrawerPreference: this.selected,
        navDrawerExpandOnHover: this.expandOnHover,
        navDrawerDense: this.dense,
        navDrawerRight: this.right
      };
      this.$store.dispatch(
        "UserPrefs/saveNavDrawerUserPreferences",
        prefs,
        uid
      );
    },
    onReset: function() {
      return null;
    }
  }
};
</script>
