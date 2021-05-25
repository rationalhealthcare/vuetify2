/**
 * /*
 *   ProfileAdapter
 *   Acts as an adapter between the ProfilesModule and the Profile REST service.
 *   Like an API.
 *
 * @format
 */
"use strict";
import axios from "axios";
const me = "ProfileAdapter";
const util = require("util");
// log = util.debuglog("ProfileAdapter");
const AUTH_HEADER = {
    headers: {
        Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
        "Content-Type": "application/json",
    },
};

// NOTE FOR DAD: When you want to change the api BASE_URL just execute this in your terminal:
// export VUE_APP_API_ENDPOINT="http://192.168.0.7:5000/api/v1/profiles/"

/* 
const BASE_URL = util.format(
  "%s/api/v1/profiles/",
  process.env.VUE_APP_API_ENDPOINT
);
 */
/* const BASE_URL = util.format(
    "",
    process.env.VUE_APP_API_URL + ":" + process.env.VUE_APP_API_PORT
); */
//const BASE_URL = "http://192.168.0.7:5000/api/v1/profiles/";
//const BASE_URL = "https://api.kergiva.app/api/v1/profiles/";

/* const BASE_URL =
    process.env.VUE_APP_API_URL + ":" + process.env.VUE_APP_API_PORT;
 */
//VUE_APP_API_BASE_URL=http://192.168.1.128:5000/api/v1
const BASE_URL = util.format(
    "%s:%s",
    process.env.VUE_APP_API_URL,
    process.env.VUE_APP_API_PORT
);

/* const URL = util.format(
    "%s:%s/%s",
    process.env.VUE_APP_API_URL,
    process.env.VUE_APP_API_PORT,
    process.env.VUE_APP_API_PROFILES_ENDPOINT
); */

const PROFILES_ENDPOINT = BASE_URL + "/api/v1/profiles";
const CONSULTANT_ENDPOINT = BASE_URL + "/api/v1/profiles/consultant";

axios.defaults.baseURL = BASE_URL;

//log("BASE_URL %d", BASE_URL);
//log("PROFILES_ENDPOINT %d", PROFILES_ENDPOINT);
//log("CONSULTANT_ENDPOINT %d", CONSULTANT_ENDPOINT);

export const ProfileAdapter = {
    /*  new profile for _new_ user */
    createNewUserProfile: async function(payload) {
        //  payload structure: {uid, name, email}
        const profile = {
            newuser: true,
            familyId: null,
            profile: payload,
        };
        console.log("Creating profile for user : " + JSON.stringify(profile));
        let res = await axios.post(
            PROFILES_ENDPOINT + "/",
            profile,
            AUTH_HEADER
        );
        if (res) {
            console.log("Profile adapter got: " + JSON.stringify(res.data));
            return res;
        }
    },

    /* new profile, _not_ for a new user */
    createNewProfile: async function(payload) {
        // payload inbound structure: {familyid, profile: {}}
        payload["newuser"] = false;
        console.log("ProfileAdapter.createNewProfile", JSON.stringify(payload));
        let res = await axios.post(
            PROFILES_ENDPOINT + "/",
            payload,
            AUTH_HEADER
        );
        if (res) {
            console.log(
                "createNewProfile: Profile adapter got: " +
                    JSON.stringify(res.data[0])
            );
            return res.data[0];
        }
    },

    loadProfiles: async function(uid) {
        const fn = "loadProfiles()";
        //let uri = PROFILES_ENDPOINT + "/uid/" + uid;
        let uri = PROFILES_ENDPOINT + "/uid/" + uid;
        console.log(me, fn, "axios.get", uri);
        try {
            let res = await axios.get(uri, AUTH_HEADER);

            console.log(me, fn, "axios returned", res);
            if (res) {
                console.log(
                    "ProfileAdapter.loadProfiles got from API:",
                    JSON.stringify(res)
                );
                return res.data;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    updateProfile: async function(profile) {
        let uri = PROFILES_ENDPOINT + "/id/" + profile.id;
        let res = await axios.put(uri, profile, AUTH_HEADER);
        if (res) {
            console.log(
                "ProfileAdapter.updateProfile got response: ",
                JSON.stringify(res)
            );
            return res;
        } else {
            throw "ProfileAdapter.updateProfile No response from API.";
        }
    },

    updateFamiliy: async function(family, cb) {
        let uri = PROFILES_ENDPOINT + "/family/fid/" + family.id;
        let res = await axios.put(uri, family, AUTH_HEADER);
        if (res) {
            console.log(
                "ProfileAdapter.updateFamiliy got response: ",
                JSON.stringify(res)
            );
            cb(null, res);
        } else {
            cb(res, null);
            //throw "ProfileAdapter.updateFamiliy: No response from API.";
        }
    },

    /**
     *
     * Consultant
     *
     */

    loadConsultants: async function(fid, cb) {
        try {
            let uri = CONSULTANT_ENDPOINT + "/fid/" + fid;
            let res = await axios.get(uri, AUTH_HEADER);
            if (res) {
                console.log(
                    "ProfileAdapter.loadConsultants received:",
                    res.data
                );
                /*
                * Reformat the arrays received from the Profile Consultant 
                * service
                * INPUT:  
                { practitioners,
                  organizations,
                  addresses,
                  phones};
                */
                var consultants = res.data.organizations.concat(
                    res.data.practitioners
                );
                for (let consultant of consultants) {
                    var npi = consultant.npi;
                    var addresses = res.data.addresses.filter(function(
                        address
                    ) {
                        return address.npi === npi;
                    });
                    for (let address of addresses) {
                        var phones = res.data.phones.filter(function(phone) {
                            return (
                                phone.npi === npi && phone.md5 === address.md5
                            );
                        });
                        address["phones"] = phones;
                    }
                    consultant["addresses"] = addresses;
                }
                cb(null, consultants);
            }
        } catch (e) {
            cb(e, null);
        }
    },

    persistConsultant: async function(payload, cb) {
        let endpoint = CONSULTANT_ENDPOINT + "/";
        console.log("ProfileAdapter.persistConsultant", endpoint);
        let res = await axios.post(endpoint, payload, AUTH_HEADER);
        if (res) {
            console.log(
                "ProfileAdapter.persistConsultant; service returned:" +
                    JSON.stringify(res.data)
            );
            cb = res.data;
            return cb;
        }
    },

    deleteConsultant: async function(payload, cb) {
        let endpoint = CONSULTANT_ENDPOINT + "/";

        // Note order of params
        let params = {
            data: { npi: payload.npi, fid: payload.fid },
            headers: {
                Authorization: process.env.VUE_APP_JWT_BEARER_TOKEN,
            },
        };
        console.log("ProfileAdapter.deleteConsultant", JSON.stringify(params));
        let res = await axios.delete(endpoint, params);
        if (res) {
            console.log(
                "deleteConsultant: Profile adapter got: " +
                    JSON.stringify(res.data)
            );
            cb = res.data;
            return cb;
        }
    },
};
