<!-- @format -->
<script>
export default {
  data: () => {
    return {
      dialog: false,
      selected: 0
    };
  },
  computed: {
    items() {
      return this.$store.getters["Consultant/consultantSearchResults"];
    },
    selectedItem() {
      return this.items[this.selected];
    },
    contactDetails() {
      return this.$store.getters["Consultant/contactDetails"];
    },
    loading() {
      return this.$store.getters.loading;
    },
    family() {
      let families = this.$store.getters["Profiles/families"];
      return families[0];
    }
  },
  watch: {
    selectedItem() {
      if (this.selectedItem) {
        this.$store.dispatch(
          "Consultant/getContactDetails",
          this.selectedItem.npi
        );
      }
    },
    contactDetails() {
      this.showDialog();
    }
  },
  methods: {
    onChoose() {
      let selected = this.selectedItem;
      selected["familyid"] = this.family.id;
      selected["addresses"] = this.contactDetails;
      this.$store.dispatch("Profiles/setConsultant", selected);
      this.$router.push({ path: "/family/edit" });
    },
    showDialog() {
      this.dialog = true;
    }
  }
};
</script>
<template>
  <v-card class="mx-auto" max-width="500">
    <v-toolbar color="secondary" dark>
      <v-toolbar-title>Search Results</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onChoose">
        <v-icon>mdi-checkbox-marked-circle</v-icon>
      </v-btn>
    </v-toolbar>

    <v-overlay :value="this.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-list two-line>
      <v-list-item-group
        v-model="selected"
        active-class="gray--text"
        xmultiple
        dense
      >
        <template v-for="item in items">
          <v-list-item :key="item.title">
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.fullname"
                  v-if="item.entitytypecode === '1'"
                >
                </v-list-item-title>
                <v-list-item-title
                  v-text="item.organizationname"
                  v-if="item.entitytypecode === '2'"
                >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon v-if="!active" color="grey lighten-1">
                  mdi-star-outline
                </v-icon>
                <v-icon v-else color="yellow darken-3">
                  mdi-star
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <!-- <v-divider v-if="index < items.length - 1" :key="index"></v-divider> -->
        </template>
      </v-list-item-group>
    </v-list>

    <!-- Dialog begins here -->

    <template>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-img
            src="https://cdn.vuetifyjs.com/images/lists/ali.png"
            height="300px"
            dark
          >
            <v-app-bar flat color="rgba(0, 0, 0, 0)">
              <v-btn dark icon @click="dialog = false">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-app-bar>

            <v-row class="fill-height">
              <v-card-title class="white--text pl-9 pt-9">
                <div
                  class="display-1 pl-9 pt-9"
                  v-if="this.selectedItem.entitytypecode === '1'"
                >
                  {{ this.selectedItem.firstname }} <br />
                  {{ this.selectedItem.lastname }}
                </div>
                <div
                  xclass="display-1 pl-9 pt-6"
                  class="text-h6"
                  v-if="this.selectedItem.entitytypecode === '2'"
                >
                  {{ this.selectedItem.organizationname }}
                </div>
              </v-card-title>
            </v-row>
          </v-img>

          <v-list two-line dense nav>
            <v-list-item v-for="(address, i) in this.contactDetails" :key="i">
              <v-list-item-icon>
                <v-icon color="accent">mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ address.address1 + " " + address.address2 }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    address.city +
                      " " +
                      address.state +
                      " " +
                      address.postalcode
                  }}
                </v-list-item-subtitle>
                <v-list>
                  <v-list-item v-for="(phone, j) in address.phones" :key="j">
                    <v-list-item-icon>
                      <v-icon color="accent" class="mx-5">
                        mdi-phone
                      </v-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ "" + phone.phone }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </template>
  </v-card>
</template>
