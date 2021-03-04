<!-- @format -->

<template>
    <v-row justify="center">
        <v-col xs="12" md="10" lg="8">
            <v-card class="mx-auto">
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">
                            APPOINTMENT
                        </div>
                        <v-list-item-title class="headline mb-1" v-if="profile">
                            {{ profile.alias }}
                        </v-list-item-title>
                        <v-list-item-subtitle></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size="80"
                        color="grey"
                        v-if="appointment"
                    >
                        <img
                            :src="appointment.subjectavatarpath"
                            :alt="appointment.subjectname"
                        />
                    </v-list-item-avatar>
                </v-list-item>
                <!-- tabs start -->
                <v-tabs dense centered color="accent">
                    <v-tab
                        v-for="(tab, index) in ui.tabs"
                        :key="index"
                        justify="left"
                        max-width="160"
                    >
                        <v-icon left>
                            {{ tab.icon }}
                        </v-icon>
                        <div v-show="$vuetify.breakpoint.lg">
                            <small>{{ tab.text }}</small>
                        </div>
                    </v-tab>

                    <!-- tab 1 -->
                    <v-tab-item>
                        <v-card-text>
                            <ApptDetails :apptprop="appointment" @sync="sync" />
                        </v-card-text>
                    </v-tab-item>

                    <!-- tab 2 -->
                    <v-tab-item>
                        <v-card-text>
                            <v-row justify="center">
                                
                                <v-radio-group v-model="radio" mandatory row>
                                    <v-radio
                                        label="Key in"
                                        value="0"
                                        color="accent"
                                    ></v-radio>
                                    <v-radio
                                        label="Select"
                                        value="1"
                                        color="accent"
                                    ></v-radio>
                                </v-radio-group>
                            </v-row>
                            <transition-group name="scroll-x-transition">
                                <ApptConsultant
                                    key="100"
                                    v-if="this.radio == 0"
                                    :apptprop="appointment"
                                    @sync="sync"
                                />
                            </transition-group>

                            <transition-group
                                name="scroll-x-reverse-transition"
                            >
                                <ApptNewConsultantSelect
                                    key="101"
                                    v-if="this.radio == 1"
                                />
                            </transition-group>
                        </v-card-text>
                    </v-tab-item>

                    <!-- begin main tab item # 3 -->
                    <v-tab-item>
                        <v-row justify="center" >
                            <v-col xs="12" md="10" lg="8"> 
                            <v-tabs
                                dense
                                justify="center"
                                v-model="tab"
                                color="secondary"
                                centered
                            >
                                <v-tab v-for="item in items" :key="item.tab" >
                                    <v-icon left>
                                        {{ item.icon }}
                                    </v-icon>
                                    <div v-show="$vuetify.breakpoint.lg">
                                        <small>{{ item.tab }}</small>
                                    </div>
                                </v-tab>
                            </v-tabs>

                            <v-tabs-items v-model="tab">
                                <v-tab-item
                                    v-for="item in items"
                                    :key="item.tab"
                                >
                                    <v-card-text>
                                        <ApptNotes
                                            v-if="item.idx == 0"
                                            :apptprop="appointment"
                                            @sync="sync"
                                        />
                                        <ApptFileUpload
                                            v-if="item.idx == 1"
                                            :apptid="appointment.apptid"
                                            @sync="sync"
                                            @syncFiles="syncFiles"
                                        />
                                    </v-card-text>
                                </v-tab-item>
                            </v-tabs-items>
                            </v-col>
                        </v-row>
                        <!-- end main tab item # 3 -->
                    </v-tab-item>
                </v-tabs>
                <!--  -->
                <v-card-text>
                    <v-card-actions>
                        <v-btn @click="save" color="accent lighten-2">
                            Save Appointment
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

/*
********************************************************************************
*/ //////////////////////////////// SCRIPT
//////////////////////////////////////// /*
********************************************************************************
*/

