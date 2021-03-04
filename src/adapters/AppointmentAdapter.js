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
import FormData from "form-data";
const util = require("util");
const me = "AppointmentAdapter";
const CONTENT_TYPE_MULTIPART_FORMDATA = "multipart/form-data";
const CONTENT_TYPE_APP_JSON = "application/json";
const REQUEST_HEADERS = {
    headers: {
        Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
    },
};

/* const JSON_HEADER = {
    headers: {
        Authorization: "bearer " + process.env.VUE_APP_JWT_BEARER_TOKEN,
        "Content-Type": "application/json",
    },
}; */

/* const AUTH_HEADER_MULTIPART = {
    headers: {
        Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
        "Content-Type": "multipart/form-data",
    },
}; */
// NOTE FOR DAD: When you want to change the api BASE_URL just execute this in your terminal:
// export VUE_APP_API_ENDPOINT="http://192.168.0.7:5000/api/v1/profiles/"

const APPT_ENDPOINT = util.format(
    "%s:%s%s",
    process.env.VUE_APP_API_URL,
    process.env.VUE_APP_API_PORT,
    process.env.VUE_APP_API_APPOINTMENT_ENDPOINT
);

const Helper = {
    prepFormData: function(payload) {
        console.log(
            "AppointmentAdapter.Helper.prepFormData() payload...",
            payload
        );
        let formData = new FormData();
        if (payload.files) {
            for (let file of payload.files) {
                var blob = new Blob([file], { type: file.type });
                formData.append("files", blob, file.name);
            }
            delete payload.files;
        }
        formData.append("fields", JSON.stringify(payload));
        return formData;
    },
};

export const AppointmentAdapter = {
    getAppointmentsByFamilyId: async function(fid, cb) {
        let endpoint = APPT_ENDPOINT + "/fid/" + fid;
        let headers = REQUEST_HEADERS;
        headers.headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        let res = await axios.get(endpoint, headers);
        if (res) {
            console.log(
                "AppointmentAdapter.getAppointmentsByFamilyId",
                res.data
            );
            return cb(null, res.data);
        }
    },

    persistNewAppointment: async function(payload, cb) {
        const f = "persistNewAppointment";
        let endpoint = APPT_ENDPOINT + "/multipart";
        let headers = REQUEST_HEADERS;
        headers["Content-Type"] = CONTENT_TYPE_MULTIPART_FORMDATA;
        console.log("AppointmentAdapter.persistNewAppointment", endpoint);
        {
            const h = Helper;
            let res = await axios.post(
                endpoint,
                h.prepFormData(payload),
                headers
            );
            if (res) {
                console.log(
                    me,
                    f,
                    "Appointment Service returned:",
                    JSON.stringify(res.data)
                );
                cb = res.data;
                return cb;
            }
        }
    },

    persistEditedAppointment: async function(payload, cb) {
        const h = Helper;
        let endpoint = util.format(
            "%s/apptid/%s",
            APPT_ENDPOINT,
            payload.apptid
        );
        let headers = REQUEST_HEADERS;
        headers["Content-Type"] = CONTENT_TYPE_MULTIPART_FORMDATA;
        console.log("AppointmentAdapter.persistEditedAppointment", endpoint);
        let res = await axios.put(endpoint, h.prepFormData(payload), headers);
        if (res) {
            console.log(
                "AppointmentAdapter.persistEditedAppointment; Appointment Service returned:",
                JSON.stringify(res.data)
            );
            cb = res.data;
            return cb;
        }
    },

    getFilesByAppointmentId: async function(apptid, cb) {
        console.log("AppointmentAdapter.getFilesByAppointmentId fired.");
        let endpoint = APPT_ENDPOINT + "/files/apptid/" + apptid;
        let headers = REQUEST_HEADERS;
        headers.headers["Content-Type"] = CONTENT_TYPE_APP_JSON;
        let res = await axios.get(endpoint, headers);
        if (res) {
            console.log("AppointmentAdapter.getFilesByAppointmentId", res.data);
            return cb(null, res.data);
        }
    },
    
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
};
