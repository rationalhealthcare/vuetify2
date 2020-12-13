<!-- @format -->
<script>
export default {
  name: "Consultants",
  data: () => {
    return {
      hidden: false,
      dialog: false,
      selected: null
    };
  },
  computed: {
    items() {
      return this.$store.getters["Profiles/consultants"];
    },
    selectedItem() {
      if (this.items) {
        return this.items[this.selected];
      } else {
        return null;
      }
    },
    showConsultantDialog() {
      let profile = this.$store.getters["AppState/profile"];
      return profile.showConsultantDialog;
    }
  },
  watch: {
    selectedItem() {
      if (this.selectedItem) {
        this.setAppStateSelectedItem();
        if (this.showConsultantDialog) {
          this.dialog = true;
        }
      }
    }
  },
  methods: {
    setAppStateSelectedItem() {
      this.$store.dispatch("AppState/setSelectedItem", this.selectedItem);
    }
  }
};
</script>
<template>
  <v-sheet class="mx-auto" max-width="500">
    <v-list class="px-0 mx-0">
      <v-list-item-group v-model="selected" active-class="gray--text" dense>
        <v-list-item
          v-for="(item, index) in items"
          xcolor="secondary darken-2"
          :key="index"
        >
          <template xv-slot:default="{ active }">
            <v-list-item-icon v-if="item.entitytypecode === '1'">
              <v-icon>mdi-medical-bag</v-icon>
            </v-list-item-icon>
            <v-list-item-icon v-if="item.entitytypecode === '2'">
              <v-icon>mdi-home-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.firstname + ' ' + item.lastname"
                v-if="item.entitytypecode === '1'"
              >
              </v-list-item-title>
              <v-list-item-title
                v-text="item.organizationname"
                v-if="item.entitytypecode === '2'"
              >
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!-- Dialog begins here -->

    <template>
      <v-dialog v-model="dialog" width="500" v-if="this.selectedItem">
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
                  class="display-1 pl-9 pt-9"
                  v-if="this.selectedItem.entitytypecode === '2'"
                >
                  {{ this.selectedItem.organizationname }}
                </div>
              </v-card-title>
            </v-row>
          </v-img>

          <v-list two-line>
            <v-list-item
              v-for="(address, i) in this.selectedItem.addresses"
              :key="i"
              dense
            >
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
  </v-sheet>
</template>
