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
  },
  cart: [],
  weapons: [],
  weaponLoading: true,
  newWeaponPurchase: {
    purchaseCode: "",
    weaponCode: "",
    quantity: "",
    value: "",
  },
  newPurchase: {
    value: "",
    date: "",
  },
};

function getLogged() {
  if (localStorage.hasOwnProperty("logged")) {
    const response = JSON.parse(localStorage.getItem("logged"));
    return response.status;
  }
}
