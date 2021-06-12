/** @format */
/**
 * Presents an OO-like adapter 'interface' on the Vuex Appointment module.
 * Aims to clean up the code in the VueJs components.
 *
 * @usage
 *  import VuexApptAdapter as vxAppt from '@/store/modules/VuexApptAdapter.js';
 *  ...
 *  vxAppt.deleteAppointment(payload);
 *  ...
 */
import store from "@/store";
const my_vuex = store;

const GET_APPTS = "Appointments/appointments";
const GET_FILE_KEYS = "Appointments/apptFileKeys"
const SET_APPTS = "Appointments/setAppointments";
const SET_APPT = "Appointments/setAppointment";
const GET_APPT_MODEL = "Appointments/appointmentModel";
const ADD_METAFILES = "Appointments/addMetaFileObjectsByApptId";
const ADD_APPT = "Appointments/addAppointment";
const DEL_LOCAL_APPT = "Appointments/deleteAppointmentVuexState";
const DEL_APPT = "Appointments/deleteAppointment";
const REPLACE_APPT = "Appointments/replaceAppointment";
const PERSIST_NEW_APPT = "Appointments/persistNewAppointment";
const PERSIST_EDITED_APPT = "Appointments/persistEditedAppointment";
const UPDATE_FILE_KEYS = "Appointments/updateFileKeys"

export const VuexAppointmentAdapter = {
    //Getters & setters
    getAppointments: () => my_vuex.getters[GET_APPTS],
    getApptFileKeys: () => my_vuex.getters[GET_FILE_KEYS],
    setAppointments: (payload) => my_vuex.dispatch(SET_APPTS, payload),
    setAppointment: async (payload) => my_vuex.dispatch(SET_APPT, payload),
    getAppointmentModel: () => my_vuex.getters[GET_APPT_MODEL],
    
    // Methods (Vuex 'actions')
    addAppointment: (payload) => my_vuex.dispatch(ADD_APPT, payload),
    deleteAppointment: (payload) => my_vuex.dispatch(DEL_APPT, payload),
    deleteCachedAppointment: (payload) => my_vuex.dispatch(DEL_LOCAL_APPT, payload),
    replaceAppointment: (payload) => my_vuex.dispatch(REPLACE_APPT, payload),
    addMetaFiles: (payload) => my_vuex.dispatch(ADD_METAFILES, payload),
    updateFileKeys: (payload) => my_vuex.dispatch(UPDATE_FILE_KEYS, payload),
    persistNewAppointment: (payload) =>
        my_vuex.dispatch(PERSIST_NEW_APPT, payload),
    persistEditedAppointment: (payload) =>
        my_vuex.dispatch(PERSIST_EDITED_APPT, payload),
};
