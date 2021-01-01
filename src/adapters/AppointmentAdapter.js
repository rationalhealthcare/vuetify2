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
const AUTH_HEADER = {
    headers: {
        Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnt9LCJpYXQiOjE1OTQ1NzA2MzR9.lLuy9YqLPKjioo-RhlwzyZ0J01k4ywWtxbmIJP44AQw",
        "Content-Type": "application/json",
    },
};

// NOTE FOR DAD: When you want to change the api BASE_URL just execute this in your terminal:
// export VUE_APP_API_ENDPOINT="http://192.168.0.7:5000/api/v1/profiles/"

/* 
Making a change
  export VUE_APP_APPOINTMENT_API_ENDPOINT="http://192.168.0.7:5000/api/v1/appointments/"
*/
const util = require("util");
const BASE_URL = util.format("", process.env.VUE_APP_APPOINTMENT_API_ENDPOINT);

export const AppointmentAdapter = {
    persistNewAppointment: async function(payload, cb) {
        let endpoint = BASE_URL;
        console.log("AppointmentAdapter.persistAppointment", endpoint);
        let res = await axios.post(endpoint, payload, AUTH_HEADER);
        if (res) {
            console.log(
                "AppointmentAdapter.persistAppointment; Appointment Service returned:",
                JSON.stringify(res.data)
            );
            cb = res.data;
            return cb;
        }
    },

    persistEditedAppointment: async function(payload, cb) {
        let endpoint = BASE_URL + "apptid/" + payload.apptid;
        console.log("AppointmentAdapter.persistEditedAppointment", endpoint);
        let res = await axios.put(endpoint, payload, AUTH_HEADER);
        if (res) {
            console.log(
                "AppointmentAdapter.persistEditedAppointment; Appointment Service returned:",
                JSON.stringify(res.data)
            );
            cb = res.data;
            return cb;
        }
    },
};
