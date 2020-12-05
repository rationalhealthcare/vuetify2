<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card>
        <!--  -->
        <v-card-actions>
          <v-fab-transition>
            <v-btn
              @click="clickedEdit"
              v-show="!hidden"
              color="accent"
              dark
              xabsolute
              xtop
              xright
              fab
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-fab-transition>
          <!--  -->
          <!--  -->
          <v-fab-transition>
            <v-btn
              @click="clickedNew"
              v-show="!hidden"
              color="accent"
              dark
              absolute
              xtop
              right
              fab
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-card-actions>
        <!--  -->

        <v-card-title>
          <p class="headline accent--text mb-0">
            My Family
          </p>
        </v-card-title>
        <v-card-text id="">
          <v-row>
            <v-col
              md="6"
              xs="12"
              v-for="(profile, index) in profiles"
              :key="index"
            >
              <ProfileCard :profile="profiles[index]" :family="families[0]" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

/* */

<script>
import ProfileCard from "@/components/ProfileCard.vue";
export default {
  name: "Profiles",
  components: { ProfileCard },
  props: ["profile", "family"],
  data() {
    return {
      hidden: false,
      myquote: {
        text:
          "If we had no winter, the spring would not be so pleasant; if we did not sometimes taste of adversity, prosperity would not be so welcome.",
        author: "Anne Bradstreet"
      }
    };
  },
  mounted() {
    /*     this.setFamilies();
    this.setProfiles(); */
  },
  computed: {
    families() {
      return this.$store.getters["Profiles/families"];
    },
    profiles() {
      return this.$store.getters["Profiles/profiles"];
    }
  },
  watch: {},
  methods: {
    clickedNew() {
      this.$router.push("/newprofile");
    },
    clickedEdit() {
      this.$router.push("/family/edit");
    }
  }
};
</script>
