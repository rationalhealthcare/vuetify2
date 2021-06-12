/**
 *
 * Appointments VUEX Module
 *
 * @format
 * @/store/modules/AppointmentsModule.js
 */

"use strict";
const namespaced = true;
const me = "Vuex AppointmentModule";
import { AppointmentAdapter } from "@/adapters/AppointmentAdapter.js";
import { S3Adapter } from "@/adapters/S3Adapter.js";

/**
 * Utility function to remove binary files from the meta-file object before
 * the appointment is persisted to the API.
 */

const state = {
    appointments: [],
    appointmentModel: {
        apptid: null,
        fid: null,
        caregivername: null,
        apptsubjectid: null,
        subjectname: null,
        consultantname: null,
        apptdate: null,
        appttime: null,
        apptreason: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        postalcode: null,
        countrycode: "US",
        notes: null,
        files: [],
        subjectavatarpath: null,
    },
};

const getters = {
    appointments: (state) => state.appointments,
    appointmentModel: (state) => state.appointmentModel,
};

const mutations = {
    addAppointment(state, payload) {
        let index = state.appointments.length;
        state.appointments.splice(index, 0, payload);
    },
    removeAppointment(state, index) {
        //removes one appointment, identified by the given index
        state.appointments.splice(index, 1);
    },
    updateAppointment(state, payload) {
        let index = payload.index;
        let appt = payload.appt;
        state.appointments[index] = appt;
    },
    setAppointments(state, payload) {
        state.appointments = payload;
    },
    setAppointmentFiles(state, payload) {
        // payload: {index: Number, files:[]}
        state.appointments[payload.index].files = payload.files;
    },
    setApptFileKeys(state, payload) {
        state.apptFileKeys = payload;
    },
};

const actions = {
    /********** GETTERS & SETTERS **********/

    setAppointments({ commit }, payload) {
        commit("setAppointments", payload);
    },

    async setAppointment({ commit }, payload) {
        for (let i = 0; i < state.appointments.length; i++) {
            let appt = state.appointments[i];
            if (appt.apptid === payload.apptid) {
                commit("updateAppointment", { index: i, appt: payload });
                return true;
            }
        }
    },

    /* METHODS */

    addAppointment({ commit }, payload) {
        commit("addAppointment", payload);
    },

    /**
     * addMetaFileObjectsByApptId
     * @param {*} apptid Appointment Id
     * @returns an array of files for the given appointment id.
     */
    async addMetaFileObjectsByApptId({ commit }, apptid) {
        if (!commit) return;
        const fn = "addMetaFileObjectsByApptId()";
        console.log(fn, apptid);
        const adapter = AppointmentAdapter;
        await adapter.getFilesByAppointmentId(apptid, (err, res) => {
            if (err) {
                return false;
            } else {
                //get index
                let appts = state.appointments;
                for (let i = 0; i < appts.length; i++) {
                    if (appts[i].apptid === apptid) {
                        //update the appointment
                        console.log(fn, "Adding files.", res.data);
                        let payload = { index: i, files: res.data };
                        commit("setAppointmentFiles", payload);
                        return true;
                    }
                }
                return false;
            }
        });
    },

    /**
     * addBinFiles()
     * Iterates over the "files" array of the "editing" appointment, updating
     * each meta-file object with the corresponding binary object from the S3
     * bucket.
     * @returns True if successful, else whatever.
     */
    async addBinFiles() {
        for (let fileObj of state.editingAppointment.files) {
            let b = await S3Adapter.getBinaryFileByKey(fileObj.key);
            let options = { type: fileObj.type };
            fileObj["file"] = new File([b], fileObj.name, options);
        }
        return true;
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
     * persistNewAppointment
     * @param {*} Vuex commit instance.
     * @param {*} payload The appointment to be persisted.
     * @returns true if successfule, else false.
     *
     */
    persistNewAppointment({ commit }, payload) {
        if (!commit) return;
        const fn = "persistNewAppointment()";
        console.log(fn);

        AppointmentAdapter.persistNewAppointment(payload, function(err, res) {
            if (err) {
                console.log(me, fn, "Adapter returned", err);
                return false;
            } else {
                console.log(me, fn, "Adapter returned", res);
                return true;
            }
        });
    },

    persistEditedAppointment({ commit }, payload) {
        if (!commit) return;
        const fn = "persistEditedAppointment()";
        console.log(fn);

        const adapt = AppointmentAdapter;
        adapt.persistEditedAppointment(payload, function(err, res) {
            console.log(fn, "Adapter returned", err ? err : res);
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    },

    /**
     * deleteAppointment
     * @param {*} Vuex commit instance.
     * @param {*} payload The appointment to be deleted.
     * Deletes the appointment from the Vuex appointments array and from the
     * appointment API.
     */
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

    /**
     *  deleteAppointmentVuexState
     *
     *  Deletes the specified appointment from the Vuex appointments array.
     *  Does not attempt to delete from the Appointments API. Call this when
     *  navigating away from a new appointment when the user has not "saved"
     *  the appointment, i.e. the appointment has not been persisted to the
     *  Appointment API.
     *
     * @param apptid is the appointment Id.
     */
    deleteAppointmentVuexState({ commit }, apptid) {
        //example: pos = myArray.map(function(e) { return e.hello; }).indexOf('stevie');
        const index = state.appointments
            .map(function(e) {
                return e.apptid;
            })
            .indexOf(apptid);
        commit("removeAppointment", index);
    },

    /**
     * cacheFileArrayState
     * Caches the state of the appointment "files" array containing user-
     * selected binary files and their Json meta-objects in the Vuex property
     * "fileArrayLastSavedState". Used to identify the files that were  added
     * and removed from the array since last time the appointment was
     * persisted.
     */
    async cacheFileArrayState({ commit }, payload) {
        for (let appt in state.appointments) {
            if (appt.apptid == payload.apptid) {
                let apptFiles = appt.files ? appt.files.slice(0) : [];
                commit("setFileArrayLastSavedState", apptFiles);
                return true;
            }
        }
        return false;
    },

    /**
     *  Management of BINARY appointment files in the S3 bucket
     *
     */

    /**
     * persistAppointmentFiles
     * @param {*} param0
     * @param {*} payload: Array of files wrapped in JSON metadata
     */
    persistAppointmentFiles: async function({ commit }, payload) {
        const fn = "persistAppointmentFiles()";
        console.log(me, fn, payload);
        if (!commit) console.log("no commit");
        if (payload.length > 0) {
            // unpack the binary files from the Json wrapper
            let binFiles = [];
            for (let fileObj of payload) {
                binFiles.push(fileObj.file);
            }
            S3Adapter.uploadArray(binFiles);
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
