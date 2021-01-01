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
            <v-btn xoutlined xrounded text @click="clickedEdit">
                Edit
            </v-btn>
            <v-btn xoutlined xrounded text @click="clickedAppointment">
                Appointment
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
/* */

<script>
const { v4: uuidv4 } = require("uuid");
export default {
    name: "ProfileCard",
    data: function() {
        return {
            appointment: {
                apptid: null,
                fid: null,
                caregivername: null,
                subjectname: null,
                consultantname: null,
                apptdate: null,
                appttime: null,
                complaint: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                postalcode: null,
                countrycode: "US",
            },
        };
    },
    props: ["profile", "family"],
    computed: {
        fname() {
            let namearr = this.profile.name.split(" ");
            return namearr[0];
        },
        editingAppointmentId() {
            let appointment = this.$store.getters["AppState/appointment"];
            return appointment.editingAppointmentId;
        },
        caregiverProfile() {
            let profiles = this.$store.getters["Profiles/profiles"];
            return profiles[0];
        },
    },
    watch: {
        editingAppointmentId() {
            if (this.editingAppointmentId) {
                this.$router.push("/newappointment");
            }
        },
    },
    methods: {
        clickedEdit() {
            this.$store.commit("AppState/setEditingProfileId", this.profile.id);
            this.$router.push("/editprofile");
        },
        /* refactor...  */
        clickedAppointment() {
            let uuid = uuidv4();
            this.appointment.apptid = uuid;
            this.appointment.fid = this.family.id;
            this.appointment.caregivername = this.caregiverProfile.name;
            this.appointment.subjectname = this.profile.alias;
            this.$store.dispatch("AppState/setAppointment", {
                editingAppointment: this.appointment,
                editingAppointmentId: uuid,
                currentTab: 0,
            });
            this.$store.commit("AppState/setEditingProfileId", this.profile.id);
        },
    },
};
</script>
