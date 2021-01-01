<!-- @format -->

<template>
    <div>
        <v-card
            flat
            class="mx-auto"
            xmax-width="450"
            xheight="280"
            style="overflow-y: auto;"
        >
            <form>
                <v-text-field
                    label="Doctor or organization name"
                    v-model="appointment.consultantname"
                    @change="sync"
                ></v-text-field>
                <v-text-field
                    label="Address1"
                    v-model="appointment.address1"
                    @change="sync"
                ></v-text-field>
                <v-text-field
                    label="Address2"
                    v-model="appointment.address2"
                    @change="sync"
                ></v-text-field>
                <v-text-field
                    label="City"
                    v-model="appointment.city"
                    @change="sync"
                ></v-text-field>
                <v-row>
                    <v-col>
                        <v-text-field
                            label="State"
                            v-model="appointment.state"
                            @change="sync"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            label="Postal Code"
                            v-model="appointment.postalcode"
                            @change="sync"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </form>

<!--             <v-card-actions>
                <v-btn outlined text @click="save">
                    Save Appointment
                </v-btn>
            </v-card-actions> -->
        </v-card>
    </div>
</template>
<script>
export default {
    name: "AppointmentNewConsultantSm",
    data: function() {
        return {
            myTabIndex: 0,
            appointment: {
 /*                xapptid: null,
                xfid: null,
                xcaregivername: null,
                xsubjectname: null,
                xapptdate: null,
                xappttime: null,
                xcomplaint: null, */

                consultantname: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                postalcode: null,
                countrycode: "US",
            },
        };
    },

    computed: {
        appointmentState: function() {
            return this.$store.getters["AppState/appointment"];
        },

        /* don't need these */
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
            return appointment.editingAppointmentId;
        }, */
    },
/*     watch: {
        editingAppointmentId() {
            this.appointment.apptid = this.editingAppointmentId;
        },
    }, */
    methods: {
        /* could go straight to "sync" */
/*         sync: function() {
            console.log("sync.");
            this.sync();
        }, */

        sync: async function() {
            // get the curent wip from AppState
            let apptWip = this.appointmentState.editingAppointment;
            console.log("AppointmentNewConsultantSm.sync", apptWip);
            //update it with local changes
            apptWip.consultantname = this.appointment.consultantname;
            apptWip.address1 = this.appointment.address1;
            apptWip.address2 = this.appointment.address2;
            apptWip.city = this.appointment.city;
            apptWip.state = this.appointment.state;
            apptWip.postalcode = this.appointment.postalcode;
            apptWip.countrycode = this.appointment.countrycode;

            //update the appointment wrapper object
            let payload = {
                editingAppointment: apptWip,
                editingAppointmentId: apptWip.apptid,
                currentTabIndex: this.currentTabIndex,
            };
            console.log("sync", payload);
            this.$store.dispatch("AppState/setAppointment", payload);
        },

/*         save: async function() {
            this.appointment.fid = this.familyId;
            this.appointment.caregivername = this.caregivername;

            let uuid = await this.$store.dispatch(
                "Appointments/saveAppointment",
                this.appointment
            );
            if (uuid) {
                // dispatch to AppState/appointment so that other
                // components in the three steo 'new appointment'
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
