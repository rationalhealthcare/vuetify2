<template>
  <!-- https://materialdesignicons.com/cdn/2.0.46/ -->
  <!-- App.vue -->
  <div>
    <v-app>
      <v-navigation-drawer
        app
        v-model="drawer"
        :color="this.navDrawerStaticSettings.color"
        :dark="this.navDrawerStaticSettings.dark"
        :mini-variant-width="this.navDrawerStaticSettings.miniVariantWidth"
        :clipped="this.navDrawerStaticSettings.clipped"
        :dense="this.navDrawerUserSettings.dense"
        :right="this.navDrawerUserSettings.right"
        :value="this.navDrawerUserSettings.value"
        :mini-variant="this.navDrawerUserSettings.mini"
        :expand-on-hover="this.navDrawerUserSettings.expandOnHover"
        :permanent="this.navDrawerUserSettings.permanent"
        :temporary="this.navDrawerUserSettings.temporary"
      >
        <NavDrawerItems />
      </v-navigation-drawer>

      <v-app-bar color="primary" dark clipped-left clipped-right app>
        <v-app-bar-nav-icon
          v-if="this.showNavBarTriggerLeft && this.user"
          @click.native.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-spacer></v-spacer>
        <v-btn href="/" icon>
          <v-toolbar-title>
            <v-img
              src="./assets/logo_white.png"
              max-height="45px"
              max-width="45px"
              class="pt-5"
            ></v-img>
          </v-toolbar-title>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="clicked('signup')" :disabled="userExists" icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn @click="clicked('signin')" :disabled="userExists" icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-app-bar-nav-icon
          v-if="this.showNavBarTriggerRight && this.user"
          @click.native.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-container>
        <v-footer color="primary" dark app>
          (c) rationalhealthcare.org 2019 - 2020
          <!-- -->
        </v-footer>

        <!-- BEGIN ALERT -->
        <v-layout row v-if="alert">
          <v-flex xs12 sm6 offset-sm3>
            <app-alert
              :type="alert.type"
              @dismissed="onDismissed"
              :text="alert.message"
            ></app-alert>
          </v-flex>
        </v-layout>
        <!-- END ALERT -->
      </v-container>
    </v-app>
  </div>
</template>
/* ///////////////////////////////////////////////////////////////////////// */
<script>
import NavDrawerItems from "@/components/NavDrawerItems.vue";
export default {
  name: "App",
  components: { NavDrawerItems },
  data: function() {
    return {
      drawer: false,
      userExists: null
    };
  },
  mounted: function() {
    this.setTheme();
    this.getSignedInUser();
  },
  watch: {
    userCache() {
      if (this.userCache) {
        this.createProfile();
      }
    },
    user() {
      if (this.user) {
        this.userExists = true;
        this.loadProfile();
        this.loadNavDrawerUserPreferences();
        this.loadThemeUserPreferences();
      }
    },
    activeTheme() {
      this.setTheme();
    },
    navDrawerUserPrefs() {
      if (this.navDrawerUserPrefs) {
        this.applyNavDrawerUserPreferences();
      }
    },
    themeUserPrefs() {
      this.setActiveTheme();
    }
  },
  computed: {
    userCache: function() {
      return this.$store.getters["userCache"];
    },
    error: function() {
      return this.$store.getters["AppState/error"];
    },
    profiles: function() {
      return this.$store.getters["Profiles/profiles"];
    },
    user: function() {
      return this.$store.getters["Auth/user"];
    },
    showNavBarTriggerLeft: function() {
      var right = this.navDrawerUserPrefs.navDrawerRight;
      var pref = this.navDrawerUserPrefs.navDrawerPreference;
      switch (pref) {
        case "DEFAULT_SLIDE_OUT":
        case "MINI_SLIDE_OUT":
          return right ? false : true;
        case "DEFAULT_PERMANENT":
        case "MINI_PERMANENT":
          return false;
        default:
          return null;
      }
    },
    showNavBarTriggerRight: function() {
      var right = this.navDrawerUserPrefs.navDrawerRight;
      var pref = this.navDrawerUserPrefs.navDrawerPreference;
      switch (pref) {
        case "DEFAULT_SLIDE_OUT":
        case "MINI_SLIDE_OUT":
          return right ? true : false;
        case "DEFAULT_PERMANENT":
        case "MINI_PERMANENT":
          return false;
        default:
          return null;
      }
    },
    alert() {
      return this.$store.getters.alert;
    },
    /* THEME */
    activeTheme() {
      return this.$store.getters["Themes/activeTheme"];
    },
    defaultTheme: function() {
      return this.$store.getters["Themes/defaultTheme"];
    },
    themeUserPrefs: function() {
      return this.$store.getters["UserPrefs/themeUserPrefs"];
    },

    /* NAV DRAWER */
    navDrawerUserPrefs: function() {
      return this.$store.getters["UserPrefs/navDrawerUserPrefs"];
    },
    navDrawerStaticSettings: function() {
      return this.$store.getters["AppState/navDrawerStaticSettings"];
    },
    navDrawerUserSettings: function() {
      return this.$store.getters["AppState/navDrawerUserSettings"];
    }
  },

  methods: {
    onDismissed() {
      this.$store.dispatch("clearAlert");
    },
    clicked(value) {
      if (value === "signin") {
        this.$router.push({ path: "/signin" });
      } else if (value === "signup") {
        this.$router.push({ path: "/signup" });
      } else {
        //error
      }
    },
    getSignedInUser() {
      this.$store.dispatch("Auth/getSignedInUser");
    },
    createProfile() {
      this.$store.dispatch("Profiles/createProfile", this.userCache);
    },
    loadProfile() {
      this.$store.dispatch("Profiles/loadProfile", this.user);
    },

    /* NAV DRAWER */
    async loadNavDrawerUserPreferences() {
      await this.$store.dispatch(
        "UserPrefs/loadNavDrawerUserPreferences",
        this.user.uid
      );
    },
    applyNavDrawerUserPreferences: async function() {
      await this.$store.dispatch(
        "AppState/applyNavDrawerUserPreferences",
        this.navDrawerUserPrefs
      );
    },

    /* THEMES */
    loadThemeUserPreferences: function() {
      this.$store.dispatch("UserPrefs/loadThemeUserPreferences", this.user.uid);
    },
    setActiveTheme: function() {
      if (this.themeUserPrefs) {
        this.$store.commit("Themes/setActiveTheme", this.themeUserPrefs);
      } else {
        this.$store.commit("Themes/setActiveTheme", this.defaultTheme);
      }
    },
    setTheme: function() {
      this.$vuetify.theme.themes.light.primary = this.$store.getters[
        "Themes/activeTheme"
      ].primary;
      this.$vuetify.theme.themes.light.secondary = this.$store.getters[
        "Themes/activeTheme"
      ].secondary;
      this.$vuetify.theme.themes.light.accent = this.$store.getters[
        "Themes/activeTheme"
      ].accent;
      this.$vuetify.theme.themes.light.info = this.$store.getters[
        "Themes/activeTheme"
      ].info;
      return null;
    }
  }
};
</script>
