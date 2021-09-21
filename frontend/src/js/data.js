let data = {
  logged: getLogged(),
  loading: false,

  currentSection: {
    store: true,
    cart: false,
    profile: false,
  },

  validations: {
    nicknameRequired: false,
    nicknameMessageInvalid: "",
    passwordRequired: false,
    passwordMessageInvalid: "",


    weaponRequired: false,
    weaponRequiredMessage: "",
    quantityRequired: false,
    quantityRequiredMessage: "",
    weaponExistsMessage: "",
    weaponExists: false,


    dateRequired: false,
    dateRequiredMessage: "",
    purchaseStatus: false,
    purchaseMessage: '',
    purchaseLoading: false
  },

  user: {
    nickname: getPlayer(),
    password: "",
    purchases: [],
    weaponPurchase: [],
  },


  cart: [],
  weapons: [],
  weaponLoading: true,

  newWeaponPurchase: {
    purchaseCode: "",
    weapon: "",
    quantity: "",
    value: "",
  },

  newPurchase: {
    code: "",
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

function getPlayer() {
  if (localStorage.hasOwnProperty("logged")) {
    const response = JSON.parse(localStorage.getItem("logged"));
    if (response.user) {
      return response.user.nickname;
    }
  } else {
    return "";
  }
}
