/** @format */

import Vue from "vue";
import Vuex from "vuex";
import AuthModule from "@/store/modules/AuthModule.js";
import AppStateModule from "@/store/modules/AppStateModule.js";
import ProfilesModule from "@/store/modules/ProfilesModule.js";
import ThemeModule from "@/store/modules/ThemeModule.js";
import UserPreferencesModule from "@/store/modules/UserPreferencesModule.js";
import ConsultantModule from "@/store/modules/ConsultantModule.js";
import AppointmentModule from "@/store/modules/AppointmentModule.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth: AuthModule,
    AppState: AppStateModule,
    Profiles: ProfilesModule,
    Themes: ThemeModule,
    UserPrefs: UserPreferencesModule,
    Consultant: ConsultantModule,
    Appointments: AppointmentModule
  },
  /* wip - maybe can take out "deleting" property etc. */
  state: {
    loading: false,
    deleting: false,
    error: null,
    alert: null,
    userCache: null
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setDeleting(state, payload) {
      state.deleting = payload;
    },
    /* USER CACHE */
    setUserCache(state, payload) {
      state.userCache = payload;
    },

    /* ERROR */
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },

    /*   ALERT   */
    setAlert(state, payload) {
      state.alert = payload;
    },
    clearAlert(state) {
      state.alert = null;
    }
  },
  actions: {
    clearError({ commit }) {
      commit("clearError");
    },
    /* ALERT */
    clearAlert({ commit }) {
      commit("clearAlert");
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    deleting(state) {
      return state.deleting;
    },
    error(state) {
      return state.error;
    },
    /* ALERT */
    alert(state) {
      return state.alert;
    },

    /* USER CACHE */
    userCache(state) {
      return state.userCache;
    }
  }
});
