<!-- @format -->

<template>
    <v-row justify="center">
        <v-col xs="12" md="10" lg="8">
            <v-card class="mx-auto">
                <v-card-title>
                    <p class="headline accent--text mb-0">
                        Appointments
                    </p>
                </v-card-title>

                <v-card-actions>
<!--                     <v-fab-transition>
                        <v-btn
                            @click="fabEditclicked"
                            xv-show="!hidden"
                            color="accent"
                            dark
                            fab
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </v-fab-transition> -->
                    <!--  -->
                    <!--  -->
                    <v-fab-transition>
                        <v-btn
                            @click="newApptDialog = true"
                            xv-show="!hidden"
                            color="accent"
                            dark
                            absolute
                            right
                            fab
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-card-actions>

                <v-card-text>
                    <v-list three-line>
                        <template v-for="(appt, i) in appointments">
                            <v-list-item :key="i">
                                <v-list-item-avatar>
                                    <v-img
                                        :src="appt.subjectavatarpath"
                                    ></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title
                                        v-html="appt.apptreason"
                                    ></v-list-item-title>
                                    <v-list-item-subtitle
                                        v-html="
                                            appt.consultantname &&
                                            appt.apptdate &&
                                            appt.appttime
                                                ? appt.consultantname +
                                                  '<br>' +
                                                  appt.apptdate +
                                                  ' at ' +
                                                  appt.appttime
                                                : appt.consultantname &&
                                                  !appt.apptdate &&
                                                  !appt.appttime
                                                ? appt.consultantname
                                                : !appt.consultantname &&
                                                  appt.apptdate &&
                                                  appt.appttime
                                                ? appt.apptdate +
                                                  ' at ' +
                                                  appt.appttime
                                                : ''
                                        "
                                    ></v-list-item-subtitle>
                                    <v-btn
                                        text
                                        small
                                        @click="editClicked(appt)"
                                    >
                                        <v-icon>mdi-account-edit</v-icon>
                                    </v-btn>
                                    <v-btn
                                        text
                                        small
                                        @click="deleteClicked(appt)"
                                        ><v-icon
                                            >mdi-calendar-remove</v-icon
                                        ></v-btn
                                    >
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card-text>
            </v-card>

            <!-- DELETE "ARE YOU SURE?" DIALOG STARTS HERE -->
            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">
                        Are you sure?
                    </v-card-title>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="dialogClickDelete"
                        >
                            Delete
                        </v-btn>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="dialogClickCancel"
                        >
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- DELETE "ARE YOU SURE?"DIALOG ENDS HERE -->
            <!-- NEW APPOINTMENT DIALOG STARTS HERE -->
            <v-dialog v-model="newApptDialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">
                        New Appointment
                    </v-card-title>
                    <v-card-text>
                        <v-row align="center">
                            <v-col class="d-flex" cols="12" sm="6">
                                <v-select
                                    return-object
                                    :items="this.profiles"
                                    :item-text="'alias'"
                                    :item-value="'id'"
                                    v-model="subjectProfile"
                                    label="Who's appointment is it?"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="dlgclick_newApptCreate"
                        >
                            Create
                        </v-btn>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="newApptDialog = false"
                        >
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- NEW APPOINTMENT DIALOG ENDS HERE -->
        </v-col>
    </v-row>
</template>

/** */
<script>
"use strict";
const me = "AppointmentsPage";
const { v4: uuidv4 } = require("uuid");
export default {
    name: "AppointmentsPage",
    data: function() {
        return {
            dialog: false,
            newApptDialog: false,
            /* newAppointment: false, */
            delete: false,
            appointments: [],
            editingAppointment: null,
            deletingAppointment: null,
            subjectProfile: null,
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
    mounted() {
        console.log(me, "is MOUNTED.");
        this.$nextTick(function() {
            this.appointments = this.vuexAppointments;
        });
    },
    computed: {
        vuexAppointments: function() {
            return this.$store.getters["Appointments/appointments"];
        },
        families() {
            return this.$store.getters["Profiles/families"];
        },
        profiles() {
            return this.$store.getters["Profiles/profiles"];
        },
        apptSubjectId() {
            return this.appointment.apptsubjectid;
        },
        subjectProfileId() {
            if (!this.subjectProfile) {
                return null;
            } else {
                return this.subjectProfile.id;
            }
        },
    },
    watch: {
        subjectProfileId() {
            console.log(me, "WATCH/subjectProfileId() fired.");
            if (this.subjectProfile) {
                console.log(
                    me,
                    "WATCH/subjectProfileId() 'subjectProfile' has a value."
                );
                this.updateSubjectParams();
            }
        },
        vuexAppointments() {
            this.appointments = this.vuexAppointments;
        },
        //TODO: verify that this does the right thing when editing existing and
        //      creating new
        editingAppointment: function() {
            this.$router.push("/appointment/edit");
        },
        newApptDialog: function() {
            this.initializeAppointment();
        },
    },

    methods: {
        updateSubjectParams() {
            this.appointment.apptsubjectid = this.subjectProfile.id;
            this.appointment.subjectname = this.subjectProfile.name;
            this.appointment.subjectavatarpath = this.subjectProfile.avatarpath;
        },
        initializeAppointment() {
            this.appointment.apptid = uuidv4();
            this.appointment.fid = this.families[0].id;
            this.appointment.caregivername = this.profiles[0].name;
        },
        fabEditclicked() {
            alert("fabEditClicked");
        },
        editClicked(appt) {
            this.$store.dispatch("Appointments/setEditingActive", appt);
            //set locally to trigger computed property to trigger page navigation
            this.editingAppointment = appt;
        },
        deleteClicked(appt) {
            console.log(me, "Deleting", appt);
            this.deletingAppointment = appt;
            this.dialog = true;
        },
        dialogClickDelete() {
            this.$store.dispatch(
                "Appointments/deleteAppointment",
                this.deletingAppointment
            );
            this.deletingAppointment = null;
            this.dialog = false;
        },
        dialogClickCancel() {
            this.deletingAppointment = null;
            this.dialog = false;
        },

        /* Events */
        dlgclick_newApptCreate() {
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
            this.editingAppointment = this.appointment;
        },
    },
};
</script>
