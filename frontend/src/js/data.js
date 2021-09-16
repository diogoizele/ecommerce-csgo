let data = {
  logged: getLogged(),
  loading: false,
  currentSection: {
    store: true,
    cart: false,
    profile: false,
  },
  user: {
    nickname: "",
    nicknameRequired: false,
    nicknameRequiredMessage: "",
    password: "",
    passwordRequired: false,
    passwordRequiredMessage: "",
    purchases: [],
    weaponPurchase: [],
    cart: "",
  },
  weapons: [],
};

function getLogged() {
  if (localStorage.hasOwnProperty("logged")) {
    const response = JSON.parse(localStorage.getItem("logged"));
    return response.status;
  }
}
