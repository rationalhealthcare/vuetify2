import Vue from "vue";
import VueRouter from "vue-router";
//import Home from "@/views/Home.vue";
import SignupPage from "@/views/SignupPage.vue";
import SigninPage from "@/views/SigninPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import Profiles from "@/views/Profiles.vue";
import ConsultantSearchPage from "@/views/ConsultantSearchPage.vue";
import ConsultantSearchResultsPage from "@/views/ConsultantSearchResultsPage.vue";


//import AppointmentNewPage from "@/views/AppointmentNewPage.vue"
//import NewProfile from "@/views/ProfileNewPage.vue";
//import ProfileEditPage from "@/views/ProfileEditPage.vue";
//import Authguard from "./authguard.js";

Vue.use(VueRouter);

const routes = [

  {
    path: "/",
    name: "Profiles",
    component: Profiles
  },
  {
    path: "/profiles",
    name: "MyProfiles",
    component: Profiles
  },
  {
    path: "/signup",
    name: "SignupPage",
    component: SignupPage
  },
  {
    path: "/signin",
    name: "SigninPage",
    component: SigninPage
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/preferences",
    name: "preferencesPage",
    component: () =>
      import(
        /* webpackChunkName: "preferences" */ "../views/PreferencesPage.vue"
      )
  },
  {
    path: "/newprofile",
    name: "newProfile",
    component: () =>
      import(/* webpackChunkName: "newprofile" */ "../views/NewProfile.vue")
  },

  {
    path: "/editprofile",
    name: "ProfileEditPage",
    component: () =>
      import(
        /* webpackChunkName: "editprofile" */ "../views/ProfileEditPage.vue"
      )
  },
  {
    path: "/appointments",
    name: "AppointmentsPage",
    component: () =>
      import(
        /* webpackChunkName: "appointmentspage" */ "../views/AppointmentsPage.vue"
      )
  },
  {
    path: "/appointments/new/:pid",
    name: "AppointmentPage",
    component: () =>
      import(
        /* webpackChunkName: "appointmentnewspage" */ "../views/AppointmentPage.vue"
      )
  },
  {
    path: "/appointment/edit/:apptid",
    name: "EditAppointmentPage",
    component: () =>
      import(
        /* webpackChunkName: "appointmenteditspage" */ "../views/AppointmentPage.vue"
      )
  },
  {
    path: "/consultant",
    name: "ConsultantSearchPage",
    component: ConsultantSearchPage
  },
  {
    path: "/consultantsearchresults",
    name: "ConsultantSearchResultsPage",
    component: ConsultantSearchResultsPage
  },
  {
    path: "/family/edit",
    name: "FamilyEditPage",
    component: () =>
      import(
        /* webpackChunkName: "familyeditpage" */ "../views/FamilyEditPage.vue"
      )
  },

  {
    path: "*",
    component: NotFoundPage
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
