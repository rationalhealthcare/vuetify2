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
const BASE_URL = "http://192.168.0.7:5000/api/v1/profiles/";
//const BASE_URL = "https://api.kergiva.app/api/v1/profiles/";

export const ProfileAdapter = {
  createProfile: async function(payload) {
    console.log("Creating profile for user : " + JSON.stringify(payload));
    let res = await axios.post(BASE_URL, payload, AUTH_HEADER);
    if (res) {
      console.log(
        "Profile adapter is about to return: " + JSON.stringify(res.data[0])
      );
      return res.data[0];
    }
  },

  loadProfile: async function(uid) {
    console.log("Fetching profile for uid: " + uid);
    let uri = BASE_URL + "uid/" + uid;
    let res = await axios.get(uri, AUTH_HEADER);
    if (res) {
      return res.data;
    }
  }
};
