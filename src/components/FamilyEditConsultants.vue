<!-- @format -->

<template>
  <v-card flat>
    <v-speed-dial
      direction="bottom"
      absolute
      top
      right
      transition="slide-y-transition"
    >
      <template v-slot:activator>
        <v-btn color="accent" dark fab small @click="fab = !fab">
          <v-icon v-if="fab">
            mdi-menu
          </v-icon>
          <v-icon v-else>
            mdi-close
          </v-icon>
        </v-btn>
      </template>

      <v-btn fab small color="accent lighten-1" @click="clickedDetails">
        <v-icon>mdi-car</v-icon>
      </v-btn>
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
      <Consultants :showDialog="true" @selectedItem="onItemSelect" />
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
      practitionerNames: [],
      selectedItem: null,
      showDialog: false
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
    getConsultants() {},
    clickedNew() {
      this.$router.push({ path: "/consultant" });
    },
    clickedDelete() {
      //build the payload: {npi, fid}
      let npi = this.selectedItem.npi;
      let fid = this.familyId;
      let name = this.selectedItem.firstname + " " + this.selectedItem.lastname;
      this.$store.dispatch("Profiles/deleteConsultant", {
        npi,
        fid,
        name
      });
    },
    onItemSelect(value) {
      this.selectedItem = value;
    },
    clickedDetails() {
      this.showDialog = true;
    }
  }
};
</script>
