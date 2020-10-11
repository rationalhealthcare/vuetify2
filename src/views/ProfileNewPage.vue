<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card>
        <v-card-title>
          <p class="headline accent--text mb-0">
            New Family Member
          </p>
        </v-card-title>
        <v-card-text id="newForm">
          <v-form id="form1" ref="form">
            <v-text-field
              id="text1"
              label="Name*"
              :rules="validationRules.name"
              v-model="profile.name"
              autocomplete="on"
              :persistent-hint="ui.button.persistentHint"
              hint="The name you would use in
              correspondence with healthcare professionals."
            ></v-text-field>

            <v-text-field
              id="text2"
              label="Alias"
              :xrules="validationRules.name"
              v-model="profile.alias"
              autocomplete="on"
              :persistent-hint="ui.button.persistentHint"
              hint="An informal name, like a nickname. We display this name inside Kērgiva."
            ></v-text-field>

            <v-text-field
              id="text5"
              label="Select an Avatar"
              :xrules="validationRules.avatar"
              v-model="profile.avatarpath"
              autocomplete="on"
              :persistent-hint="ui.button.persistentHint"
              hint="We show this inside Kērgiva, wherever we display information this person."
            ></v-text-field>

            <v-text-field
              id="text3"
              label="Initials"
              :xrules="validationRules.name"
              v-model="profile.initials"
              autocomplete="on"
              :persistent-hint="ui.button.persistentHint"
              hint="We use initials inside Kērgiva if you don't provide an avatar."
            ></v-text-field>

            <v-text-field
              id="text6"
              label="Email"
              v-model="profile.email"
              :persistent-hint="ui.button.persistentHint"
              hint="An email address is not required for family members who don't use the Kērgiva app."
            ></v-text-field>
            <p>
              <small>* Indicates a required field.</small>
            </p>
          </v-form>
        </v-card-text>
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ProfileNewPage",
  data() {
    return {
      familyid: null,
      profile: {
        name: null,
        alias: null,
        initials: null,
        avatarPath: null,
        email: null
      },
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
        button: {
          color: "accent",
          persistentHint: true
        }
      },
      profilesLength: -1
    };
  },

  mounted() {
    this.setFamilyId();
    if (this.profiles) {
      this.profilesLength = this.profiles.length;
    }
  },
  computed: {
    user() {
      return this.$store.getters["Auth/user"];
    },
    profiles() {
      return this.$store.getters["Profiles/profiles"];
    },
    families() {
      return this.$store.getters["Profiles/families"];
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
  watch: {
    profiles() {
      if (this.profiles.length > this.profilesLength) {
        this.profilesLength = this.profiles.length;
      }
    }
  },
  methods: {
    onApply() {
      const payload = { familyid: this.familyid, profile: this.profile };
      this.$store.dispatch("Profiles/createNewProfile", payload);
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
    setFamilyId: function() {
      this.familyid = this.families[0].id;
    },
    validateName(name) {
      const re = /^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{0,})?)/;
      return !re.test(name);
    }
  }
};
</script>
