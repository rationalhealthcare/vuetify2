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
                            <ApptDetails :value="appointment" />
                        </v-card-text>
                    </v-tab-item>

                    <!-- tab 2 -->
                    <v-tab-item>
                        <v-card-text>
                            <v-row justify="center">
                                <v-radio-group
                                    v-model="ui.tab2.radio"
                                    mandatory
                                    row
                                >
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
                                    v-if="ui.tab2.radio == 0"
                                    :value="appointment"
                                />
                            </transition-group>

                            <transition-group
                                name="scroll-x-reverse-transition"
                            >
                                <ApptNewConsultantSelect
                                    key="101"
                                    v-if="this.ui.tab2.radio == 1"
                                />
                            </transition-group>
                        </v-card-text>
                    </v-tab-item>

                    <!-- begin main tab item # 3 -->
                    <v-tab-item>
                        <v-row justify="center">
                            <v-col xs="12" md="10" lg="8">
                                <v-tabs
                                    dense
                                    justify="center"
                                    v-model="ui.tab3.tab"
                                    color="secondary"
                                    centered
                                >
                                    <v-tab
                                        v-for="item in ui.tab3.items"
                                        :key="item.tab"
                                    >
                                        <v-icon left>
                                            {{ item.icon }}
                                        </v-icon>
                                        <div v-show="$vuetify.breakpoint.lg">
                                            <small>{{ item.tab }}</small>
                                        </div>
                                    </v-tab>
                                </v-tabs>

                                <v-tabs-items v-model="ui.tab3.tab">
                                    <v-tab-item
                                        v-for="item in ui.tab3.items"
                                        :key="item.tab"
                                    >
                                        <v-card-text v-if="appointment">
                                            <ApptNotes
                                                v-if="item.idx == 0"
                                                :value="appointment"
                                            />
                                            <ApptFileUpload
                                                v-if="item.idx == 1"
                                                :apptid="appointment.apptid"
                                                :value="appointment.files"
                                                @input="dosomething"
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
                        <v-btn
                            @click="saveButton_click"
                            color="accent lighten-2"
                        >
                            Save Appointment
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import ApptConsultant from "@/components/ApptConsultant.vue";
import ApptNewConsultantSelect from "@/components/ApptNewConsultantSelect.vue";
import ApptDetails from "../components/ApptDetails.vue";
import ApptNotes from "../components/ApptNotes.vue";
import ApptFileUpload from "@/components/ApptFileUpload.vue";
import { VuexAppointmentAdapter as myVuex } from "@/store/adapters/VuexApptAdapter.js";
const { v4: uuidv4 } = require("uuid");
export default {
    name: "AppointmentPage",
    /* props: ["apptprop", "apptid", "apptfiles"], */
    components: {
        ApptConsultant,
        ApptNewConsultantSelect,
        ApptDetails,
        ApptNotes,
        ApptFileUpload,
    },

    data: function() {
        return {
            appointment: { files: [] },
            apptFiles: {
                initialState: [],
                initialized: -1,
            },
            apptLifeCycleState: -1 /* 0 = new, never persisted; 1 = was previously persisted */,
            profile: null /* caregiver profile */,
            subjectProfile: null,
            newFiles: [],
            delFiles: [],
            ui: {
                tabs: [
                    { text: "Details", icon: "mdi-numeric-1-box" },
                    { text: "Consultant", icon: "mdi-numeric-2-box" },
                    { text: "Documents & Files", icon: "mdi-numeric-3-box" },
                ],
                tab2: {
                    radio: 0,
                },
                tab3: {
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
                },
            },
            transactions: {
                saveButtonClick: {
                    copyToVuexArray: { name: "copyToVuexArray", state: 0 },
                    persistToApi: { name: "persistToApi", state: 0 },
                },
            },
        };
    },
    /**
     *      The transaction that saves a new or updated appointment
     * Index      function            dependencies[index]
     *
     *   1        cacheAddedFileObjArray        [0]
     *   2        cacheDeletedFileObjArray      [0]
     *   3        addToS3                       [1]
     *   4        delFromS3                     [2]
     *   5        copyToVuexArray               [0] (copying from editied candidate to new valid state)
     *   6        persistToApi                  [5] (persisting to API from Vuex Appt's array)
     *
     *
     */
    mounted() {
        console.log("MOUNTING");
        this.apptLifeCycleState = this.$route.params.apptid ? 1 : 0;
        if (this.apptLifeCycleState === 0) {
            this.initializeNewAppointment();
        } else {
            this.initializeExistingAppointment();

            // Make previously selected files available to the user, once the
            // user has selcted the appointment of interest. Trigger Vuex to
            // GET meta-files from API asynchronously. Updates the appointment
            // in the Vuex array. We use a computed prop and a watcher to
            // initialize the local cache after the Vuex files array has been
            // updated.
            this.appointment.files = myVuex.addMetaFiles(
                this.$route.params.apptid
            );
        }
        console.log("Component is mounted.");
    },

    computed: {
        copyToVuexArray_ready() {
            let xaction = this.transactions.saveButtonClick;
            return xaction.copyToVuexArray.state === 1;
        },
        persistToApi_ready() {
            let xaction = this.transactions.saveButtonClick;
            return xaction.persistToApi.state === 1;
        },
        reset() {
            let xaction = this.transactions.saveButtonClick;
            return (
                xaction.copyToVuexArray.state === 2 &&
                xaction.persistToApi.state === 2
            );
        },
        save_x() {
            return this.transactions.saveButtonClick;
        },

        profiles() {
            return this.$store.getters["Profiles/profiles"];
        },
        families() {
            return this.$store.getters["Profiles/families"];
        },
        vuexApptFiles() {
            let apptid = this.$route.params.apptid;
            let appts = myVuex.getAppointments();
            //let appts = this.$store.getters["Appointments/appointments"];
            for (let i = 0; i < appts.length; i++) {
                if (appts[i].apptid === apptid) {
                    return appts[i].files;
                }
            }
            return [];
        },
    },
    watch: {
        async copyToVuexArray_ready() {
            if (this.copyToVuexArray_ready) {
                await this.trigger(this.save_x.copyToVuexArray);
                this.save_x.persistToApi.state = 1;
            }
        },
        async persistToApi_ready() {
            if (this.persistToApi_ready) {
                await this.trigger(this.save_x.persistToApi);
            }
        },
        reset() {
            if (this.reset) {
                let procs = Object.keys(this.save_x);
                for (let p of procs) {
                    this.save_x[p].state = 2;
                }
            }
        },
        appointment() {
            if (Array.isArray(this.appointment.files)) {
                this.apptFiles.initialState = this.appointment.files.slice(0);
            }
        },
        vuexApptFiles() {
            //initializes the local appt meta file cache from Vuex
            if (this.vuexApptFiles && this.apptFiles.initialized != 1) {
                this.appointment.files = this.vuexApptFiles;
                this.apptFiles.initialized = 1;
            }
        },
    },
    methods: {
        initializeNewAppointment() {
            const fn = "initializeNewAppointment()";
            console.log(fn);
            this.initializeSubjectProfile();
            let appointment = Object.assign({}, myVuex.getAppointmentModel());
            console.log("appt model", appointment);
            appointment.apptsubjectid = this.subjectProfile.id;
            appointment.subjectname = this.subjectProfile.name;
            appointment.subjectavatarpath = this.subjectProfile.avatarpath;
            appointment.apptid = uuidv4();
            appointment.fid = this.families[0].id;
            appointment.caregivername = this.profiles[0].name;

            //locally cached appointment for editing
            this.appointment = appointment;

            //add the new appointmtne to the Vuex 'appointments' array
            myVuex.addAppointment(appointment);
        },

        initializeExistingAppointment() {
            const me = "initializeExistingAppointment()";
            console.log(me);
            let appointments = myVuex.getAppointments();
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].apptid == this.$route.params.apptid) {
                    this.appointment = appointments[i];
                    this.apptLifeCycleState = 1; //pre-existing
                    console.log("this.appointment", this.appointment);
                    return;
                }
            }
        },

        dosomething() {
            return null;
        },

        /********************************************************************************
         * User-triggered events
         ********************************************************************************/
        saveButton_click() {
            // set the first operation in the transaction to "ready"
            this.transactions.saveButtonClick.copyToVuexArray.state = 1;
        },

        /********************************************************************************
         * Transaction management
         ********************************************************************************/
        async trigger(obj) {
            const fn = "trigger()";
            console.log("");
            console.log(fn, obj);
            let self = this;
            if (obj.state != 1) {
                return;
            }
            let b = await self[obj.name]();
            console.log(fn, obj.name, "returned", b);
            obj.state = b ? 2 : -1;
            self.stateDump();
        },

        stateDump() {
            const fn = "stateDump()";
            console.log(fn);
            let procs = Object.keys(this.save_x);
            for (let p of procs) {
                console.log(fn, this.save_x[p].name, this.save_x[p].state);
            }
        },

        /**
         * cacheFileArrayState
         * Caches the state of the "files" array containing user-selected binary files
         * and their Json meta-objects in the Vuex property "fileArrayLastSavedState".
         * Used later to identify the files that were added and removed from the array
         * since last time the appointment was persisted.
         */
        /*         async cacheFileArrayState() {
            this.$store.dispatch(
                "Appointments/cacheFileArrayState",
                this.appointment.apptid
            );
            return true;
        }, */

        async cacheAddedFileObjArray() {
            let tmpEditingFiles = this.fileArrayLastSavedState.slice(0);
            let tmpLocalFiles = this.appointment.files.slice(0);
            // New files: in local list but not in Vuex
            let result = this.inANotInB(tmpLocalFiles, tmpEditingFiles);
            this.newFiles = Array.isArray(result) ? result : [];
            return true;
        },

        /**
         *  Caches an array of files in preparation to removing them from the S3 bucket.
         */
        async cacheDeletedFileObjArray() {
            let tmpEditingFiles = this.fileArrayLastSavedState.slice(0);
            let tmpLocalFiles = this.appointment.files.slice(0);
            // Removed files: in Vuex and not in the new list
            let result = this.inANotInB(tmpEditingFiles, tmpLocalFiles);
            this.delFiles = Array.isArray(result) ? result : [];
            return true;
        },
        /**
         *
         */
        async copyToVuexArray() {
            const fn = "copyToVuexArray()";
            console.log(fn);
            // update the appointment in the Vuex appointments array
            return await myVuex.setAppointment(this.appointment);
        },

        async addToS3() {
            const fn = "addToS3()";
            console.log(fn);
            if (this.newFiles.length > 0) {
                myVuex.replaceAppointment(this.newFiles);
            }
            return true;
        },
        delFromS3() {},

        async persistToApi() {
            const fn = "persistToApi()";
            console.log(fn);
            if (this.apptLifeCycleState === 0) {
                //new
                await myVuex.persistNewAppointment(this.appointment);
            } else {
                //existing
                await myVuex.persistEditedAppointment(this.appointment);
            }
            return true;
        },

        initializeSubjectProfile() {
            if (this.profiles) {
                for (let p of this.profiles) {
                    if (p.id == this.$route.params.pid) {
                        this.subjectProfile = p;
                        break;
                    }
                }
            }
        },

        /************************************************************************
         * APPOINTMENT HELPER FUNCTIONS
         ***********************************************************************/

        /**
         *
         */
        getAppointmentIndex() {
            const fn = "getAppointmentIndex()";
            let index = -1;
            let appointments = myVuex.getAppointments();
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].apptid == this.appointment.apptid) {
                    index = i;
                }
            }
            console.log(fn, index);
            return index;
        },

        /**
         * returns an array of items that are in List A and not in List B
         */
        inANotInB(A, B) {
            const fn = "inANotInB";
            console.log(fn, "A, B", A, B);

            let a = A.slice(0);
            console.log(fn, "a, before", a);

            for (let i = 0; i < a.length; i++) {
                for (let b of B) {
                    // remove all values of B that match current value of A
                    if (a.hash == b.hash) {
                        a.splice(i, 1);
                    }
                }
            }
            console.log(fn, "a, after", a);
            return a;
        },
    },
};
</script>
