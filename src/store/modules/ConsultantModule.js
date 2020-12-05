/** @format */

"use strict";
const namespaced = true;

import { ConsultantAdapter } from "@/adapters/ConsultantAdapter.js";
const state = {
  consultantSearchResults: [],
  contactDetails: []
};

const getters = {
  consultantSearchResults: state => state.consultantSearchResults,
  contactDetails: state => state.contactDetails
};

const mutations = {
  setConsultantSearchResults(state, payload) {
    state.consultantSearchResults = payload;
  },
  setContactDetails(state, payload) {
    state.contactDetails = payload;
  }
};

const actions = {
  async search({ commit }, payload) {
    commit("setLoading", true, { root: true });
    if (commit && payload) {
      let results = await ConsultantAdapter.search(payload);
      commit("setConsultantSearchResults", results);
      commit("setLoading", false, { root: true });
      return results;
    }
  },
  async searchOrganizations({ commit }, payload) {
    commit("setLoading", true, { root: true });
    let results = await ConsultantAdapter.searchOrganizations(payload);
    commit("setConsultantSearchResults", results);
    commit("setContactDetails", null);
    commit("setLoading", false, { root: true });
    return results;
  },
  async searchPractitioners({ commit }, payload) {
    commit("setLoading", true, { root: true });
    let results = await ConsultantAdapter.searchPractitioners(payload);
    commit("setConsultantSearchResults", results);
    commit("setContactDetails", null);
    commit("setLoading", false, { root: true });
    return results;
  },
  async getContactDetails({ commit }, payload) {
    commit("setLoading", true, { root: true });
    let results = await ConsultantAdapter.searchContactDetails(payload);
    commit("setContactDetails", results);
    commit("setLoading", false, { root: true });
  }
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
