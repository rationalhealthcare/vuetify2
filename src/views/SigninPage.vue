<template>
  <v-row justify="center">
    <v-col xs="12" md="10" lg="6">
      <v-card>
        <v-card-title>
          <span class="headline accent--text">Welcome Back!</span>
        </v-card-title>

        <v-card-text id="signup">
          <v-form id="form1" ref="form">
            <v-text-field
              type="email"
              id="text1"
              label="Email*"
              :rules="validationRules.email"
              v-model="data.email"
              autocomplete="off"
            ></v-text-field>
            <v-text-field
              id="text2"
              label="Password*"
              type="password"
              :rules="validationRules.password"
              v-model="data.password"
              autocomplete="off"
            ></v-text-field>
            <small>*indicates required field</small>
          </v-form>

          <!-- BEGIN ALERT -->
          <v-layout row v-if="alert">
            <v-flex xs12 sm6 offset-sm3>
              <app-alert
                :type="alert.type"
                @dismissed="onDismissed"
                :text="alert.message"
              ></app-alert>
            </v-flex>
          </v-layout>
          <!-- END ALERT -->
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onDismissed">Clear</v-btn>
          <v-btn text @click="onSignin" :loading="loading">Sign In</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SigninPage",
  data() {
    return {
      loading: false,
      validationRules: {
        email: [
          v => (v ? v.length >= 1 || "Email is required." : false),
          v =>
            v
              ? this.validateEmail(v) || "Email is incorrectly formatted."
              : false
        ],
        password: [
          v => (v ? v.length >= 6 || "Minimum length is 6 characters." : false)
        ]
      },
      data: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters["Auth/user"];
    },
    alert() {
      return this.$store.getters.alert;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    },
    alert() {
      this.loading = false;
    }
  },
  methods: {
    onSignin() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("clearAlert");
        this.loading = true;
        this.$store.dispatch("Auth/signUserIn", {
          email: this.data.email,
          password: this.data.password
        });
      } else {
        this.$store.dispatch("clearAlert");
        this.$refs.form.reset();
      }
    },
    onDismissed() {
      this.$refs.form.reset();
      this.$store.dispatch("clearAlert");
    },
    validateEmail(email) {
      const re = /^(?=.{1,64}@)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?=.{1,255}$)((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
      return re.test(email);
    }
  }
};
</script>
