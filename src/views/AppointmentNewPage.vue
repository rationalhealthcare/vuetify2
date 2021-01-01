<!-- @format -->

<template>
    <v-row justify="center">
        <v-col xs="12" md="10" lg="8">
            <v-card class="mx-auto" xmax-width="344" xoutlined>
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">
                            NEW APPOINTMENT
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
                    ></v-list-item-avatar>
                </v-list-item>

                <v-tabs dense centered color="accent" xshow-arrows>
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
                            <AppointmentNewComplaint />
                        </v-card-text>
                    </v-tab-item>

                    <!-- tab 2 -->
                    <v-tab-item>
                        <v-card-text>
                            <AppointmentNewConsultantLg
                                v-show="$vuetify.breakpoint.lg"
                            />

                            <div v-show="$vuetify.breakpoint.xs">
                                <v-radio-group v-model="radio" mandatory row>
                                    <v-radio label="Key in" value="0"></v-radio>
                                    <v-radio label="Select" value="1"></v-radio>
                                </v-radio-group>

                                <transition-group name="scroll-x-transition">
                                    <AppointmentNewConsultantSm
                                        key="100"
                                        v-if="this.radio == 0"
                                    />
                                </transition-group>

                                <transition-group
                                    name="scroll-x-reverse-transition"
                                >
                                    <AppointmentNewConsultantSelSm
                                        key="101"
                                        v-if="this.radio == 1"
                                    />
                                </transition-group>
                            </div>
                        </v-card-text>
                    </v-tab-item>

                    <!-- tab 3 -->
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <p>
                                    Fusce a quam. Phasellus nec sem in justo
                                    pellentesque facilisis. Nam eget dui. Proin
                                    viverra, ligula sit amet ultrices semper,
                                    ligula arcu tristique sapien, a accumsan
                                    nisi mauris ac eros. In dui magna, posuere
                                    eget, vestibulum et, tempor auctor, justo.
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
                <v-card-text>
                    <v-card-actions>
                        <v-btn outlined text @click="save">
                            Save Appointment
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

/*
********************************************************************************
*/ //////////////////////////////// SCRIPT
//////////////////////////////////////// /*
********************************************************************************
*/

<script>
import AppointmentNewConsultantLg from "@/components/AppointmentNewConsultantLg.vue";
import AppointmentNewConsultantSm from "@/components/AppointmentNewConsultantSm.vue";
import AppointmentNewConsultantSelSm from "@/components/AppointmentNewConsultantSelSm.vue";
import AppointmentNewComplaint from "../components/AppointmentNewComplaint.vue";
export default {
    name: "AppointmentNewPage",
    components: {
        AppointmentNewConsultantLg,
        AppointmentNewConsultantSm,
        AppointmentNewConsultantSelSm,
        AppointmentNewComplaint,
    },

    data: function() {
        return {
            appointment: { complaint: null },
            complaints: ["Pain", "Cough", "Trouble breathing", "Lump", "Rash"],
            radio: 0,
            e6: 1,
            profile: null,
            undoProfile: null,
            ui: {
                tabs: [
                    { text: "Details", icon: "mdi-numeric-1-box" },
                    { text: "Consultant", icon: "mdi-numeric-2-box" },
                    { text: "Documents & Files", icon: "mdi-numeric-3-box" },
                ],
            },
        };
    },
    mounted() {
        this.setEditingProfile();
    },

    computed: {
        profiles() {
            return this.$store.getters["Profiles/profiles"];
        },
        editingProfileId() {
            return this.$store.getters["AppState/editingProfileId"];
        },
    },
    methods: {
        save() {
            let apptState = this.$store.getters["AppState/appointment"];
            let payload = apptState.editingAppointment;
            this.$store.dispatch("Appointments/saveAppointment", payload);
        },
        clicked() {
            this.showme = true;
        },
        /*         tabClicked(index) {
            let appointment = this.$store.getters["AppState/appointment"];
            appointment.currentTabIndex = index;
        }, */
        setEditingProfile() {
            for (let i = 0; i < this.profiles.length; i++) {
                if (this.profiles[i].id === this.editingProfileId) {
                    this.profile = this.profiles[i];
                    this.undoProfile = Object.assign({}, this.profiles[i]);
                    break;
                }
            }
        },
    },
};
</script>
