/**
 *
 *     Appointments VUEX Module
 *
 * @format
 * @/store/modules/AppointmentsModule.js
 */

"use strict";
const namespaced = true;
const me = "Vuex AppointmentsModule";
import { AppointmentAdapter } from "@/adapters/AppointmentAdapter.js";

export const AppointmentHelper = {
    appointmentExists: function(payload) {
        let appointments = state.appointments;
        let apptExists = false;
        if (appointments) {
            console.log(
              me,
                "AppointmentHelper.appointmentExists: # Appts in module:",
                appointments.length
            );
            for (let appt of appointments) {
                if (appt.apptid == payload.apptid) {
                    apptExists = true;
                    break;
                }
            }
        }
        return apptExists;
    },
};

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
        console.log(
            "Appointment state mutation 'replaceAppointment', index",
            index
        );
        state.appointments[index] = payload;
    },
    setAppointments(state, payload) {
        state.appointments = payload;
    },

    /*
      The appointment is being edited if the value of the "editing" property
      is "true". The appointment is NOT being editied if there is no "editing"
      property. 
    */
    setEditingActive(state, payload) {
        console.log("AppointmentModule.MUTATIONS.setEditingActive", payload);
        for (let i = 0; i < state.appointments.length; i++) {
            if (state.appointments[i].apptid == payload.apptid) {
                if ("editing" in state.appointments[i]) {
                    state.appointments[i].editing = true;
                } else {
                    state.appointments[i]["editing"] = true;
                }
            } else {
                delete state.appointments[i].editing;
            }
        }
        console.log(me, "raw appointment", state.appointments);
    },
};

const actions = {
    /**
     * getFilesByAppointmentId
     * @param {*} commit
     * @param {*} apptid
     */
    async getFilesByAppointmentId({ commit }, apptid) {
      const fn = "getFilesByAppointmentId"
        //if (commit) {
        console.log(me, fn, apptid);
        //}
        AppointmentAdapter.getFilesByAppointmentId(apptid, function(err, res) {
            if (err) {
                commit(
                    "setAlert",
                    { type: "error", message: err.message },
                    { root: true }
                );
            } else {
                console.log(
                    "Vuex action Appoinments/getFilesByAppointmentId",
                    res.data
                );
            }
            for (let appointment of state.appointments) {
                if (appointment.apptid == apptid) {
                    appointment["files"] = res.data;
                    commit("replaceAppointment", appointment);
                    return;
                }
            }
        });
    },

    /**
     * VUEX Action loadAppointments
     * @param {*} fid Family Id
     * Called when the app loads, after the profile & family have been retrieved
     */
    async loadAppointments({ commit }, fid) {
        await AppointmentAdapter.getAppointmentsByFamilyId(fid, function(
            err,
            res
        ) {
            console.log(
                "AppointmentAdapter.getAppointmentsByFamilyId returned:",
                res.data
            );

            if (err) {
                commit(
                    "setAlert",
                    {
                        type: "error",
                        message: err.message,
                    },
                    { root: true }
                );
            } else {
                if (!res.data) {
                    res.data = [];
                }
                commit("setAppointments", res.data);
            }
        });
    },

    /**
     * saveAppointment
     * @param {*} param0
     * @param {*} payload must be an appointment object; no wrapper.
     */
    async saveAppointment({ commit }, payload) {
        const f = "saveAppointment";
        if (AppointmentHelper.appointmentExists(payload)) {
            console.log(me, f, "Updating EXISTING appointment");
            console.log(me, f, "Payload has files?", payload.files);
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

            if (payload.files) {
                console.log(me, f, "Files exist");
                AppointmentHelper.saveAppointmentFiles(payload);
            }
        } else {
            console.log(
                "AppointmentModule.saveAppointment - saving NEW appointment"
            );
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

    setEditingActive({ commit }, payload) {
        console.log(me, "Appointments/setEditingActive", payload);
        commit("setEditingActive", payload);
    },
    deleteAppointment({ commit }, payload) {
        console.log(me, "Deleting", payload);
        let appointments = state.appointments;
        console.log(me, "# of Appointments before", appointments.length);
        let apptid = payload.apptid;
        for (let i = 0; i < appointments.length; i++) {
            if (appointments[i].apptid == apptid) {
                appointments.splice(i, 1);
                commit("setAppointments", appointments);
                console.log(
                    me,
                    "# of Appointments after",
                    state.appointments.length
                );
                AppointmentAdapter.deleteAppointmentAndFilesById(
                    apptid,
                    function(err, res) {
                        if (err) {
                            commit(
                                "setAlert",
                                {
                                    type: "error",
                                    message: err.message,
                                },
                                { root: true }
                            );
                        } else {
                            console.log(
                                me,
                                "Successfully deleted Appointment",
                                res
                            );
                        }
                    }
                );
            }
        }
    },
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
