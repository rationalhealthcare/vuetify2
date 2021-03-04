<!-- @format -->

<template>
    <div>
        <v-card flat>
            <v-card-title style="font-size: 1.35em;">
                Upload Appointment Files
            </v-card-title>

            <v-card-actions>
                <input
                    id="myfileinput"
                    type="file"
                    multiple
                    ref="file"
                    style="display: none"
                    @change="fileDialogChanged"
                    @click="fileDialogClicked"
                />
                <v-btn text color="accent" @click="$refs.file.click()">
                    <v-icon left>
                        mdi-paperclip
                    </v-icon>
                    Select files...
                </v-btn>
            </v-card-actions>

            <v-card-text>
                <v-list dense v-if="apptid">
                    <template v-for="(file, i) in localFiles">
                        <v-list-item :key="i">
                            <v-chip close @click:close="deleteFile(file)">
                                <v-icon left> mdi-file-pdf </v-icon>
                                {{ file.name }}
                            </v-chip>
                        </v-list-item>
                    </template>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
/*
  md5: Copyright © 2011-2015, Paul Vorbach. Copyright © 2009, Jeff Mott.
*/
const md5 = require("md5");
const me = "ApptFileUpload component";
const UploadableFile = function(obj) {
    this.apptid = null;
    this.file = obj;
    this.hash = obj.hash ? obj.hash : md5(obj.name);
    this.name = obj.name;
    this.type = obj.type;
};
export default {
    name: "ApptFileUpload",
    props: ["apptid"],
    data: function() {
        return {
            selectedFiles: [],
            localFiles: [],
            accept: "*/*",
            rules: [
                (value) =>
                    !value ||
                    value.size < 2000000 ||
                    "File size should be less than 2 MB!",
            ],
        };
    },
    mounted: function() {
        //THIS IS A PROBLEM BECAUSE TO NAV AWAY AND BACK SHOULD PRESERVE
        //THE LOCAL STATE, NOT REVERT TO GLOBAL STATE; THIS WAS WHY WE
        //USED THE APPOINTMENT PAGE AS A SYNCED INTERMEDIARY STATE
        console.log(me, "MOUNTED - apptid:", this.apptid);

        this.getVuexAppoinmentFiles();

        console.log(me, "MOUNTED - local file cache:", this.localFiles);
    },
    computed: {
        //TODO: KILL THIS
        files() {
            console.log(me, "COMPUTED/files() - apptid", this.apptid);
            const appointments = this.$store.getters[
                "Appointments/appointments"
            ];
            let computedFiles = null;
            console.log(me, "COMPUTED/files() - appointments:", appointments);
            if (!appointments) {
                computedFiles = null;
            } else {
                for (let appointment of appointments) {
                    if (this.apptid == appointment.apptid) {
                        computedFiles = appointment.files;
                    }
                }
            }
            console.log(me, "COMPUTED/files()", computedFiles);
            return computedFiles;
        },
    },
    watch: {
        localFiles() {
            this.syncFiles();
        },
        selectedFiles() {
            this.reconcileFiles();
        },
    },
    methods: {
        getVuexAppoinmentFiles() {
            const fn = "METHODS/getVuexAppoinmentFiles()";
            console.log(me, fn, this.apptid);
            const appointments = this.$store.getters[
                "Appointments/appointments"
            ];

            console.log(me, fn, "appointments:", appointments);

            if (!appointments) {
                this.localFiles = [];
            } else {
                for (let appointment of appointments) {
                    if (appointment.apptid == this.apptid) {
                        this.localFiles = appointment.files;
                        console.log(
                            me,
                            fn,
                            "Returning Vuex Appointment files:",
                            appointment.files
                        );
                        //return appointment.files;
                    }
                }
            }
        },
        fileDialogClicked: function() {
            document.getElementById("myfileinput").value = "";
        },
        fileDialogChanged: function() {
            var fileInput = document.getElementById("myfileinput");
            if (fileInput) {
                this.selectedFiles = [...fileInput.files];
            }
            console.log(me, "fileDialogChanged", this.selectedFiles);
        },

        reconcileFiles: function() {
            console.log(me, "reconcileFiles: selection", this.selectedFiles);
            console.log(me, "reconcileFiles: pre-existing", this.selectedFiles);

            //get a private copy of the appointment file array
            let apptFiles = this.cloneFileObject(this.files);

            //convert selection to the expected format & add to the appointment array
            for (let file of this.selectedFiles) {
                let f = new UploadableFile(file);
                f.apptid = this.apptid;
                apptFiles.push(f);
            }

            // to local componet store, to trigger watcher
            this.localFiles = this.cloneFileObject(this.dedup(apptFiles));
        },
        deleteFile: function(file) {
            console.log(me, "deleteFile", file);
            console.log(
                me,
                "deleteFile - files before delete:",
                this.localFiles
            );

            //for each file in the local cache... if it's not the deleted one,
            //push it into a new cache
            let newFiles = [];
            for (let f of this.localFiles) {
                if (f.hash != file.hash) {
                    newFiles.push(f);
                }
            }

            this.localFiles = newFiles;
            console.log(me, "deleteFile; new local cache:", this.localFiles);
        },

        syncFiles: function() {
            console.log(me, "syncFiles", this.localFiles);
            this.$emit("syncFiles", this.localFiles);
        },

        byteSize: function(bytes) {
            var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if (bytes == 0) return "0 Bytes";
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        },
        dedup: function(arr) {
            return arr.reduce(
                function(p, c) {
                    // create an identifying id from the object values
                    var id = c.hash;
                    // if the id is not found in the temp array
                    // add the object to the output array
                    // and add the key to the temp array
                    if (p.temp.indexOf(id) === -1) {
                        p.out.push(c);
                        p.temp.push(id);
                    }
                    return p;
                    // return the deduped array
                },
                {
                    temp: [],
                    out: [],
                }
            ).out;
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
            return target;
        },
    },
};
</script>
