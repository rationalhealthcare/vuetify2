/* 
  ProfileAdapter 
  Acts as an adapter between the ProfilesModule and the Profile REST service.
  Like an API. 
*/
import axios from "axios";
const AUTH_HEADER = {
  headers: {
    Authorization:
      "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOnt9LCJpYXQiOjE1OTQ1NzA2MzR9.lLuy9YqLPKjioo-RhlwzyZ0J01k4ywWtxbmIJP44AQw",
    "Content-Type": "application/json"
  }
};


// NOTE FOR DAD: When you want to change the api BASE_URL just execute this in your terminal:
// export VUE_APP_API_ENDPOINT="http://192.168.0.7:5000/api/v1/profiles/"
const util = require("util");
const BASE_URL = util.format(
  "%s/api/v1/profiles/",
  process.env.VUE_APP_API_ENDPOINT
);
//const BASE_URL = "http://192.168.0.7:5000/api/v1/profiles/";
//const BASE_URL = "https://api.kergiva.app/api/v1/profiles/";

export const ProfileAdapter = {
  /*  new profile for _new_ user */
  createNewUserProfile: async function(payload) {
    //  payload structure: {uid, name, email}
    const profile = {
      newuser: true,
      familyId: null,
      profile: payload
    };
    console.log("Creating profile for user : " + JSON.stringify(profile));
    let res = await axios.post(BASE_URL + "/", profile, AUTH_HEADER);
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
    let res = await axios.post(BASE_URL + "/", payload, AUTH_HEADER);
    if (res) {
      console.log(
        "createNewProfile: Profile adapter got: " + JSON.stringify(res.data[0])
      );
      return res.data[0];
    }
  },

  loadProfiles: async function(uid) {
    console.log("Fetching profile for uid: " + uid);
    let uri = BASE_URL + "uid/" + uid;
    let res = await axios.get(uri, AUTH_HEADER);
    if (res) {
      console.log(
        "ProfileAdapter.loadProfiles got from API:",
        JSON.stringify(res)
      );
      return res.data;
    } else {
      throw "Profiles API returned an empty profile.";
    }
  },

  updateProfile: async function(profile) {
    let uri = BASE_URL + "id/" + profile.id;
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
  }
};
