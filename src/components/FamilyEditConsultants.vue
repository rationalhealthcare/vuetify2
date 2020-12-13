<!-- @format -->

<template>
  <v-card flat @click.stop="">
    <v-speed-dial
      direction="bottom"
      absolute
      top
      right
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <v-btn color="accent" dark fab small @click="fab = !fab">
          <!-- <v-icon v-if="fab"> -->
          <v-icon>
            mdi-menu
          </v-icon>
          <!--           <v-icon v-else>
            mdi-close
          </v-icon> -->
        </v-btn>
      </template>

      <v-btn fab dark small color="accent lighten-1" @click="clickedNew">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="accent lighten-1" @click="clickedDelete">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>

    <v-card-title>
      Consultants List
    </v-card-title>
    <v-card-text>
      <Consultants />
    </v-card-text>
  </v-card>
</template>

<script>
import Consultants from "@/components/Consultants.vue";
export default {
  name: "FamilyEditConsultants",
  components: { Consultants },
  data: function() {
    return {
      fab: true,
      practitionerNames: []
    };
  },
  computed: {
    consultants() {
      return this.$store.getters["Profiles/consultants"];
    },
    consultantListSyncedToService() {
      return this.$store.getters["AppSate/consultantListSyncedToService"];
    },
    familyId() {
      let families = this.$store.getters["Profiles/families"];
      return families[0].id;
    },
    selectedItem() {
      let profile = this.$store.getters["AppState/profile"];
      return profile.selectedItem;
    }
  },
  watch: {
    consultants() {
      this.setConsultantNameList();
    }
  },
  methods: {
    setConsultantNameList() {
      for (let item of this.consultants) {
        this.practitionerNames.push(item.firstname + " " + item.lastname);
      }
    },
    clickedNew() {
      this.$router.push({ path: "/consultant" });
    },

    /**
     *  clickedDelete
     * This method is "async" to enable the setShowConsultantDialog flag
     * to be set to false before deleting the consultant locally, then
     * setting it true again, so that the consultant details dialog does
     * not pop up unexpectedly after a consultant has been deleted.
     */
    async clickedDelete() {
      //build the payload: {npi, fid}
      let npi = this.selectedItem.npi;
      let fid = this.familyId;
      let name = this.selectedItem.firstname + " " + this.selectedItem.lastname;
      this.$store.dispatch("AppState/setShowConsultantDialog", false);
      await this.$store.dispatch("Profiles/deleteConsultant", {
        npi,
        fid,
        name
      });
      this.$store.dispatch("AppState/setShowConsultantDialog", true);
    },
    onItemSelect(value) {
      this.selectedItem = value;
    }
  }
};
</script>
