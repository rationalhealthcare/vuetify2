<!-- @format -->

<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card ref="results">
        <v-card-title>
          <p class="headline accent--text mb-0">
            Edit Family
          </p>
        </v-card-title>
        <v-card-text>
          <FamilyEditGeneral v-if="activeComponent === 0" />
          <FamilyEditConsultants v-if="activeComponent === 1" />
        </v-card-text>
        <v-bottom-navigation
          :input-value="drawer"
          v-model="activeComponent"
          color="accent"
          class="v-bottom-nav"
        >
          <v-btn :value="item.title" v-for="(item, i) in items" :key="i">
            <span>{{ item.text }}</span>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-card>
    </v-col>
  </v-row>
</template>
<style scoped>
.v-bottom-nav {
  box-shadow: none;
}
</style>
<script>
import FamilyEditGeneral from "@/components/FamilyEditGeneral.vue";
import FamilyEditConsultants from "@/components/FamilyEditConsultants.vue";
export default {
  name: "FamilyEditPage",
  components: { FamilyEditGeneral, FamilyEditConsultants },
  data: () => ({
    value: "General",
    activeComponent: 0,
    drawer: true,
    item: 0,
    items: [
      { text: "General", icon: "mdi-account-edit" },
      { text: "Consultants", icon: "mdi-stethoscope" },
      { text: "Locations", icon: "mdi-map-marker" }
    ],
    family: {
      name: null
    }
  }),
  mounted() {
    /*
          Retrieve the Consultant List once per session. The app keeps it in
          sync after that.
        */
    this.loadConsultantList();

    this.setActiveComponent();
  },

  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    activeComponent() {
      //cache this value in AppState
      this.$store.dispatch(
        "AppState/setConsultantActiveComponentIndex",
        this.activeComponent
      );
    }
  },
  methods: {
    onSave() {
      alert("saved");
    },
    onReset() {
      alert("reset");
    },
    loadConsultantList() {
      let isSynced = this.$store.getters[
        "AppState/consultantListSyncedToService"
      ];
      if (isSynced === false) {
        let families = this.$store.getters["Profiles/families"];
        let family = families[0];

        this.$store.dispatch("Profiles/loadConsultants", family.id);
        this.$store.dispatch("AppState/setConsultantListSyncedToService", true);
      }
    },
    setActiveComponent() {
      let consultant = this.$store.getters["AppState/consultant"];
      this.activeComponent = consultant.activeComponentIndex;
    }
  }
};
</script>
