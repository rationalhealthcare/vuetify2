/**
 * /*
 *   AppointmentAdapter
 *   Acts as an adapter between the ProfilesModule and the Profile REST service.
 *   Like an API.
 *
 * @format
 */

"use strict";
import axios from "axios";
const util = require("util");
const me = "AppointmentAdapter";
const CONTENT_TYPE_APP_JSON = "application/json";
const REQUEST_HEADERS = {
    headers: {
        Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
    },
};

// NOTE FOR DAD: When you want to change the api BASE_URL just execute this in your terminal:
// export VUE_APP_API_ENDPOINT="http://192.168.0.7:5000/api/v1/profiles/"

const APPT_ENDPOINT = util.format(
    "%s:%s%s",
    process.env.VUE_APP_API_URL,
    process.env.VUE_APP_API_PORT,
    process.env.VUE_APP_API_APPOINTMENT_ENDPOINT
);

export const AppointmentAdapter = {
    /**
     *
     * @param {*} fid Family ID
     * @param {*} cb Callback. Returns an array of appointments, or an error.
     * @returns
     */
    getAppointmentsByFamilyId: async function(fid, cb) {
        const fn = "getAppointmentsByFamilyId()";
        console.log(me, fn);
        let endpoint = APPT_ENDPOINT + "/fid/" + fid;
        let headers = REQUEST_HEADERS;
        headers.headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        let res = await axios.get(endpoint, headers);
        console.log(me, fn, "res", res);
        if (res) {
            console.log(me, fn, "res.data", res.data);
            // add the files array so that it's reactive when the files are
            // added upon the selection of an appointment
            for (let d of res.data.data) {
                d["files"] = [];
            }
            console.log(me, fn, "Returning", res.data);
            return cb(null, res.data);
        }
    },

    /**
     *
     * @param {*} payload
     * @param {*} cb: callback (err, res){...}
     */
    persistNewAppointment: async function(payload, cb) {
        const fn = "persistNewAppointment()";
        let endpoint = APPT_ENDPOINT + "/appointment";
        let headers = REQUEST_HEADERS;
        headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        console.log(me, fn, endpoint);

        //console.log(me, fn, "Bin files removed.", payload);

        let res = await axios.post(endpoint, payload, headers);
        console.log(me, fn, "API returned", res);
        if (res) {
            return cb(null, res.data);
        } else {
            return cb(new Error("Error calling API."), null);
        }
    },

    persistEditedAppointment: async function(payload, cb) {
        const fn = "persistEditedAppointment()";
        console.log(me, fn, "payload", payload);

        let endpoint = util.format("%s/appointment/", APPT_ENDPOINT);
        let headers = REQUEST_HEADERS;
        headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        console.log(me, fn, endpoint);
        let res = await axios.put(endpoint, payload, headers);
        console.log(me, fn, "API returned:", JSON.stringify(res));
        if (res) {
            return cb(null, res.data);
        }
    },

    /**
     * deleteAppointmentAndFilesById
     * @param {*} apptid Appointment ID
     * @param {*} cb Callback.
     * @returns Confirmation that the opertion was successful, or an error.
     */
    deleteAppointmentAndFilesById: async function(apptid, cb) {
        console.log(me, "deleteAppointmentAndFilesById", apptid);
        let endpoint = APPT_ENDPOINT + "/apptid/" + apptid;
        let headers = REQUEST_HEADERS;
        headers.headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        let res = await axios.delete(endpoint, headers);
        if (res) {
            console.log(me, "deleteAppointmentAndFilesById", res);
            return cb(null, res);
        } else {
            throw "Error deleting Appointment";
        }
    },

    /**
     * getFilesByAppointmentId
     * @param {*} apptid Appointment ID
     * @returns onfirmation that the opertion was successful, or an error.
     */
    getFilesByAppointmentId: async function(apptid, cb) {
        const fn = "getFilesByAppointmentId";
        console.log(me, fn);
        let endpoint = APPT_ENDPOINT + "/files/apptid/" + apptid;
        let headers = REQUEST_HEADERS;
        headers.headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        let res = await axios.get(endpoint, headers);
        if (res) {
            console.log(me, fn, "Returning", res.data);
            return cb(null, res.data);
        } else {
            cb("Error fetching Appointment files.", null);
        }
    },
};
