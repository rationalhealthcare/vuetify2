/**
 *
 *     Appointments VUEX Module
 *
 * @format
 * @/store/modules/AppointmentsModule.js
 */

"use strict";
const namespaced = true;
//const { v4: uuidv4 } = require("uuid");
import { AppointmentAdapter } from "@/adapters/AppointmentAdapter.js";
const state = {
    appointments: [],
};

const getters = {
    appointments: (state) => state.appointments,
};

const mutations = {
    addAppointment(state, payload) {
        state.appointments.push(payload);
    },

    replaceAppointment(state, payload) {
        let index = state.appointments.findIndex(
            ({ apptid }) => apptid == payload.apptid
        );
        console.log("index", index);
        state.appointments[index] = payload;
    },
};

/* WIP here */

const actions = {
    /**
     * saveAppointment
     * @param {*} param0
     * @param {*} payload must be an appointment object; no wrapper.
     */
    async saveAppointment({ commit }, payload) {
        if (commit) {
            console.log("AppointmentModule.saveAppointment");
        }
        let appointments = state.appointments;
        let apptExists = false;
        if (appointments) {
          console.log("AppointmentModule.saveAppointment: Number of appts found", appointments.length);
            for (let appt of appointments) {
                if (appt.apptid == payload.apptid) {
                    apptExists = true;
                    break;
                }
            }
        }
        if (apptExists) {
          console.log("AppointmentModule.saveAppointment - updating EXISTING appointment");
            commit("replaceAppointment", payload);
            AppointmentAdapter.persistEditedAppointment(payload, function(
                err,
                res
            ) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });
        } else {
          console.log("AppointmentModule.saveAppointment - saving NEW appointment");
            commit("addAppointment", payload);
            AppointmentAdapter.persistNewAppointment(payload, function(
                err,
                res
            ) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });
        }
    },

    /*     async xsaveAppointment({ commit }, payload) {
        let uuid = null;
        if (!payload.apptid) {
            uuid = uuidv4();
            payload.apptid = uuid;
            commit("addAppointment", payload);
            //sync with Appointment Service
            AppointmentAdapter.persistNewAppointment(payload, function(
                err,
                res
            ) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });
        } else {
            let appointment = state.appointments.filter(function(appt) {
                return appt.apptid == payload.apptid;
            });
            if (appointment.length != 0) {
                console.log("replace fired");
                commit("replaceAppointment", payload);
                //sync with Appointment Service
                AppointmentAdapter.persistEditedAppointment(payload, function(
                    err,
                    res
                ) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                });
            }
        }
        console.log("AppointmentModule/saveAppointment: Returning uuid", uuid);
        return uuid; // either a new uuid or null
    }, */

    /*     async saveComplaint({ commit }, payload) {
        // expecting payload like, { apptid: null, complaint: null } 
        console.log("Appointments/saveComplaint", payload);
        let editedAppt = state.appointments.filter(function(appt) {
            return appt.apptid == payload.apptid;
        });
        console.log("Appointments/saveComplaint: Edited Appointment", editedAppt);
        if (editedAppt) {
            editedAppt.complaint = payload.complaint;
            console.log("Appointments/saveComplaint: Updated Complaint", editedAppt);
            commit("replaceAppointment", editedAppt);
        } else {
            commit(
                "setAlert",
                {
                    type: "error",
                    message: "Could not find the Appointment being edited.",
                },
                { root: true }
            );
        }
    }, */
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
