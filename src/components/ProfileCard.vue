<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          {{ family.name }}
        </div>
        <v-list-item-title class="headline accent--text mb-1">
          <!-- {{ profile.name }} -->
          {{ fname }}
        </v-list-item-title>
        <v-list-item-subtitle> </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar round size="80" color="secondary">
        <span class="mb-2" v-if="profile.avatarpath">
          <img :src="profile.avatarpath" :alt="profile.name" />
        </span>
        <span v-else>
          {{ profile.initials }}
        </span>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-btn xoutlined xrounded text @click="clickedEdit">
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
/* */

<script>
export default {
  name: "ProfileCard",
  props: ["profile", "family"],
  computed: {
    fname() {
      let namearr = this.profile.name.split(" ");
      return namearr[0];
    }
  },
  methods: {
    clickedEdit() {
      this.$store.commit("AppState/setEditingProfileId", this.profile.id);
      this.$router.push("/editprofile");
    }
  }
};
</script>
