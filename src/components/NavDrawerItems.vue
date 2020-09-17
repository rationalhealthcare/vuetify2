<template>
  <v-list nav>
    <!-- NavDrawerHeader begins -->
    <v-list-item-group>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          <span class="white--text headline"></span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>AppDash</v-list-item-title>
          <v-list-item-subtitle>Douglas Green</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <!-- NavDrawerHeader ends -->

    <v-list-item-group v-for="(item, index) in items" :key="item.text">
      <v-list-item @click="clickme(item.clickAction)" link :to="item.to">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="item.divider" :key="index"></v-divider>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "NavDrawerItems",
  data() {
    return {
      drawer: true,
      group: null,
      items: [
        { text: "Item 1", icon: "mdi-flag" },
        { text: "Item 2", icon: "mdi-flag" },
        { text: "Item 3", icon: "mdi-flag" },
        {
          text: "Preferences",
          icon: "mdi-account-settings",
          to: "/preferences",
          divider: true
        },
        {
          text: "Sign Out",
          icon: "mdi-logout",
          clickAction: "signout"
        }
      ]
    };
  },
  methods: {
    clickme(clickAction) {
      if (clickAction === "signout") {
        this.$store.dispatch("Auth/signUserOut");
        this.$router.push({ path: "/signin" });
      }
    }
  }
};
</script>
