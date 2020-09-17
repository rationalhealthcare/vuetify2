/* 
    Auth VUEX Module
    @/store/modules/Auth.js
*/

"use strict";
import firebase from "@/fb.js";
const namespaced = true;

const state = {
    user: {}
  },
  mutations = {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  getters = { user: state => state.user },
  actions = {
    async signUserUp({ commit }, payload) {
      try {
        const result = await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password);
        if (result) {
          commit(
            "setUserCache",
            { uid: result.user.uid, name: payload.name, email: payload.email },
            { root: true }
          );
          commit("setUser", {
            uid: result.user.uid
          });
        }
      } catch (error) {
        commit(
          "setAlert",
          { type: "error", message: error.message },
          { root: true }
        );
      }
    },

    async signUserIn({ commit }, payload) {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password);
      } catch (error) {
        commit(
          "setAlert",
          { type: "error", message: error.message },
          { root: true }
        );
      }
    },

    async getSignedInUser({ commit }) {
      try {
        await firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            commit("setUser", {
              uid: user.uid
            });
          } else {
            commit("setUser", null);
          }
        });
      } catch (error) {
        commit(
          "setAlert",
          { type: "error", message: error.message },
          { root: true }
        );
      }
    },
    async signUserOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .catch(function(error) {
          commit(
            "setAlert",
            { type: "error", message: error.message },
            { root: true }
          );
        });
    }
  };
export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
