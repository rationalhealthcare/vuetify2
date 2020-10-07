/* 
    Profiles VUEX Module
    @/store/modules/ProfilesModule.js
*/

"use strict";
const namespaced = true;

import { ProfileAdapter } from "@/adapters/ProfileAdapter.js";

const state = {
  families: [],
  profiles: []
};

const getters = {
  profiles: state => state.profiles,
  families: state => state.families
};

const mutations = {
  addProfile(state, payload) {
    state.profiles.push(payload);
  },
  setProfiles(state, payload) {
    state.profiles = payload;
  },
  setFamilies(state, payload) {
    state.families = payload;
  },
  signOut(state) {
    state.profiles = [];
  }
};

const actions = {
  /*  new profile for _new_ user */
  async createNewUserProfile({ commit }, payload) {
    const response = await ProfileAdapter.createNewUserProfile(payload);
    if (response) {
      console.log(
        "Profiles.actions.createNewUserProfile; Adapter returned : " +
          JSON.stringify(response)
      );
      commit("setProfiles", response.data[0]);
      commit("setFamilies", response.data[1]);
      commit("setUserCache", null, { root: true });
    }
  },

  /* new profile, _not_ for a new user */
  async createNewProfile({ commit }, payload) {
    try {
      const response = await ProfileAdapter.createNewProfile(payload);
      if (response) {
        commit("addProfile", response);
      }
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }
  },

  async loadProfiles({ commit }, user) {
    try {
      const response = await ProfileAdapter.loadProfiles(user.uid);
      if (response) {
        if (response) {
          console.log("Got from Profile Adapter: " + JSON.stringify(response));
          if (response.profiles.length > 0) {
            commit("setProfiles", response.profiles);
          }
          if (response.profiles.length > 0) {
            commit("setFamilies", response.families);
          }
        }
      } else {
        throw "Profiles/loadProfiles: Adapter returned a NULL data set.";
      }
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
  actions,
  mutations
};
