const container = new Vue({
  el: "#app",
  data,
  methods: {
    changeSection(section) {
      switch (section) {
        case 1:
          this.currentSection = { store: true, cart: false, profile: false };
          break;
        case 2:
          this.currentSection = { store: false, cart: true, profile: false };
          break;
        case 3:
          this.currentSection = { store: false, cart: false, profile: true };
          break;
      }
    },

    logoff() {
      localStorage.setItem(
        "logged",
        JSON.stringify({
          status: false,
          user: { nickname: null },
        })
      );
      this.logged = false;
      this.loading = false;
      this.user.nickname = "";
      this.user.password = "";
    },
  },

  created() {
    //inicia na loja
  },
});
