const db = require("./_database");
const express = require("express");

const app = express();
const port = 4040;
const queryGetPlayers = "SELECT nickname, password FROM players";
const queryGetWeapons =
  "SELECT weapons.code, weapons.name, weapons.price, weapons.type_code, weapon_types.name AS type_name FROM weapons, weapon_types WHERE weapons.type_code = weapon_types.code ORDER BY weapon_types ASC";
const queryGetPurchases =
  "SELECT code, to_char(date, 'yyyy-mm-dd') as date, value, player_nickname FROM purchases ORDER BY date ASC";
const queryGetWeaponPurchase =
  "SELECT purchase_code AS purchaseCode, weapon_code AS weaponCode, value, quantity FROM weapon_purchase";

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  next();
});

app.listen(port, () =>
  console.log(`webservice is running on http://localhost:${port}/`)
);

app.get("/", (req, res) => {
  res.send(`<h1>CSGO WebService</h1>
    <ul>
    <li><a href="/getPlayers">Listar Jogadores</a></li>
    <li><a href="/getWeapons">Listar Armas</a></li>
    <li><a href="/getPurchases">Listar Compras</a></li>
    <li><a href="/getWeaponPurchase">Listar Compra de Armas</a></li>
    <hr />
    <li><a href="/insertPurchase">Inserir Compra</a></li>
    </ul>`);
});

app.get("/getPlayers", (req, res) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      client.query(queryGetPlayers, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    }
  });
});

app.get("/getWeapons", (req, res) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      client.query(queryGetWeapons, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    }
  });
});

app.get("/getWeaponPurchase", (req, res) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      client.query(queryGetWeaponPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    }
  });
});

app.get("/getPurchases", (req, res) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      client.query(queryGetPurchases, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.status(200).send(result.rows);
        }
      });
    }
  });
});

app.post("/insertWeaponPurchase", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertWeaponPurchase = {
        text: "INSERT INTO weapon_purchase (purchase_code, weapon_code, value, quantity) values ($1,$2,$3,$4)",
        values: [
          req.body.purchasecode,
          req.body.weaponcode,
          req.body.value,
          req.body.quantity,
        ],
      };
      client.query(queryInsertWeaponPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(201).send(result);
        }
      });
    }
  });
});

app.post("/insertPurchase", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "INSERT INTO purchases (player_nickname, date, value) values ($1,$2,$3) RETURNING code",
        values: [req.body.player_nickname, req.body.date, req.body.value],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          // retorna o código do novo id criado
          res.status(201).send(result);
        }
      });
    }
  });
});

app.post("/updatePurchase", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "UPDATE purchases SET date = $1, value = $2 where code = $3",
        values: [req.body.date, req.body.value, req.body.code],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

app.post("/updateWeaponPurchase", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "UPDATE weapon_purchase SET quantity = $1, value = $2 where purchase_code = $3 AND weapon_code = $4",
        values: [
          req.body.quantity,
          req.body.value,
          req.body.code,
          req.body.weapon,
        ],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

app.post("/updatePurchasePrice", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "UPDATE purchases SET value = $1 where code = $2",
        values: [req.body.value, req.body.code],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

app.get("/deletePurchase/:code", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "DELETE FROM purchases WHERE code = $1",
        values: [req.params.code],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

app.post("/deleteWeaponPurchase", (req, res, next) => {
  db.connect((err, client, done) => {
    if (err) {
      console.log("Não conseguiu acessar o Banco");
      res.status(400).send(JSON.stringify(err));
    } else {
      const queryInsertPurchase = {
        text: "DELETE FROM weapon_purchase WHERE purchase_code = $1 AND weapon_code = $2",
        values: [req.body.code, req.body.weapon],
      };

      client.query(queryInsertPurchase, (err, result) => {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});