<script>
const me = "AppointmentPage";
import ApptConsultant from "@/components/ApptConsultant.vue";
import ApptNewConsultantSelect from "@/components/ApptNewConsultantSelect.vue";
import ApptDetails from "../components/ApptDetails.vue";
import ApptNotes from "../components/ApptNotes.vue";
import ApptFileUpload from "@/components/ApptFileUpload.vue";

export default {
    name: "AppointmentPage",
    props: ["apptid", "apptfiles"],
    components: {
        ApptConsultant,
        ApptNewConsultantSelect,
        ApptDetails,
        ApptNotes,
        ApptFileUpload,
    },
    data: function() {
        return {
            tab3model: null,
            radio: 0,
            radio1: 0,
            e6: 1,
            profile: null,
            ui: {
                tab3: [
                    { text: "Notes", icon: "mdi-comment-text-outline" },
                    { text: "Files", icon: "mdi-file-outline" },
                ],
                tabs: [
                    { text: "Details", icon: "mdi-numeric-1-box" },
                    { text: "Consultant", icon: "mdi-numeric-2-box" },
                    { text: "Documents & Files", icon: "mdi-numeric-3-box" },
                ],
            },
            appointment: null,
            filecache: null,
            tab: null,
            items: [
                {
                    tab: "Notes",
                    icon: "mdi-comment-text-outline",
                    content: "Tab 1 Content",
                    idx: 0,
                },
                {
                    tab: "Files",
                    icon: "mdi-file-outline",
                    content: "Tab 2 Content",
                    idx: 1,
                },
            ],
        };
    },
    mounted() {
        console.log(me, "MOUNTED.");
        this.appointment = this.getEditingAppointment();

        //trigger the Vuex module to get the files for this
        //appointment from the API
        this.$store.dispatch(
            "Appointments/getFilesByAppointmentId",
            this.appointment.apptid
        );
    },

    computed: {
        profiles() {
            return this.$store.getters["Profiles/profiles"];
        },
        /*         editingAppointment: function() {
            console.log(me, "COMPUTED/editingAppointment CHANGED");
            return this.getEditingAppointment();
        }, */

        /*         files() {
            console.log(me, "COMPUTED/files CHANGED");
            let appointment = this.getEditingAppointment();
            return appointment.files ? appointment.files : null;
        }, */
        /*         componentAppointment() {
            return this.appointment;
        }, */
    },
    watch: {
        /*         componentAppointment() {
            console.log(me, "WATCH/componentAppointment() fired");
        }, */
        /*         files() {
            console.log(me, "WATCH/files() fired");
            if (this.appointment) {
                this.appointment.files = this.files ? this.files : [];
            }
        }, */
    },
    methods: {
        getEditingAppointment() {
            let appointments = this.$store.getters["Appointments/appointments"];
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].editing) {
                    return appointments[i];
                }
            }
        },
        /*         setAppointmentState: function() {
            let appointments = this.$store.getters["Appointments/appointments"];
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].editing) {
                    this.appointment = appointments[i];
                }
            }
        }, */

        sync(appt) {
            //syncs to this component local state; User hits Save Appointment to update Vuex
            console.log(me, "Sync Event captured.", appt);
            this.appointment = Object.assign({}, appt);
            console.log(me, "Object cloned.", this.appointment);
        },

        syncFiles(files) {
            console.log(me, "syncFiles", files);
            console.log(
                me,
                "syncFiles() file cache before sync:",
                this.filecache
            );
            this.filecache = files;
            console.log(
                me,
                "syncFiles() - file cache after sync:",
                this.filecache
            );

            /*             let appt = this.appointment;
            appt["files"] = this.cloneFileObject(files);
            this.appointment = appt; */
        },

        save() {
            console.log(me, "save()", this.appointment);
            let appointment = this.appointment;
            if (this.filecache) {
                appointment["files"] = this.filecache;
            }
            this.$store.dispatch("Appointments/saveAppointment", appointment);
        },
        cloneFileObject: function(source) {
            var target = [];
            for (let item of source) {
                let f = Object.assign({}, item);
                if (item.file) {
                    f.file = item.file;
                }
                target.push(f);
            }
            console.log(me, "cloneFileObject", target);
            return target;
        },
    },
};
</script>
