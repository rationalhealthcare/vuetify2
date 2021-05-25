<!-- @format -->

<template>
    <div>
        <v-card flat class="mx-auto" style="overflow-y: auto;">
            <form>
                <v-text-field
                    prepend-icon="mdi-stethoscope"
                    label="Doctor or organization name"
                    v-model="value.consultantname"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-map-marker"
                    label="Address1"
                    v-model="value.address1"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-map-marker-multiple"
                    label="Address2"
                    v-model="value.address2"
                ></v-text-field>

                <v-row>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            prepend-icon="mdi-city"
                            label="City"
                            v-model="value.city"
                        ></v-text-field>
                    </v-col>
                    <v-col xcols="12" md="4" sm="6">
                        <v-text-field
                            prepend-icon="mdi-pillar"
                            label="State"
                            v-model="value.state"
                        ></v-text-field>
                    </v-col>
                    <v-col xcols="12" md="4" sm="6">
                        <v-text-field
                            prepend-icon="mdi-email-outline"
                            label="Postal Code"
                            v-model="value.postalcode"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </form>
        </v-card>
    </div>
</template>
<script>
export default {
    name: "AppointmentConsultant",
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
    data: function() {
        return {
            myTabIndex: 0,
        };
    },
    watch: {
        value() {
            this.$emit("input", this.value);
        },
    },
};
</script>
