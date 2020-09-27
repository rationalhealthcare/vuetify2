<template>
  <v-list nav>
    <!-- NavDrawerHeader begins -->
    <v-list-item-group>
      <v-list-item two-line>
        <v-list-item-avatar v-if="profile">
          <div v-if="profile.avatarpath">
            <v-img :src="profile.avatarpath" />
            <span class="white--text headline"></span>
          </div>
          <div v-else>
            <v-icon color="accent">
              {{ profile.initials }}
            </v-icon>
          </div>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Kērgiva</v-list-item-title>
          <v-list-item-subtitle>{{ profile.name }}</v-list-item-subtitle>
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
      profile: null,
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
  computed: {
    profiles: function() {
      let profiles = this.$store.getters["Profiles/profiles"];
      if (profiles) {
        return profiles;
      } else {
        return null;
      }
    }
  },
  watch: {
    profiles() {
      this.profile = this.profiles[0];
    }
  },
  methods: {
    clickme(clickAction) {
      if (clickAction === "signout") {
        this.$store.dispatch("Auth/signUserOut");
        this.$store.commit("Profiles/signOut");
        this.$router.push({ component: "Home" });
      }
    }
  }
};
</script>
