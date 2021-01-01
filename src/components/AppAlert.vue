<!-- @format -->

<template>
  <v-alert
    :type="type"
    :tag="tag"
    transition="scale-transition"
    origin="center center"
    elevation="2"
    dismissible
    @input="onClose"
    >{{ text }}</v-alert
  >
</template>

<script>
/* eslint-disable */
export default {
    props: ["text", "type", "tag"],
    methods: {
        onClose() {
            this.$emit("dismissed");
        },
    },
};
</script>
