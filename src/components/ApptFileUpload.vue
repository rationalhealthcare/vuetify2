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
                <v-list dense>
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
//const { v4: uuidv4 } = require("uuid");
import { S3Adapter } from "@/adapters/S3Adapter.js";

//  obj is a binary file selected by the user on user's device
const FileMetaObject = function(obj, apptid) {
    this.file = obj;
    this.hash = obj.hash ? obj.hash : md5(obj.name);
    this.apptid = apptid;
    /* this.apptid = obj.apptid ? obj.apptid : null; */
    this.name = obj.name;
    this.type = obj.type;
    this.key = md5(obj.size + obj.lastModified);
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

            //debugging in progress
            const selectedFiles = [...fileInput.files];
            selectedFiles.forEach((binfile) => {
                const metafile = new FileMetaObject(binfile, this.apptid);
                let isdupfile = false;
                let isdupname = false;
                this.value.forEach((propfile) => {
                    if (propfile.key == metafile.key) {
                        isdupfile = true;
                    }
                    if (propfile.name == metafile.name) {
                        isdupname = true;
                    }
                });
                if (!isdupfile) {
                    //before we push it, if it has the same name as an
                    //existing file, disambiguate it.
                    if (isdupname) {
                        metafile.name =
                            metafile.name +
                            "_" +
                            Math.random()
                                .toString(36)
                                .substring(7);
                    }
                    this.value.push(metafile);
                }
            });
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
        /*         getBlob(file) {
            return new Blob([file], {
                type: file.type,
            });
        },

        byteSize: function(bytes) {
            var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            if (bytes == 0) return "0 Bytes";
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        }, */

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
