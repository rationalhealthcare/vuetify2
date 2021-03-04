<!-- @format -->

<template>
    <v-card flat>
        <v-card-title>
            Appointment Notes
        </v-card-title>
        <v-card-text>
            <v-textarea
                color="secondary"
                outlined
                v-model="apptprop.notes"
                clearable
                persistent-hint
                :hint="ui.hint"
                :label="ui.label"
                @input="sync"
            >
            </v-textarea>
        </v-card-text>
    </v-card>
</template>

<script>
const me = "ApptNotes component";
export default {
    name: "ApptNotes",
    props: ["apptprop"],
    data: function() {
        return {
            ui: {
                text: "Start here...",
                label: "Key in free text.",
                hint:
                    "The text is not formattable. We will add a WYSIWYG editor in a future revision.",
            },
            content: "",
        };
    },
    mounted: function() {
        console.log(me, "MOUNTED.");
    },
    methods: {
        sync: async function() {
            this.$emit("sync", this.apptprop);
        },
    },
};
</script>
