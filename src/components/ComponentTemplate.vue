<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card>
        <v-card-title>
          <p class="headline accent--text mb-0">
            PAGE TITLE GOES HERE
          </p>
        </v-card-title>
        <v-card-text id="newForm">
          <v-form id="form1" ref="form">
            <!-- PLACE FORM FIELDS HERE -->
          </v-form>

          <!-- BEGIN ALERT -->
          <v-layout row v-if="this.alert">
            <v-flex xs12 sm6 offset-sm3>
              <app-alert
                :type="this.alert.type"
                @dismissed="onDismissed"
                :text="this.alert.message"
              ></app-alert>
            </v-flex>
          </v-layout>
          <!-- END ALERT -->
        </v-card-text>

        <!-- PLACE THE BUTTONS HERE -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="onApply"
            :loading="this.loading"
            :color="ui.button.color"
            >Apply</v-btn
          >
          <v-btn @click="onReset">Reset</v-btn>
        </v-card-actions>
        <!-- END OF BUTTONS -->
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "MyViewName",
  data() {
    return {
      domain: {
        name: null,
        alias: null,
        initials: null,
        familyName: null,
        avatarPath: null,
        email: null
      },
      validationRules: {
        name: [
          v => (v ? v.length >= 3 || "Minimum length is 3 characters." : false)
        ]
      },
      ui: {
        button: {
          color: "accent",
          persistentHint: true,
          text: false
        }
      }
    };
  },

  mounted() {
    if (this.user && this.profiles) {
      this.setProfile();
    }
  },

  computed: {
    user() {
      return this.$store.getters["Auth/user"];
    },
    profiles() {
      return this.$store.getters["Profiles/profiles"];
    },
    loading() {
      return this.$store.getters.loading;
    },
    error() {
      return this.$store.getters.error;
    },
    alert() {
      return this.$store.getters.alert;
    }
  },

  methods: {
    onApply() {
      //What to do when the user clicks the Apply button.
    },
    onReset() {
      this.$refs.form.reset();
    },
    onDismissed() {
      // What to do when an alert is dismissed.
    },
    setProfile: function() {
      const profiles = this.profiles;
      const uid = this.user.uid;
      for (let i = 0; i < profiles.length; i++) {
        if (profiles[i].uid == uid) {
          this.profile = profiles[i];
        }
      }
    },
    validateName(name) {
      const re = /^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{0,})?)/;
      return !re.test(name);
    }
  }
};
</script>
