const auth = new Vue({
  el: "#auth",
  data,

  methods: {
    login(e) {
      e.preventDefault();

      const passwordValidation = this.validation(
        data.user.password,
        () => {
          data.user.passwordRequired = true;
          data.user.passwordRequiredMessage = "O campo senha é necessário.";
        },
        () => (data.user.passwordRequired = false)
      );
      const nicknameValidation = this.validation(
        data.user.nickname,
        () => {
          data.user.nicknameRequired = true;
          data.user.nicknameRequiredMessage = "O campo nickname é necessário.";
        },
        () => (data.user.nicknameRequired = false)
      );

      if (passwordValidation && nicknameValidation) {
        axios
          .get("http://localhost:4040/getPlayers")
          .then((response) => response.data)
          .then((data) => {
            return data.filter(
              // filtra pra ver se existe esse nome de usuário
              (user) =>
                user.nickname.toLowerCase() === this.user.nickname.toLowerCase()
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
                  JSON.stringify({ status: true })
                );
              } else {
                this.validation(
                  checkPassword,
                  () => {
                    this.user.passwordRequired = true;
                    this.user.passwordRequiredMessage = "Senha incorreta.";
                  },
                  () => (this.user.passwordRequired = false)
                );
              }
            } else {
              this.validation(
                user,
                () => {
                  this.user.nicknameRequired = true;
                  this.user.nicknameRequiredMessage = "Jogador não cadastrado.";
                },
                () => (this.user.nicknameRequired = false)
              );
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
  },
  created() {},
});
