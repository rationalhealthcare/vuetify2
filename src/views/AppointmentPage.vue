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
import { S3Adapter } from "@/adapters/S3Adapter.js";
import { AppointmentAdapter as apptApi } from "@/adapters/AppointmentAdapter.js";
const { v4: uuidv4 } = require("uuid");
export default {
    name: "AppointmentPage",
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
                keys: [],
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
                /**
                 * Saves a new or updated appointment.
                 * Index      Function              Dependencies[Index]
                 *   0        copyToVuexArray
                 *   1        updateBinaryFileStore
                 *   2        persistToApi          [1] updateBinaryFileStore
                 *                                      depends on last saved
                 *                                      state of appointment
                 *                                      file array
                 */
                saveButtonClick: {
                    copyToVuexArray: {
                        name: "copyToVuexArray",
                        state: 0,
                    },
                    updateFileKeys: { name: "updateFileKeys", state: 0 },
                    updateBinaryFileStore: {
                        name: "updateBinaryFileStore",
                        state: 0,
                    },
                    persistToApi: { name: "persistToApi", state: 0 },
                },
            },
        };
    },

    async mounted() {
        console.log("MOUNTING");
        this.apptLifeCycleState = this.$route.params.apptid ? 1 : 0;
        if (this.apptLifeCycleState === 0) {
            this.initializeNewAppointment();
        } else {
            await this.initializeExistingAppointment();

            // Make previously selected files available to the user, once the
            // user has selcted the appointment of interest. Trigger Vuex to
            // GET meta-files from API asynchronously. Updates the appointment
            // in the Vuex array. We use a computed prop and a watcher to
            // initialize the local cache after the Vuex files array has been
            // updated.
            await myVuex.addMetaFiles(this.$route.params.apptid);
            await this.getFromS3();
        }
        console.log("Component is mounted.");
    },

    computed: {
        updateFileKeys_ready() {
            let tx = this.transactions.saveButtonClick;
            return tx.updateFileKeys.state === 1;
        },
        updateFileKeys_done() {
            let tx = this.transactions.saveButtonClick;
            return tx.updateFileKeys.state === 2;
        },
        copyToVuexArray_ready() {
            let xaction = this.transactions.saveButtonClick;
            return xaction.copyToVuexArray.state === 1;
        },
        persistToApi_ready() {
            let tx = this.transactions.saveButtonClick;
            return tx.persistToApi.state === 1 && tx.updateFileKeys.state === 2;
        },
        updateBinaryFileStore_ready() {
            let tx = this.transactions.saveButtonClick;
            return (
                tx.updateBinaryFileStore.state === 1 &&
                tx.updateFileKeys.state === 2
            );
        },
        reset() {
            let tx = this.transactions.saveButtonClick;
            return (
                tx.persistToApi.state === 2 && tx.copyToVuexArray.state === 2
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
        apptFileKeys() {
            return myVuex.getApptFileKeys();
        },
    },
    watch: {
        async copyToVuexArray_ready() {
            if (this.copyToVuexArray_ready) {
                await this.trigger(this.save_x.copyToVuexArray);
            }
        },

        async updateFileKeys_ready() {
            const tx = this.transactions.saveButtonClick;
            if (this.updateFileKeys_ready) {
                await this.trigger(this.save_x.updateFileKeys);
                tx.updateBinaryFileStore.state = 1;
                tx.persistToApi.state = 1;
            }
        },

        async updateBinaryFileStore_ready() {
            if (this.updateFileKeys_done && this.updateBinaryFileStore_ready) {
                await this.trigger(this.save_x.updateBinaryFileStore);
            }
        },

        // depends on updateBinaryFileStore...
        async persistToApi_ready() {
            const tx = this.transactions.saveButtonClick;
            if (this.persistToApi_ready && tx.updateFileKeys.state === 2) {
                await this.trigger(this.save_x.persistToApi);
            }
        },
        reset() {
            if (this.reset) {
                let procs = Object.keys(this.save_x);
                let trans = this.transactions.saveButtonClick;
                procs.forEach((proc) => (trans[proc].state = 2));
            }
        },
        appointment() {
            if (Array.isArray(this.appointment.files)) {
                console.log("this.appointment.files is an Array");
                this.apptFiles.initialState = this.appointment.files.slice(0);
            }
        },
    },
    destroyed() {
        // If the user has not saved the appointment (i.e. it has not been
        // persisted to the Appointments API), delete it from the Vuex
        // appointments array.
        const fn = "destroyed (Lifecycle hook)";
        console.log(fn, "Destroying", this.appointment.apptid);
        if (this.apptLifeCycleState != 1) {
            myVuex.deleteCachedAppointment(this.appointment.apptid);
        }
    },
    methods: {
        /********************************************************************************
         * User-triggered events
         ********************************************************************************/
        saveButton_click() {
            const fn = "saveButton_click()";
            console.log(fn);
            const trans = this.transactions.saveButtonClick;
            // set the first operation in the transaction to "ready"
            trans.updateFileKeys.state = 1;
            trans.copyToVuexArray.state = 1;
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
        /********************************************************************************
         * Methods invoked during transaction execution
         ********************************************************************************/
        /**
         *
         */
        async copyToVuexArray() {
            const fn = "copyToVuexArray()";
            console.log(fn);
            let result = myVuex.setAppointment(
                //getApptByVal makes a "byVal" copy of the appointment
                this.getApptByVal(this.appointment)
            );
            return result;
        },

        /**
         *
         */
        async getFromS3() {
            console.log("getFromS3()");
            for (let metaFile of this.appointment.files) {
                metaFile["file"] = await S3Adapter.getBinaryFileByKey(
                    metaFile.key
                );
            }
            return true;
        },

        /**
         * What? Why? How? When?
         * @returns true on success, otherwise false.
         */
        async updateFileKeys() {
            const fn = "updateFileKeys()";
            console.log(fn);
            const apptid = this.appointment.apptid;
            try {
                const res = await apptApi.getFileKeysByApptId(apptid);
                console.log(fn, "Adapter returned:", res);
                this.apptFiles.keys = res;
                return true;
            } catch (err) {
                console.log(fn, err);
                return false;
            }
        },

        /**
         * Updates the the S3 bucket with binary files added to or removed from
         * the apointment by the user before clicking the "Save Appointment"
         * button. Call this when saving an appointment.
         * @returns true if operations succeeds, else false.
         */
        async updateBinaryFileStore() {
            const fn = "updateBinaryFileStore()";
            console.log(fn);

            // 1. Compute bin-files added vs deleted. The API is the source of
            //    truth about the curently valid S3 keys.
            const x = this.apptFiles.keys; // from API, via component data cache
            const y = this.getFileKeys(); //from appointment.files cache in this component
            const keysDeleted = x.filter((e) => !y.includes(e));
            const keysAdded = y.filter((e) => !x.includes(e));

            //2. Add to, and delete from, S3.
            try {
                if (keysAdded.length > 0) {
                    console.log(fn, "keysAdded", keysAdded);
                    let params = this.getBinFileParamsByKey(keysAdded);
                    await S3Adapter.uploadArray(params);
                }
                if (keysDeleted.length > 0) {
                    console.log(fn, "keysDeleted", keysDeleted);
                    await S3Adapter.deleteArray(keysDeleted);
                }
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        },

        /**
         *
         */
        async persistToApi() {
            const fn = "persistToApi()";
            console.log(fn, this.appointment);
            let apptByVal = this.getApptByVal(this.appointment);
            if (this.apptLifeCycleState === 0) {
                //new
                await myVuex.persistNewAppointment(apptByVal);
                // set apptLifeCycleState = 1 (pre-existing, i.e. has been persisted to API)
                this.apptLifeCycleState = 1;
            } else {
                //existing
                await myVuex.persistEditedAppointment(apptByVal);
            }
            return true;
        },

        /**
         *
         */
        initializeNewAppointment() {
            const fn = "initializeNewAppointment()";
            console.log(fn);
            this.initializeSubjectProfile();
            //let appointment = Object.assign({}, myVuex.getAppointmentModel());
            let appointment = this.getApptByVal(myVuex.getAppointmentModel())
            console.log("appt model", appointment);
            appointment.apptsubjectid = this.subjectProfile.id;
            appointment.subjectname = this.subjectProfile.name;
            appointment.subjectavatarpath = this.subjectProfile.avatarpath;
            appointment.apptid = uuidv4();
            appointment.fid = this.families[0].id;
            appointment.caregivername = this.profiles[0].name;

            //locally cached appointment for editing
            this.appointment = appointment;

            //add the new appointment to the Vuex 'appointments' array
            myVuex.addAppointment(appointment);
        },

        /**
         *
         */
        async initializeExistingAppointment() {
            const fn = "initializeExistingAppointment()";
            console.log(fn);
            let appointments = myVuex.getAppointments();
            console.log(fn, "Got Vuex appointments", appointments);
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].apptid == this.$route.params.apptid) {
                    this.appointment = appointments[i];
                    this.apptLifeCycleState = 1; //pre-existing
                    console.log(fn, "this.appointment", this.appointment);
                    return;
                }
            }
        },

        /**
         *
         */
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
         * Use this to get binary files that have been added to an appointment.
         * @returns an array of objects that represent the parameters (key, file)
         * that S3 requires to upload a binary object. The objects are created
         * from local file cache.
         */
        getBinFileParamsByKey(keys) {
            let binFileParams = [];
            this.appointment.files.forEach((f) => {
                keys.forEach((k) => {
                    k === f.key
                        ? binFileParams.push({ key: f.key, file: f.file })
                        : null;
                });
            });
            return binFileParams;
        },
        getFileKeys() {
            let keys = [];
            this.appointment.files.forEach((f) => keys.push(f.key));
            return keys;
        },

        /**
         * getApptByVal, name changed and adapted from:
         * "deepCopyFunction", purloined from:
         * Dr. Derek Austin
         * https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
         */
        getApptByVal: function(inObject) {
            let outObject, value, key;
            const that = this;

            if (typeof inObject !== "object" || inObject === null) {
                return inObject; // Return the value if inObject is not an object
            }

            // Create an array or object to hold the values
            outObject = Array.isArray(inObject) ? [] : {};

            for (key in inObject) {
                value = inObject[key];

                // Recursively (deep) copy for nested objects, including arrays
                outObject[key] = that.getApptByVal(value);
            }

            return outObject;
        },

        getFileUrl(file) {
            var blob = new Blob([file], {
                type: file.type,
            });
            return URL.createObjectURL(blob);
        },
        async getUrls() {
            const fn = "getUrls()";
            console.log(fn);
            let metaFiles = this.appointment.files;
            for (let metaFile of metaFiles) {
                metaFile["url"] = this.getFileUrl(this.getBlob(metaFile));
            }
        },
        getBlob(file) {
            return new Blob([file], {
                type: file.type,
            });
        },
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

        inAnotBArrays(y, x) {
            return x.filter((e) => !y.includes(e));
        },
    },
};
</script>
