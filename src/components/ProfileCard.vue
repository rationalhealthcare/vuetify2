<!-- @format -->

<template>
    <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">
                    {{ family.name }}
                </div>
                <v-list-item-title class="headline accent--text mb-1">
                    <div v-if="profile.alias">
                        {{ profile.alias }}
                    </div>
                    <div v-else>
                        {{ fname }}
                    </div>
                </v-list-item-title>
                <v-list-item-subtitle> </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar round size="80" color="secondary">
                <span class="mb-2" v-if="profile.avatarpath">
                    <img :src="profile.avatarpath" :alt="profile.name" />
                </span>
                <span v-else>
                    {{ profile.initials }}
                </span>
            </v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
            <v-btn text @click="clickedEditProfile">
                Edit
            </v-btn>
            <v-btn text @click="clickedNewAppointment">
                Appointment
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
/* */

<script>
"use strict";
const { v4: uuidv4 } = require("uuid");
export default {
    name: "ProfileCard",
    data: function() {
        return {
            appointment: {
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
    },
    props: ["profile", "family"],
    computed: {
        fname() {
            let namearr = this.profile.name.split(" ");
            return namearr[0];
        },
        editingAppointment: function() {
            let appointments = this.$store.getters["Appointments/appointments"];
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].editing) {
                    return appointments[i];
                }
            }
            return null;
        },
        caregiverProfile() {
            let profiles = this.$store.getters["Profiles/profiles"];
            return profiles[0];
        },
    },
    watch: {
        editingAppointment() {
            if (this.editingAppointment) {
                this.$router.push("/appointments/new");
            }
        },
    },
    methods: {
        clickedEditProfile() {
            this.$store.commit("AppState/setEditingProfileId", this.profile.id);
            this.$router.push("/editprofile");
        },
        clickedNewAppointment() {
            let uuid = uuidv4();
            this.appointment.apptid = uuid;
            this.appointment.fid = this.family.id;
            this.appointment.caregivername = this.caregiverProfile.name;
            this.appointment.apptsubjectid = this.profile.id;
            this.appointment.subjectname = this.profile.alias;
            this.appointment.subjectavatarpath = this.profile.avatarpath;
            this.$store.dispatch(
                "Appointments/saveAppointment",
                this.appointment
            );
            //setting the new appointment's editing flag by comitting a
            //mutation so as to deactivate editing on all other appointments
            this.$store.commit(
                "Appointments/setEditingActive",
                this.appointment
            );
        },
    },
};
</script>
