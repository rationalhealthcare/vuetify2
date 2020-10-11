<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="8">
      <v-card>
        <v-card-title>
          <p class="headline accent--text mb-0">
            Edit Family Profile
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
  name: "ProfileEditPage",
  data() {
    return {
      familyid: null,
      profile: {},
      undoProfile: {},
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
    this.setEditingProfile();
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
    },
    editingProfileId() {
      return this.$store.getters["AppState/editingProfileId"];
    }
  },
  watch: {},
  methods: {
    onApply() {
      //  has x (profile current state) change in relation
      //  to y (profile start state)?
      if (this.isChanged(this.profile, this.undoProfile)) {
        this.$store.dispatch("Profiles/updateProfile", this.profile);
        this.$store.commit("AppState/setEditingProfileId", null);
      }
    },
    onReset() {
      this.resetEditingProfile();
    },
    setEditingProfile() {
      for (let i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].id === this.editingProfileId) {
          this.profile = this.profiles[i];
          this.undoProfile = Object.assign({}, this.profiles[i]);
          break;
        }
      }
    },
    resetEditingProfile() {
      this.profile = Object.assign({}, this.undoProfile);
    },
    setFamilyId: function() {
      this.familyid = this.families[0].id;
    },
    validateName(name) {
      const re = /^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{0,})?)/;
      return !re.test(name);
    },
    //has x changed in relation to y?
    isChanged(x, y) {
      for (let prop in x) {
        if (x[prop] === "") {
          x[prop] = null;
        }
        console.log("x[prop]", x[prop], "y[prop]", y[prop]);
        if (x[prop] != y[prop]) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
