<!-- @format -->

<template>
    <v-sheet>
        <form xid="complaintForm" v-if="value">
            <v-text-field
                prepend-icon="mdi-thermometer"
                id="reason"
                label="Reason for visit"
                v-model="value.apptreason"
            ></v-text-field>

            <v-row>
                <v-col cols="11" sm="5">
                    <!-- DATE DIALOG BEGINS HERE -->
                    <v-dialog
                        ref="dialog1"
                        v-model="modal1"
                        :return-value.sync="value.apptdate"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="value.apptdate"
                                label="Choose a date..."
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            color="secondary"
                            v-if="modal1"
                            v-model="value.apptdate"
                            full-width
                        >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal1 = false">
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialog1.save(value.apptdate)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-dialog>
                    <!-- DATE DIALOG ENDS HERE -->
                </v-col>
                <v-col cols="11" sm="5">
                    <!-- TIME DIALOG STARTS HERE -->
                    <v-dialog
                        ref="dialog"
                        v-model="modal2"
                        :return-value.sync="value.appttime"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="value.appttime"
                                label="Choose a time..."
                                prepend-icon="mdi-clock-time-four-outline"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-time-picker
                            color="secondary"
                            v-if="modal2"
                            v-model="value.appttime"
                            full-width
                        >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="modal2 = false">
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialog.save(value.appttime)"
                            >
                                OK
                            </v-btn>
                        </v-time-picker>
                    </v-dialog>
                    <!-- TIME DIALOG ENDS HERE -->
                </v-col>
            </v-row>
        </form>
    </v-sheet>
</template>
<script>
export default {
    name: "AppointmentDetails",
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
    data: function() {
        return {
            modal1: false,
            modal2: false,
        };
    },
    watch: {
        value() {
            this.$emit("input", this.value);
        },
    },
};
</script>
