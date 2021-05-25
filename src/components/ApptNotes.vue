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
                v-model="value.notes"
                clearable
                persistent-hint
                :hint="ui.hint"
                :label="ui.label"
            >
            </v-textarea>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: "ApptNotes",
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
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
        watch: {
        value() {
            this.$emit("input", this.value);
        },
    },
};
</script>
