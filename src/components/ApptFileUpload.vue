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
                <v-list xclass="overflow-y-auto" xstyle="max-height: 200px" dense>
                    <template v-for="(file, i) in value">
                        <v-list-item :key="i">
                            <v-list-item>
                                <v-icon left> mdi-file-pdf </v-icon>

                                <v-icon left @click="deleteFile(file)">
                                    mdi-delete-circle
                                </v-icon>
                                <v-icon left @click="listItem_clicked(file)">
                                    mdi-open-in-new</v-icon
                                >
                                {{ file.name }}

                                <!-- 
                                <v-icon right @click="deleteFile(metaFile)">
                                    mdi-delete-circle
                                </v-icon> 
                                -->
                            </v-list-item>
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
const { v4: uuidv4 } = require("uuid");
import { S3Adapter } from "@/adapters/S3Adapter.js";
const FileMetaObject = function(obj) {
    this.file = obj;
    this.hash = obj.hash ? obj.hash : md5(obj.name);
    this.apptid = obj.apptid ? obj.apptid : null;
    this.name = obj.name;
    this.type = obj.type;
    this.key =
        uuidv4() + "." + obj.name.substring(obj.name.lastIndexOf(".") + 1);
};
export default {
    name: "ApptFileUpload",
    props: {
        apptid: String,
        value: {
            type: Array,
            required: true,
        },
    },
    data: function() {
        return {
            accept: "*/*",
            rules: [
                (value) =>
                    !value ||
                    value.size < 2000000 ||
                    "File size should be less than 2 MB!",
            ],
        };
    },
    mounted: async function() {
        //console.log("mounting", "this.value.length", this.value.length);
        //let files = this.value;
    },
    watch: {
        value() {
            this.$emit("input", this.value);
        },
    },
    methods: {
        listItem_clicked: function(metaFile) {
            console.log("listItem_clicked()", metaFile);
            let url = URL.createObjectURL(
                new Blob([metaFile.file], {
                    type: metaFile.type,
                })
            );
            window.open(url);
            URL.revokeObjectURL(url);
        },
        fileDialogClicked: function() {
            document.getElementById("myfileinput").value = "";
        },

        fileDialogChanged: function() {
            const fn = "fileDialogChanged()";
            console.log(fn);
            var fileInput = document.getElementById("myfileinput");
            console.log(fn, "fileInput.files", fileInput.files);
            if (!fileInput) return;
            for (let file of fileInput.files) {
                if (!this.fileIsSelected(md5(file.name))) {
                    let f = new FileMetaObject(file);
                    f.apptid = this.apptid;
                    f.file = this.getBlob(file);
                    this.value.push(f);
                }
            }
        },

        deleteFile: function(file) {
            const fn = "deleteFile()";
            console.log(fn, file);
            for (let i = 0; i < this.value.length; i++) {
                if (file.hash === this.value[i].hash) {
                    this.value.splice(i, 1);
                }
            }
        },

        //utility functions
        getBlob(file) {
            return new Blob([file], {
                type: file.type,
            });
        },

        fileIsSelected: function(hash) {
            for (let f of this.value) {
                if (f.hash === hash) {
                    return true;
                }
            }
            return false;
        },

        byteSize: function(bytes) {
            var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if (bytes == 0) return "0 Bytes";
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        },
        async getFromS3(metaFiles) {
            console.log("getFromS3()");
            for (let metaFile of metaFiles) {
                metaFile["file"] = await S3Adapter.getBinaryFileByKey(
                    metaFile.key
                );
            }
        },
    }, //methods
};
</script>
