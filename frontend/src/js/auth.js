const auth = new Vue({
  el: "#auth",
  data,

  methods: {
    login(e) {
      e.preventDefault();

      const passwordValidation = this.validation(
        data.user.password,
        () => {
          data.validations.passwordRequired = true;
          data.validations.passwordMessageInvalid =
            "O campo senha é necessário.";
        },
        () => (data.validations.passwordRequired = false)
      );
      const nicknameValidation = this.validation(
        data.user.nickname,
        () => {
          data.validations.nicknameRequired = true;
          data.validations.nicknameMessageInvalid =
            "O campo nickname é necessário.";
        },
        () => (data.validations.nicknameRequired = false)
      );

      if (passwordValidation && nicknameValidation) {
        this.loading = true;
        axios
          .get("http://localhost:4040/getPlayers")
          .then((response) => response.data)
          .then((data) => {
            return data.filter(
              // filtra pra ver se existe esse nome de usuário
              (user) => user.nickname === this.user.nickname
            );
          })
          .then((res) => {
            const [user] = res;

            if (user) {
              const checkPassword = this.user.password === user.password;
              if (checkPassword) {
                //Senha e usuário corretos -> Logado
                this.logged = true;
                localStorage.setItem(
                  "logged",
                  JSON.stringify({
                    status: true,
                    user: { nickname: this.user.nickname },
                  })
                );
                this.getPurchases();
              } else {
                this.validation(
                  checkPassword,
                  () => {
                    data.validations.passwordRequired = true;
                    data.validations.passwordMessageInvalid =
                      "Senha incorreta.";
                  },
                  () => (this.validations.passwordRequired = false)
                );
                this.loading = false;
              }
            } else {
              this.validation(
                user,
                () => {
                  data.validations.nicknameRequired = true;
                  data.validations.nicknameMessageInvalid = "Jogador não encontrado.";
                },
                () => (data.validations.nicknameRequired = false)
              );
              this.loading = false;
            }
          });
      }
    },

    validation(input, invalid, valid) {
      if (!input) {
        invalid();
        return false;
      } else {
        valid();
        return true;
      }
    },

    getPurchases() {
      axios
        .get("http://localhost:4040/getPurchases")
        .then((response) => response.data)
        .then((respData) => {
          const purchases = [];
          respData.forEach((element) => {
            const playerNickname = element.player_nickname;
            if (data.user.nickname === playerNickname) {
              purchases.push(element);
            }
          });

          if (purchases.length) {
            data.user.purchases = purchases;
          } else {
            data.user.purchases = [];
          }
        });
    },
  },
  created() {
    if (!localStorage.hasOwnProperty("logged")) {
      localStorage.setItem("logged", JSON.stringify({ status: false }));
    }

    this.getPurchases();
  },
});
