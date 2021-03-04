<!-- @format -->

<template>
    <div>
        <v-card flat class="mx-auto" style="overflow-y: auto;">
            <form>
                <v-text-field
                    prepend-icon="mdi-stethoscope"
                    label="Doctor or organization name"
                    v-model="apptprop.consultantname"
                    @change="sync"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-map-marker"
                    label="Address1"
                    v-model="apptprop.address1"
                    @change="sync"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-map-marker-multiple"
                    label="Address2"
                    v-model="apptprop.address2"
                    @change="sync"
                ></v-text-field>

                <v-row>
                    <v-col cols="12" md="4" sm="12">
                        <v-text-field
                            prepend-icon="mdi-city"
                            label="City"
                            v-model="apptprop.city"
                            @change="sync"
                        ></v-text-field>
                    </v-col>
                    <v-col xcols="12" md="4" sm="6">
                        <v-text-field
                            prepend-icon="mdi-pillar"
                            label="State"
                            v-model="apptprop.state"
                            @change="sync"
                        ></v-text-field>
                    </v-col>
                    <v-col xcols="12" md="4" sm="6">
                        <v-text-field
                            prepend-icon="mdi-email-outline"
                            label="Postal Code"
                            v-model="apptprop.postalcode"
                            @change="sync"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </form>
        </v-card>
    </div>
</template>
<script>
const me = "AppointmentConsultant component";
export default {
    name: "AppointmentConsultant",
    props: ["apptprop"],
    data: function() {
        return {
            myTabIndex: 0,
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
