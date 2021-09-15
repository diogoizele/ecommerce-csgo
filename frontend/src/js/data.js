let data = {
  logged: getLogged(),
  user: {
    nickname: "",
    nicknameRequired: false,
    nicknameRequiredMessage: "",
    password: "",
    passwordRequired: false,
    passwordRequiredMessage: "",
  },
};

function getLogged() {
  const response = JSON.parse(localStorage.getItem("logged"));
  return response.status;
}
