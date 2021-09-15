const container = new Vue({
  el: "#app",
  data,
  methods: {
    logoff() {
      localStorage.setItem("logged", JSON.stringify({ status: false }));
      this.logged = false;
    },
  },
});
