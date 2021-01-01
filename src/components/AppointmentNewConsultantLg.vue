<!-- @format -->
/* eslint-disable */ 
<template>
    <form ref="newConsultant">
        <v-tabs vertical color="secondary">
            <v-tab>
                <v-icon left>
                    mdi-account-edit
                </v-icon>
                <small>Key in a Consultant</small>
            </v-tab>
            <v-tab>
                <v-icon left> mdi-playlist-check </v-icon>

                <small>Select from List </small>
            </v-tab>

            <v-tab-item>
                <v-card outlined>
                    <v-card-text>
                        <v-text-field
                            id="name"
                            label="Doctor or organization name"
                            v-model="appointment.consultantname"
                        ></v-text-field>
                        <v-text-field
                            id="address1"
                            label="Address1"
                            v-model="appointment.address1"
                        ></v-text-field>
                        <v-text-field
                            id="address2"
                            label="Address2"
                            v-model="appointment.address2"
                        ></v-text-field>

                        <v-row>
                            <v-col>
                                <v-text-field
                                    id="city"
                                    label="City"
                                    v-model="appointment.city"
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    id="state"
                                    label="State"
                                    v-model="appointment.state"
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    id="postalcode"
                                    label="Postal Code"
                                    v-model="appointment.postalcode"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn outlined text @click="save">
                            Save Appointment
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>

            <v-tab-item>
                Selecting goes here
            </v-tab-item>
        </v-tabs>
    </form>
</template>
<script>

export default {
    name: "AppointmentNewConsultantLg",
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
    computed: {
        familyId: function() {
            let families = this.$store.getters["Profiles/families"];
            return families[0].id;
        },
        caregivername: function() {
            let profiles = this.$store.getters["Profiles/profiles"];
            return profiles[0].name;
        }
    },
    watch: {

    },
    methods: {
        save: function() {
/*             if (!this.appointment.apptid) {
                this.appointment.apptid = uuidv4;
            } */
            this.appointment.fid = this.familyId;
            this.appointment.caregivername = this.caregivername;

            this.$store.dispatch(
                "Appointments/saveEditedAppointment",
                this.appointment
            );
        },
    },
};
</script>
