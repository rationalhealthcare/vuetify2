import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import SignupPage from "@/views/SignupPage.vue";
import SigninPage from "@/views/SigninPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import NewProfile from "@/views/NewProfile.vue";
import Profiles from "@/views/Profiles.vue";
import ProfileEditPage from "@/views/ProfileEditPage.vue";
//import Authguard from "./authguard.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
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
    component: NewProfile
  },
  {
    path: "/profiles",
    name: "Profiles",
    component: Profiles
  },
  {
    path: "/editprofile",
    name: "ProfileEditPage",
    component: ProfileEditPage
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
