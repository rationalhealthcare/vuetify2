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
                    <v-list three-line max-width="600">
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
                                    <v-card-actions>
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
                                    </v-card-actions>
                                    <v-divider
                                        v-if="i < appointments.length - 1"
                                    ></v-divider>
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
            <v-dialog
                v-model="newApptDialog"
                xmax-width="290"
                :width="dialogWidth()"
            >
                <v-card>
                    <v-card-title class="headline">
                        New Appointment
                    </v-card-title>
                    <v-card-text>
                        <v-row align="center">
                            <v-col class="d-flex" xcols="12" xlg="12" xsm="6">
                                <v-select
                                    return-object
                                    :items="this.profiles"
                                    :item-text="'alias'"
                                    :item-value="'id'"
                                    v-model="subjectProfile"
                                    label="Whose appointment is it?"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="newAppt_click"
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

import { S3Adapter } from "@/adapters/S3Adapter.js";
import { AppointmentAdapter as apptApi } from "@/adapters/AppointmentAdapter.js";

const me = "AppointmentsPage";

export default {
    name: "AppointmentsPage",
    data: function() {
        return {
            dialogWidth: function() {
                switch (this.$vuetify.breakpoint.name) {
                    case "xs":
                        return 290;
                    case "sm":
                        return 290;
                    case "md":
                        return 400;
                    case "lg":
                        return 500;
                    case "xl":
                        return 800;
                }
            },
            dialog: false,
            newApptDialog: false,
            delete: false,
            appointments: [],
            editingAppointment: null,
            deletingAppointment: null,
            subjectProfile: null,
            apptFileKeys: [],
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
        /*         families() {
            return this.$store.getters["Profiles/families"];
        }, */
        profiles() {
            return this.$store.getters["Profiles/profiles"];
        },
    },
    watch: {
        vuexAppointments() {
            this.appointments = this.vuexAppointments;
        },
    },

    methods: {
        newAppt_click() {
            const fn = "newAppt_click";
            console.log(me, fn);
            this.newApptDialog = false;
            let route = "/appointments/new/" + this.subjectProfile.id;
            this.$router.push(route);
        },
        fabEditclicked() {
            alert("fabEditClicked");
        },
        editClicked(appt) {
            const fn = "editClicked";
            console.log(me, fn, appt);
            let route = "/appointment/edit/";
            route += appt.apptid;
            console.log(me, fn, "$router pushing", route);
            this.$router.push(route);
        },
        deleteClicked(appt) {
            console.log(me, "Deleting", appt);
            this.deletingAppointment = appt;
            this.dialog = true;
        },
        async dialogClickDelete() {
            const fn = "dialogClickDelete";
            console.log(fn);

            // delete files, if any, from the S3 bucket
            this.deleteFromS3();

            // delete from the API
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
        /**
         *
         */
        async deleteFromS3() {
            const fn = "deleteFromS3()";

            // Go to the API to get the keys for the files in S3
            await this.updateFileKeys();

            console.log(fn, "keys:", this.apptFileKeys);

            // Delete the files, if any, from S3
            if (this.apptFileKeys.length > 0) {
                S3Adapter.deleteArray(this.apptFileKeys);
            }
        },

        /**
         * What? Why? How? When?
         * @returns true on success, otherwise false.
         */
        async updateFileKeys() {
            const fn = "updateFileKeys()";

            const apptid = this.deletingAppointment.apptid;
            console.log(fn, "apptid", apptid);

            try {
                const res = await apptApi.getFileKeysByApptId(apptid);
                console.log(fn, "Adapter returned:", res);
                this.apptFileKeys = res;
            } catch (err) {
                console.log(fn, err);
            }
        },
    },
};
</script>
