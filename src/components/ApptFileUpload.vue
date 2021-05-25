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
                <v-list dense v-if="value">
                    <template v-for="(file, i) in value">
                        <v-list-item :key="i">
                            <v-list-item>
                                <v-icon left> mdi-file-pdf </v-icon>
                                <a :href="fileUrls[i]" target="_blank">{{
                                    file.name
                                }}</a>
                                <v-icon right @click="deleteFile(file)">
                                    mdi-delete-circle
                                </v-icon>
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
const FileMetaObject = function(obj) {
    this.file = obj;
    this.hash = obj.hash ? obj.hash : md5(obj.name);
    this.apptid = null;
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
            fileUrls: [],
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
        let files = this.value;
        if (files) {
            for (let f of files) {
                var blob = new Blob([f.file], {
                    type: f.type,
                });
                this.fileUrls.push(URL.createObjectURL(blob));
            }
        }
    },
    watch: {
        value() {
            this.$emit("input", this.value);
        },
    },
    methods: {
        fileDialogClicked: function() {
            document.getElementById("myfileinput").value = "";
        },

        fileDialogChanged: function() {
            const fn = "fileDialogChanged()";
            console.log(fn);
            var fileInput = document.getElementById("myfileinput");
            if (fileInput) {
                // save the urls
                for (let file of fileInput.files) {
                    if (!this.fileIsSelected(md5(file.name))) {
                        let f = new FileMetaObject(file);
                        f.apptid = this.apptid;
                        this.fileUrls.push(this.getFileUrl(f));
                        this.value.push(f);
                    }
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
        getFileUrl(file) {
            var blob = new Blob([file], {
                type: file.type,
            });
            return URL.createObjectURL(blob);
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
    }, //methods
};
</script>
