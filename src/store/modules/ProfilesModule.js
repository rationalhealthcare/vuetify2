/**
 * /*
 *     Profiles VUEX Module
 *
 * @format
 * @/store/modules/ProfilesModule.js
 */

"use strict";
const namespaced = true;

import { ProfileAdapter } from "@/adapters/ProfileAdapter.js";

const state = {
  families: [],
  profiles: [],
  consultants: []
};

const getters = {
  profiles: state => state.profiles,
  families: state => state.families,
  consultants: state => state.consultants
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
  },
  updateProfile(state, payload) {
    for (let i = 0; i < state.profiles.length; i++) {
      if (state.profiles[i].id === payload.id) {
        state.profiles[i] = Object.assign({}, payload);
      }
    }
  },
  setConsultant(state, payload) {
    state.consultants.push(payload);
  },
  setConsultants(state, payload) {
    state.consultants = payload;
  },
  deleteConsultant(state, payload) {
    for (let i = 0; i < state.consultants.length; i++) {
      if (state.consultants[i].npi === payload) {
        //payload is npi
        state.consultants.splice(i, 1);
        break;
      }
    }
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
  },

  async updateProfile({ commit }, profile) {
    try {
      let res = await ProfileAdapter.updateProfile(profile);
      if (res) {
        console.log(
          "Profiles.updateProfile: Number of rows affected: ",
          res.data
        );
        commit("updateProfile", profile);
      }
    } catch (error) {
      commit(
        "setAlert",
        { type: "error", message: error.message },
        { root: true }
      );
    }
  },

  /* add a selected consultant to the Vuex store consultants list */
  async setConsultant({ commit }, payload) {
    commit("setConsultant", payload);
    ProfileAdapter.persistConsultant(payload, function(err, res) {
      if (err) {
        commit(
          "setAlert",
          {
            type: "error",
            message: "Error while persisting the Consultants list."
          },
          { root: true }
        );
      } else {
        console.log("Profiles/setConsultant; received", err, res);
      }
    });
  },

  /* get the consultants list for the _active_ family from the profile API */
  async loadConsultants({ commit }, payload) {
    console.log("Profiles/loadConsultants fired.");
    try {
      ProfileAdapter.loadConsultants(payload, function(err, res) {
        if (err) {
          console.log(err);
          commit(
            "setAlert",
            {
              type: "error",
              message: "ProfileAdapter returned an error."
            },
            { root: true }
          );
        } else {
          console.log("Profiles/loadConsultants received", res);
          commit("setConsultants", res);
        }
      });
    } catch (e) {
      return false;
    }
  },

  async deleteConsultant({ commit }, payload) {
    commit("deleteConsultant", payload.npi);
    // async delete from Profile service
    // expects payload like this: {"npi": 1427053651, "fid": 41}
    try {
      await ProfileAdapter.deleteConsultant(payload, result => {
        console.log("Profiles/deleteConsultant received", result);
        if (result.affectedRows > 0) {
          commit(
            "setAlert",
            { type: "info", message: "Deleted " + payload.name },
            { root: true }
          );
        }
      });
    } catch (e) {
      return false;
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
