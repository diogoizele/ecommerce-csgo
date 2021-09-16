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

    setImageSrc(type) {
      let url = "/frontend/src/img/";
      switch (type) {
        case "Pistola":
          url += "pistol.png";
          break;
        case "Escopeta":
          url += "shotgun.png";
          break;
        case "Sub-Metralhadora":
          url += "submachine_gun.png";
          break;
        case "Metralhadora":
          url += "machine_gun.png";
          break;
        case "Rifle":
          url += "rifle.png";
          break;
      }
      return url;
    },

    addToCart(weapon, e) {
      const button = e.target;
      const { code } = weapon;

      let buttonText = button.children[0].textContent;

      if (buttonText === "Adicionar ao") {
        button.children[0].textContent = "Remover do";
        button.style.backgroundColor = "#EE3E54";
        const newItem = {
          quantity: 1,
          weaponCode: code,
          value: Number(weapon.price * 1),
        };
        this.cart.push(newItem);
      } else {
        button.children[0].textContent = "Adicionar ao";
        button.style.backgroundColor = "#195E93";
        this.cart.forEach((item, index) => {
          if (item.weaponCode === code) {
            this.cart.splice(index, 1);
          }
        });
      }
    },
  },

  created() {
    //inicia na loja
    function getWeapons() {
      axios
        .get("http://localhost:4040/getWeapons")
        .then((response) => response.data)
        .then((respData) => {
          data.weaponLoading = false;
          data.weapons = respData;
        });
    }

    getWeapons();
  },
});
