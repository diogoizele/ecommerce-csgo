const db = require("./_database");
const express = require("express");

const app = express();
const port = 4040;
const queryGetPlayers = "SELECT nickname, password FROM players";
const queryGetWeapons =
  "SELECT weapons.code, weapons.name, weapons.price, weapons.type_code, weapon_types.name AS type_name FROM weapons, weapon_types WHERE weapons.type_code = weapon_types.code ORDER BY weapon_types ASC";
const queryGetPurchases = "SELECT * FROM purchases";
const queryGetWeaponPurchase = "SELECT * FROM weapon_purchase";

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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

app.get("/getPurchases", (req, res) => {
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
