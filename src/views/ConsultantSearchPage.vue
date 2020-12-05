<!-- @format -->

<script>
export default {
  name: "ConsultantSearchPage",
  data: () => {
    return {
      prependicon: "mdi-certificate",
      show: false,
      dialog: false,
      selected: 1,
      selectedAddress: null,
      lxoading: false,
      search: {
        type: "practitioner",
        facilityname: null,
        firstname: null,
        lastname: null,
        city: null,
        state: null,
        postalcode: null
      },
      items: [
        {
          addresses: [
            {
              active: false,
              address1: "",
              address2: "",
              city: "",
              countrycode: "",
              npi: "",
              phone: "",
              postalcode: "",
              purpose: "",
              state: ""
            }
          ],
          active: false,
          credential: "",
          entitytypecode: "",
          firstname: "",
          lastname: "",
          npi: "",
          organizationname: "",
          suffix: ""
        }
      ]
    };
  },
  mounted() {
    this.$store.commit("Consultant/setConsultantSearchResults", []);
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    searchNameLabel() {
      if (this.search.type === "practitioner") {
        return "Doctor's or practitioner's name";
      } else {
        return "Name of your practitioner's facility";
      }
    },
    consultantSearchResults() {
      return this.$store.getters["Consultant/consultantSearchResults"];
    }
  },
  watch: {
    consultantSearchResults() {
      if (this.consultantSearchResults.length > 0) {
        this.$router.push("/consultantsearchresults");
      }
    }
  },
  methods: {
    onReset() {
      this.$refs.consultantSearchForm.reset();
    },
    async onSearch() {
      if (this.search.type === "practitioner") {
        this.$store.dispatch("Consultant/searchPractitioners", this.search);
      } else {
        this.$store.dispatch("Consultant/searchOrganizations", this.search);
      }
    }
  }
};
</script>

/******************************************************************************
******************************************************************************/

<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card>
        <v-card-title>
          <p class="headline accent--text mb-0">
            Consultant Search
          </p>
        </v-card-title>
        <v-card-text>
          <v-radio-group id="r" v-model="search.type" row xs="6">
            <v-radio
              @click.stop
              label="Practitioner"
              value="practitioner"
            ></v-radio>
            <v-radio @click.stop label="Facility" value="facility"></v-radio>

            <v-btn icon @click="show = !show" color="info">
              <v-icon>
                mdi-information
              </v-icon>
            </v-btn>
          </v-radio-group>

          <v-form id="" ref="consultantSearchForm">
            <!-- fields here... -->

            <div v-if="search.type === 'practitioner'">
              <v-text-field
                id="text1"
                label="Doctor's or practitioner's first name"
                v-model="search.firstname"
              ></v-text-field>
              <v-text-field
                id="text2"
                label="Last name"
                v-model="search.lastname"
              ></v-text-field>
            </div>
            <div v-else>
              <v-text-field
                id="text3"
                label="Name of the facility you will visit"
                v-model="search.facilityname"
              >
              </v-text-field>
            </div>

            <v-text-field
              id="text2"
              label="City"
              v-model="search.city"
            ></v-text-field>
            <v-text-field
              id="text3"
              label="State Code"
              v-model="search.statecode"
            ></v-text-field>
            <v-text-field
              id="text4"
              label="Postal Code"
              v-model="search.postalcode"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="onSearch" :loading="this.loading" color="accent">
            Search
          </v-btn>
          <v-btn @click="onReset">Reset</v-btn>
        </v-card-actions>
      </v-card>
      <v-tooltip bottom v-model="show" color="secondary" attach="#r">
        <!-- <v-card-subtitle> -->
        Give as much information as you can. You can use partial words.<br />
        The search will return only 10 results at a time. If the consultant you
        are looking for is not in the result set, please refine your search
        terms and try again.
        <!-- </v-card-subtitle> -->
      </v-tooltip>
    </v-col>
  </v-row>
</template>
