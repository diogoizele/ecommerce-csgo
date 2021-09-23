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
      this.cart = [];
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

    addToCart(weapon) {
      const purchaseRequired = this.validation(
        data.newWeaponPurchase.purchaseCode,
        () => {
          data.validations.purchaseRequired = true;
          data.validations.purchaseRequiredMessage =
            "Selecione uma compra para continuar.";
        },
        () => {
          data.validations.purchaseRequired = false;
        }
      );

      const weaponRequired = this.validation(
        data.newWeaponPurchase.weapon,
        () => {
          data.validations.weaponRequired = true;
          data.validations.weaponRequiredMessage =
            "Selecione uma arma para continuar.";
        },
        () => {
          data.validations.weaponRequired = false;
        }
      );

      const quantityMinValue = this.validation(
        data.newWeaponPurchase.quantity >= 1,
        () => {
          data.validations.quantityRequired = true;
          data.validations.quantityRequiredMessage =
            "A quantidade mínima para compra é 1 unidade.";
        },
        () => {
          data.validations.quantityRequired = false;
        }
      );

      // validação de campos
      if (purchaseRequired && weaponRequired && quantityMinValue) {
        const label = document.getElementById("newWeaponPurchaseStatus");

        const newWeaponPurchase = {
          purchaseCode: data.newWeaponPurchase.purchaseCode,
          weaponcode: data.newWeaponPurchase.weapon,
          value: Number(
            data.newWeaponPurchase.value.substr(3).replace(",", ".")
          ),
          quantity: Number(data.newWeaponPurchase.quantity),
        };

        data.validations.weaponPurchaseLoading = true;

        //adicionar compra arma
        if (true) {
          axios
            .post(
              "http://localhost:4040/insertWeaponPurchase",
              newWeaponPurchase
            )
            .then((response) => {
              setTimeout(() => {
                data.validations.weaponPurchaseLoading = false;
                data.validations.weaponExistsMessage =
                  "Nova arma adicionada com sucesso.";
                data.validations.weaponExists = true;
                label.classList.add("successful");
                label.classList.remove("invalid");
                // adiciona no vetor do vue

                data.cart.push(newWeaponPurchase);

                axios
                  .post("http://localhost:4040/updatePurchasePrice", {
                    value: priceCart(),
                    code: data.newWeaponPurchase.purchaseCode,
                  })
                  .then((response) => {
                    console.log("Preços Atualizados");
                    data.user.purchases.forEach((purchase, index) => {
                      if (
                        purchase.code === data.newWeaponPurchase.purchaseCode
                      ) {
                        data.user.purchases[index].value = priceCart();
                      }
                    });
                    this.resetNewWeaponPurchase();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }, 1000);
              setTimeout(() => {
                data.validations.weaponExists = false;
              }, 4000);
            })
            .catch((error) => {
              setTimeout(() => {
                data.validations.weaponPurchaseLoading = false;
                data.validations.weaponExistsMessage =
                  "Erro ao adicionar nova arma.";
                data.validations.weaponExists = true;
                label.classList.add("invalid");
                label.classList.remove("successful");
              }, 1000);
              setTimeout(() => {
                data.validations.weaponExists = false;
              }, 4000);
            });
        } else {
          //editar compra arma
        }
      }
    },

    addNewPurchase(e) {
      e.preventDefault();

      // Validações -> Unicamente a Data
      const dateRequired = this.validation(
        data.newPurchase.date,
        () => {
          data.validations.dateRequired = true;
          data.validations.dateRequiredMessage =
            "Selecione uma data para compra.";
        },
        () => {
          data.validations.dateRequired = false;
        }
      );

      if (dateRequired) {
        const label = document.getElementById("newPurchaseStatus");

        const newPurchase = {
          player_nickname: data.user.nickname,
          date: data.newPurchase.date,
          value: Number(data.newPurchase.value),
        };

        data.validations.purchaseLoading = true;

        // testa se já existe
        if (isNaN(parseInt(data.newPurchase.code))) {
          axios
            .post("http://localhost:4040/insertPurchase", newPurchase)
            .then((response) => {
              //requisita para saber o valor para gravar no banco
              const code = response.data.rows[0].code;
              newPurchase.code = code;

              setTimeout(() => {
                data.validations.purchaseLoading = false;
                data.validations.purchaseMessage = "Nova compra cadastrada.";
                data.validations.purchaseStatus = true;
                label.classList.add("successful");
                label.classList.remove("invalid");

                // adiciona no vetor do vue
                data.user.purchases.push(newPurchase);
                this.resetNewPurchase();
              }, 1000);

              setTimeout(() => {
                data.validations.purchaseStatus = false;
              }, 4000);
            })
            .catch((error) => {
              setTimeout(() => {
                data.validations.purchaseLoading = false;
                data.validations.purchaseMessage =
                  "Erro ao cadastrar nova compra.";
                data.validations.purchaseStatus = true;
                label.classList.add("invalid");
                label.classList.remove("successful");
              }, 1000);

              setTimeout(() => {
                data.validations.purchaseStatus = false;
              }, 4000);
            });
        } else {
          // edita uma compra
          axios
            .post("http://localhost:4040/updatePurchase", {
              ...newPurchase,
              code: data.newPurchase.code,
            })
            .then((response) => {
              console.log(response);
              data.user.purchases.forEach((purchase, index) => {
                if (purchase.code === data.newPurchase.code) {
                  newPurchase.code = data.newPurchase.code;

                  setTimeout(() => {
                    data.validations.purchaseLoading = false;
                    data.validations.purchaseMessage =
                      "Compra editada com sucesso.";
                    data.validations.purchaseStatus = true;
                    label.classList.add("successful");
                    label.classList.remove("invalid");

                    data.user.purchases[index] = newPurchase;
                    this.resetNewPurchase();
                  }, 1000);

                  setTimeout(() => {
                    data.validations.purchaseStatus = false;
                  }, 4000);
                }
              });
            })
            .catch((error) => {
              setTimeout(() => {
                data.validations.purchaseLoading = false;
                data.validations.purchaseMessage = "Erro ao editar compra.";
                data.validations.purchaseStatus = true;
                label.classList.add("invalid");
                label.classList.remove("successful");
              }, 1000);

              setTimeout(() => {
                data.validations.purchaseStatus = false;
              }, 4000);
            });
        }
      }
    },

    editPurchaseButton(index) {
      const oldDate = data.user.purchases[index].date;
      data.newPurchase.date = oldDate;
      data.newPurchase.value = data.user.purchases[index].value;
      data.newPurchase.code = data.user.purchases[index].code;
    },

    removePurchaseButton(index, code) {
      const label = document.getElementById("newPurchaseStatus");
      const wannaRemove = confirm("Deseja mesmo remover?");
      if (wannaRemove) {
        data.validations.purchaseLoading = true;
        axios
          .get(`http://localhost:4040/deletePurchase/${code}`)
          .then((response) => {
            setTimeout(() => {
              data.validations.purchaseLoading = false;
              data.validations.purchaseMessage = "Compra excluída com sucesso.";
              data.validations.purchaseStatus = true;
              label.classList.add("successful");
              label.classList.remove("invalid");

              data.user.purchases.splice(index, 1);
              this.resetNewPurchase();
            }, 1000);

            setTimeout(() => {
              data.validations.purchaseStatus = false;
            }, 4000);
          })
          .catch((error) => {
            setTimeout(() => {
              data.validations.purchaseLoading = false;
              data.validations.purchaseMessage = "Erro ao excluir compra.";
              data.validations.purchaseStatus = true;
              label.classList.add("invalid");
              label.classList.remove("successful");
            }, 1000);

            setTimeout(() => {
              data.validations.purchaseStatus = false;
            }, 4000);
          });
      }
    },

    removeWeaponPurchaseButton(index) {
      const label = document.getElementById("newWeaponPurchaseStatus");

      const item = data.cart[index];
      const req = {
        code: item.purchasecode,
        weapon: item.weaponcode,
      };

      data.validations.weaponPurchaseLoading = true;

      axios
        .post(`http://localhost:4040/deleteWeaponPurchase`, req)
        .then((response) => {
          setTimeout(() => {
            data.validations.weaponPurchaseLoading = false;
            data.validations.weaponExistsMessage =
              "Compra excluída com sucesso.";
            data.validations.weaponExists = true;
            label.classList.add("successful");
            label.classList.remove("invalid");

            data.cart.splice(index, 1);
            
            axios
            .post("http://localhost:4040/updatePurchasePrice", {
              value: priceCart(),
              code: data.newWeaponPurchase.purchaseCode,
            })
            .then((response) => {
                console.log("Preços Atualizados");
                data.user.purchases.forEach((purchase, index) => {
                  if (purchase.code === data.newWeaponPurchase.purchaseCode) {
                    data.user.purchases[index].value = priceCart();
                  }
                });
                this.resetNewWeaponPurchase();
              })
              .catch((error) => {
                console.log(error);
              });
          }, 1000);

          setTimeout(() => {
            data.validations.weaponExists = false;
          }, 4000);
        })
        .catch((error) => {
          setTimeout(() => {
            data.validations.weaponPurchaseLoading = false;
            data.validations.weaponExistsMessage = "Erro ao excluir compra.";
            data.validations.weaponExists = true;
            label.classList.add("invalid");
            label.classList.remove("successful");
          }, 1000);

          setTimeout(() => {
            data.validations.weaponExists = false;
          }, 4000);
        });
    },

    goShop(code) {
      this.currentSection = { store: false, cart: true, profile: false };
      this.renderWeaponPurchase(code);
      data.newWeaponPurchase.purchaseCode = code;
    },

    resetNewPurchase(e) {
      if (e) {
        e.preventDefault();
      }

      data.newPurchase.date = "";
      data.newPurchase.code = "";
      data.newPurchase.value = "";
    },

    resetNewWeaponPurchase(e) {
      if (e) {
        e.preventDefault();
      }

      data.newWeaponPurchase.weapon = "";
      data.newWeaponPurchase.value = "";
      data.newWeaponPurchase.quantity = "";
    },

    renderWeaponPurchase(purchaseCode) {
      data.cart = [];
      axios
        .get("http://localhost:4040/getWeaponPurchase")
        .then((response) => response.data)
        .then((respData) => {
          respData.forEach((item) => {
            if (item.purchasecode === purchaseCode) {
              data.cart.push(item);
            }
          });
        });
    },

    formatDate(date) {
      const formated = moment(date).locale("pt-br").format(`D MMM YYYY`);
      return formated;
    },

    weaponName(code) {
      let name = null;
      data.weapons.forEach((weapon) => {
        if (Number(weapon.code) === Number(code)) {
          name = weapon.name;
        }
      });
      return name || code;
    },

    priceWeapon(weaponCode) {
      // procura as armas com o código vindo por parametro
      data.weapons.forEach((weapon) => {
        if (Number(weapon.code) === Number(weaponCode)) {
          const quantity = Number(data.newWeaponPurchase.quantity);
          if (quantity >= 1) {
            const price = Number(weapon.price);
            const value = price * quantity;

            data.newWeaponPurchase.value = `R$ ${value
              .toFixed(2)
              .replace(".", ",")}`;
          } else {
            data.newWeaponPurchase.value = `R$ 0,00`;
          }
        }
      });
    },

    buttonAddToCart(button) {
      button.children[0].textContent = "Adicionar ao";
      button.style.backgroundColor = "#195E93";
      this.clearStateForm();
    },

    buttonRemoveToCart(button) {
      button.children[0].textContent = "Remover do";
      button.style.backgroundColor = "#EE3E54";
      this.clearStateForm();
    },

    clearStateForm() {
      const initialState = {
        purchaseCode: null,
        weapon: "",
        weaponRequired: false,
        weaponRequiredMessage: "",
        quantity: "",
        quantityRequired: false,
        quantityRequiredMessage: "",
        value: "R$ 0,00",
        weaponExists: false,
        weaponExistsMessage: "",
      };

      data.newWeaponPurchase = initialState;
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

    editCartItem(item) {
      console.log(item);
    },

    removeCartItem(item) {
      const weaponCode = item.weaponCode;
      const weaponStoreItems = document.querySelectorAll("#appStore ul li");

      // reajusta o estilo do botão
      weaponStoreItems.forEach((itemLi) => {
        const id = itemLi.getAttribute("id");
        if (Number(id) === Number(weaponCode)) {
          const button = itemLi.children[3].children[1];
          button.children[0].textContent = "Adicionar ao";
          button.style.backgroundColor = "#195E93";
        }
      });

      // remove do array
      this.cart.forEach((item, index) => {
        if (item.weaponCode === weaponCode) {
          this.cart.splice(index, 1);
        }
      });
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
