<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card class="mx-auto" xmax-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">
              NEW APPOINTMENT
            </div>
            <v-list-item-title class="headline mb-1">
              {{ profile.name }}
            </v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-text>
          <v-form id="newAppointmentForm">
            <template>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                      <v-row no-gutters>
                        <v-col cols="4">
                          Clinician name and location
                        </v-col>
                        <v-col cols="8" class="text--secondary">
                          <v-fade-transition leave-absolute>
                            <span v-if="open" key="0">
                              The name and address of the doctor you are going
                              to visit.

                              <v-radio-group v-model="consultant" row>
                                <v-radio
                                  @click.stop
                                  label="Key in clinician details"
                                  value="key"
                                ></v-radio>
                                <v-radio
                                  @click.stop="clicked"
                                  label="Search for a clinician"
                                  value="search"
                                ></v-radio>
                              </v-radio-group>
                            </span>

                            <span v-else key="1"> </span>
                          </v-fade-transition>
                        </v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-if="consultant === 'key'">
                      <v-text-field
                        id="text1"
                        label="Clinician Name*"
                        xv-model="profile.clinician.name"
                        :autocomplete="ui.inputText.autoComplete"
                        :color="ui.inputText.color"
                      ></v-text-field>
                      <v-textarea
                        clearable
                        clear-icon="mdi-close-circle"
                        label="Address"
                        value=""
                      ></v-textarea>
                    </div>
                    <div v-else>
                      The selected clinician and address goes here...
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn outlined rounded text @click="clicked">
            Button
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- begin clinician dialog ---------------------------------------------->
    <v-dialog
      xv-model="dialog"
      v-model="showme"
      xfullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat dark color="primary" max-height="100">
          <v-btn icon dark @click="showme = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Clinician</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="showme = false">
              Save
            </v-btn>
          </v-toolbar-items>
          <v-menu bottom right offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="() => {}"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <!-- end of toolbar -->

        <v-card-text>
          <v-card-title>
            The stuff for finding a clinician goes here
          </v-card-title>

          <v-btn color="primary" dark class="ma-2" @click="dialog2 = !dialog2">
            Open Dialog 2
          </v-btn>
        </v-card-text>

        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
    <!-- End clinician dialog -->
  </v-row>
</template>

/*
********************************************************************************
*/ //////////////////////////////// SCRIPT
//////////////////////////////////////// /*
********************************************************************************
*/

<script>
export default {
  name: "AppointmentNewPage",
  data: function() {
    return {
      consultant: "key",
      date: null,
      trip: {
        name: "",
        location: null,
        start: null,
        end: null
      },
      locations: [
        "Australia",
        "Barbados",
        "Chile",
        "Denmark",
        "Ecuador",
        "France"
      ],

      addressItems: ["Wellbeing Center", "123 Main St.", "Newtown, IL 60601"],
      profile: null,
      showme: false,
      validationRules: {
        name: [
          v =>
            v
              ? this.validateName(v) ||
                "Name should not contain numbers or weird characters, please."
              : false
        ]
      },
      ui: {
        inputText: {
          color: "accent",
          persistentHint: true,
          autocomplete: true
        },
        button: {
          color: "accent",
          persistentHint: true
        }
      }
    };
  },
  mounted() {
    this.setEditingProfile();
  },

  computed: {
    profiles() {
      return this.$store.getters["Profiles/profiles"];
    },
    editingProfileId() {
      return this.$store.getters["AppState/editingProfileId"];
    }
  },
  methods: {
    clicked() {
      this.showme = true;
    },
    setEditingProfile() {
      for (let i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].id === this.editingProfileId) {
          this.profile = this.profiles[i];
          this.undoProfile = Object.assign({}, this.profiles[i]);
          break;
        }
      }
    }
  }
};
</script>
