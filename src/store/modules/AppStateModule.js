/** @format */

"use strict";
const namespaced = true;

const state = {
    profile: {
        hello: "hello!",
        editingProfileId: null,
        consultantListSyncedToService: false,
        selectedItem: null /* consultant */,
        showConsultantDialog: true,
    },
    consultant: {
        activeComponentIndex: 0,
    },
    appBar: {
        navBarTrigger: {
            right: null,
            show: null,
        },
    },
    navDrawer: {
        navDrawerStaticSettings: {
            clipped: true,
            absolute: true,
            color: "secondary",
            colorOptions: ["primary", "secondary", "accent"],
            miniVariantWidth: "60",
            dark: true,
        },
        navDrawerUserSettings: {
            key: "DEFAULT_SLIDE_OUT",
            dense: true,
            right: false,
            value: false,
            mini: false,
            expandOnHover: false,
            permanent: false,
            temporary: true,
            triggerRight: false,
            showTrigger: true,
        },
        navDrawerOptions: [
            {
                key: "DEFAULT_SLIDE_OUT",
                dense: true,
                right: false,
                value: false,
                mini: false,
                expandOnHover: false,
                permanent: false,
                temporary: true,
                triggerRight: null,
                showTrigger: true,
            },
            {
                key: "DEFAULT_PERMANENT",
                dense: true,
                right: false,
                value: false,
                mini: false,
                expandOnHover: false,
                permanent: true,
                temporary: false,
                triggerRight: null,
                showTrigger: false,
            },
            {
                key: "MINI_SLIDE_OUT",
                dense: true,
                right: false,
                value: false,
                mini: true,
                expandOnHover: true,
                permanent: false,
                temporary: true,
                triggerRight: null,
                showTrigger: true,
            },
            {
                key: "MINI_PERMANENT",
                dense: true,
                right: false,
                value: false,
                mini: true,
                expandOnHover: true,
                permanent: true,
                temporary: false,
                triggerRight: null,
                showTrigger: false,
            },
        ],
    },
    appointment: {
        editingAppointment: null,
        /* editingAppointmentId: null, */
        /* currentTabIndex: 0 */
    },
};

const getters = {
    navDrawer: (state) => state.navDrawer.navDrawerUserSettings.drawer,
    navDrawerStaticSettings: (state) => state.navDrawer.navDrawerStaticSettings,
    navDrawerUserSettings: (state) => state.navDrawer.navDrawerUserSettings,
    navDrawerOptions: (state) => state.navDrawer.navDrawerOptions,
    editingProfileId: (state) => state.profile.editingProfileId,
    consultantListSyncedToService: (state) =>
        state.profile.consultantListSyncedToService,
    profile: (state) => state.profile,
    consultant: (state) => state.consultant,
    appointment: (state) => state.appointment,
};
const mutations = {
    setNavDrawer(state, value) {
        state.navDrawer.navDrawerUserSettings.drawer = value;
    },
    setNavDrawerSettings(state, value) {
        state.navDrawer.navDrawerSettings = value;
    },
    setNavDrawerPreference(state, value) {
        state.navDrawer.navDrawerPreference = value;
    },
    setNavDrawerUserSettings(state, value) {
        state.navDrawer.navDrawerUserSettings = value;
    },
    setEditingProfileId(state, value) {
        state.profile.editingProfileId = value;
    },
    setConsultantListSyncedToService(state, value) {
        state.profile.consultantListSyncedToService = value;
    },
    setSelectedItem(state, value) {
        state.profile.selectedItem = value;
    },
    setShowConsultantDialog(state, value) {
        state.profile.showConsultantDialog = value;
    },
    setConsultantActiveComponentIndex(state, value) {
        state.consultant.activeComponentIndex = value;
    },
    setAppointment(state, value) {
        state.appointment = value;
    },
};
const actions = {
    applyNavDrawerUserPreferences: function({ commit }, prefs) {
        console.log("prefs: " + JSON.stringify(prefs));
        let options = state.navDrawer.navDrawerOptions;
        for (let i = 0; i < options.length; i++) {
            if (options[i].key === prefs.navDrawerPreference) {
                options[i].expandOnHover = prefs.navDrawerExpandOnHover;
                options[i].dense = prefs.navDrawerDense;
                options[i].right = prefs.navDrawerRight;
                commit("setNavDrawerUserSettings", options[i]);
                break;
            }
        }
    },
    setConsultantListSyncedToService: function({ commit }, value) {
        commit("setConsultantListSyncedToService", value);
    },
    setSelectedItem: function({ commit }, value) {
        commit("setSelectedItem", value);
    },
    setShowConsultantDialog: function({ commit }, value) {
        commit("setShowConsultantDialog", value);
    },
    setConsultantActiveComponentIndex: function({ commit }, value) {
        commit("setConsultantActiveComponentIndex", value);
    },
    setAppointment: function({ commit }, value) {
        console.log("AppState/setAppointment Action:", value);
        commit("setAppointment", value);
    },
    syncAppointment: function({ commit }, payload) {
        console.log("Appstate/syncAppointment: Inbound", payload);
        //console.log("Appstate/syncAppointment: Current", state.appointment);
        let apptState = Object.assign({}, state.appointment);
        let apptWip = Object.assign({}, state.appointment.editingAppointment);
        console.log("Appstate/syncAppointment: Current working copy", apptWip);
        if (apptWip) {
            for (let prop in apptWip) {
                if (apptWip[prop] != payload[prop]) {
                    apptWip[prop] = payload[prop];
                }
            }
            apptState.editingAppointment = Object.assign({}, apptWip);
            commit("setAppointment", apptState);
        } else {
            commit("setAppointment", payload);
        }
    },
};

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions,
};
