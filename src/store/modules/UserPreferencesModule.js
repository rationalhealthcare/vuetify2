"use strict";
const namespaced = true;
import { UserPreferenceAdapter } from "@/adapters/UserPreferenceAdapter.js";
const state = {
  userPreferences: {
    navDrawerPreferences: {
      navDrawerPreference: null,
      navDrawerExpandOnHover: null,
      navDrawerDense: null,
      navDrawerRight: null
    },
    themePreferences: {
      themePreference: null
    }
  },
  userOptions: {
    navDrawerUserOptions: [
      {
        key: "DEFAULT_SLIDE_OUT",
        name: "Default, slide-out"
      },
      {
        key: "DEFAULT_PERMANENT",
        name: "Default, permanent"
      },
      {
        key: "MINI_SLIDE_OUT",
        name: "Mini, slide-out"
      },
      {
        key: "MINI_PERMANENT",
        name: "Mini, permanent"
      }
    ]
  }
};
const getters = {
  /* NAV DRAWER */
  navDrawerUserPrefs: state => state.userPreferences.navDrawerPreferences,
  navDrawerUserOptions: function() {
    return state.userOptions.navDrawerUserOptions;
  },

  /* THEME */
  themeUserPrefs: function() {
    return state.userPreferences.themePreferences.themePreference;
  }
};

const mutations = {
  setNavDrawerUserPreferences(state, value) {
    state.userPreferences.navDrawerPreferences = value;
  },
  setThemeUserPreferences(state, value) {
    state.userPreferences.themePreferences.themePreference = value;
  },
  deleteUserPreferences(state) {
    state.userPreferences.navDrawerPreferences == null;
    state.userPreferences.themePreferences.themePreference = null;
  }
};

const actions = {
  /* NAVIGATION DRAWER PREFENCES */
  async loadNavDrawerUserPreferences({ commit }, uid) {
    try {
      const userPrefs = await UserPreferenceAdapter.loadNavDrawerUserPreferences(
        uid
      );
      if (userPrefs) {
        commit("setNavDrawerUserPreferences", userPrefs);
      }
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }
  },
  async saveNavDrawerUserPreferences({ commit }, prefs, uid) {
    try {
      await UserPreferenceAdapter.saveNavDrawerUserPreferences(prefs, uid);
      commit("setNavDrawerUserPreferences", prefs);
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }

    return prefs;
  },
  /* THEME PREFERENCES */
  async loadThemeUserPreferences({ commit }, uid) {
    try {
      const userPrefs = await UserPreferenceAdapter.loadThemeUserPreferences(
        uid
      );
      if (userPrefs) {
        commit("setThemeUserPreferences", userPrefs.themeUserPreference);
      }
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }
  },
  async saveThemeUserPreferences({ commit }, payload) {
    const themeName = payload.themeName;
    const uid = payload.uid;
    try {
      await UserPreferenceAdapter.saveThemeUserPreferences(themeName, uid);
      commit("setThemeUserPreferences", themeName);
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }
  }
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
};
