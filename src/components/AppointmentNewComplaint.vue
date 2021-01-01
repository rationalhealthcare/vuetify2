<!-- @format -->

<template>
    <v-sheet>
        <form id="complaintForm">
            <v-text-field
                prepend-icon="mdi-thermometer"
                id="reason"
                label="Reason for visit"
                v-model="appointment.apptreason"
                @change="sync"
            ></v-text-field>

            <template>
                <v-row>
                    <v-col cols="11" sm="5">
                        <v-dialog
                            ref="dialog1"
                            v-model="modal1"
                            :return-value.sync="appointment.apptdate"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="appointment.apptdate"
                                    label="Choose a date..."
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    @change="sync"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                color="secondary"
                                v-if="modal1"
                                v-model="appointment.apptdate"
                                full-width
                                @change="sync"
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="modal1 = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="
                                        $refs.dialog1.save(appointment.apptdate)
                                    "
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="11" sm="5">
                        <v-dialog
                            ref="dialog"
                            v-model="modal2"
                            :return-value.sync="appointment.appttime"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="appointment.appttime"
                                    label="Choose a time..."
                                    prepend-icon="mdi-clock-time-four-outline"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    @change="sync"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                color="secondary"
                                v-if="modal2"
                                v-model="appointment.appttime"
                                full-width
                                @change="sync"
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="modal2 = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="
                                        $refs.dialog.save(appointment.appttime)
                                    "
                                >
                                    OK
                                </v-btn>
                            </v-time-picker>
                        </v-dialog>
                    </v-col>
                </v-row>
            </template>
        </form>
        <!--         <v-card-actions>
            <v-btn outlined text @click="save">
                Save Appointment
            </v-btn>
        </v-card-actions> -->
    </v-sheet>
</template>
<script>
export default {
    name: "ApointmentNewComplaint",
    data: function() {
        return {
            modal1: false,
            modal2: false,
            appointment: {
                apptreason: null,
                apptdate: new Date().toISOString().substr(0, 10),
                appttime: "8:30",
/*                 xapptid: null,
                xfid: null,
                xcaregivername: null,
                xsubjectname: null,
                xconsultantname: null,
                xaddress1: null,
                xaddress2: null,
                xcity: null,
                xstate: null,
                xpostalcode: null,
                xcountrycode: "US", */
            },
        };
    },
    computed: {
        appointmentState: function() {
            return this.$store.getters["AppState/appointment"];
        },
        /* Not sure we need any of these below... */
        /*         familyId: function() {
            let families = this.$store.getters["Profiles/families"];
            return families[0].id;
        },
        caregivername: function() {
            let profiles = this.$store.getters["Profiles/profiles"];
            return profiles[0].name;
        },
        editingAppointmentId: function() {
            let appointment = this.$store.getters["AppState/appointment"];
            if (appointment) {
                return appointment.editingAppointmentId;
            } else {
                return null;
            }
        },
        editingAppointment: function() {
            let id = this.editingAppointmentId;
            console.log("editingAppointmentId", id);
            if (id) {
                let appointments = this.$store.getters[
                    "Appointments/appointments"
                ];
                if (appointments) {
                    for (let appointment of appointments) {
                        console.log(appointment);
                        if (appointment.apptid == id) {
                            return appointment;
                        }
                    }
                    return null;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },

        currentTabIndex: function() {
            let appointment = this.$store.getters["AppState/appointment"];
            console.log("currentTabIndex", appointment.currentTabIndex);
            return appointment.currentTabIndex
                ? appointment.currentTabIndex
                : null;
        }, */
    },
    watch: {
        /* don't need this */
        /*         currentTabIndex() {
            alert("MyTabIndex", this.myTabIndex);
            //this.save();
        }, */
    },
    methods: {
        /*         sync: function() {
            this.sync();
        }, */
        sync: async function() {
            // get the curent wip from AppState
            let apptWip = this.appointmentState.editingAppointment;
            console.log("AppointmentNewComplaint.sync", apptWip);
            //update it with local changes
            apptWip.apptreason = this.appointment.apptreason;
            apptWip.apptdate = this.appointment.apptdate;
            apptWip.appttime = this.appointment.appttime;

            //update the appointment wrapper object
            let payload = {
                editingAppointment: apptWip,
                editingAppointmentId: apptWip.apptid,
                currentTabIndex: this.currentTabIndex,
            };
            console.log("sync", payload);
            this.$store.dispatch("AppState/setAppointment", payload);
        },
        /*         xsync: async function() {
            let editedAppointment = {
                editingAppointment: this.appointment,
                editingAppointmentId: this.editingAppointmentId,
                currentTabIndex: this.currentTabIndex,
            };
            console.log("sync", editedAppointment);
            this.$store.dispatch("AppState/syncAppointment", editedAppointment);
        }, */
        /*         xsave: async function() {
            let appointment = null;
            if (this.editingAppointment) {
                //computed from Vuex state; capture the updates made on this tab
                appointment = this.editingAppointment;
                appointment.complaint = this.appointment.complaint;
                appointment.apptdate = this.appointment.apptdate;
                appointment.appttime = this.appointment.appttime;
            } else {
                // local component state; already inclused data added on this tab
                appointment = this.appointment;
            }
            this.appointment.fid = this.familyId;
            this.appointment.caregivername = this.caregivername;
            let uuid = await this.$store.dispatch(
                "Appointments/saveAppointment",
                appointment
            );
            if (uuid) {
                // dispatch to AppState/appointment so that other
                // components in the three step 'new appointment'
                // process can use the appointment Id
                console.log("uuid returned  to component:", uuid);
                this.$store.dispatch("AppState/setAppointment", {
                    editingAppointmentId: uuid,
                });
            } else {
                console.log(
                    "AppointmentNewConsultant.save: Expected new Appointment ID was not returned to the Component."
                );
            }
        }, */
    },
};
</script>
