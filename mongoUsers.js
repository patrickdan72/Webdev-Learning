const dotenv = require("dotenv");

const express = require("express");

const { MongoClient } = require("mongodb");

const parser = require("body-parser");

let md5 = require("md5");

async function main() {
  const app = express();

  const config = dotenv.config();

  const port = process.env.PORT;
  if (!port) port = 5000;

  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));

  const uri = process.env.URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
  } catch (e) {
    console.log(e);
    throw e;
  }

  app.post("/users", (req, res) => {
    let dba = client.db("Users");
    let data = req.body;
    data.password = md5(data.password);
    dba.collection("Users").insertOne(data, (err, user) => {
      if (err) res.status(400).json(err);
      else {
        delete data.password;
        res.json(data);
      }
    });
  });

  app.put("/users", (req, res) => {
    let dba = client.db("Users");
    let data = req.body;
    let pass = data.password;
    delete data.password;
    dba
      .collection("Users")
      .updateOne(
        { email: data.email, password: md5(pass) },
        { $set: data },
        (err, user) => {
          if (err) res.status(400).json(err);
          if (user.matchedCount) {
            res.json(data);
          } else {
            res.json({ message: "Wrong email or password!" });
          }
        }
      );
  });

  app.delete("/users/:id", (req, res) => {
    let dba = client.db("Users");
    let id = req.params["id"];
    let data = req.body;
    let ok = dba
      .collection("Users")
      .deleteOne({ email: id, password: md5(data.password) }, (err, user) => {
        if (err) res.status(400).json(err);
        if (user.deletedCount) {
          res.json({ message: "User succesfully deleted!" });
        } else {
          res.json({ message: "Wrong email or password!" });
        }
      });
  });

  app.post("/auth", (req, res) => {
    let em = req.body.email;
    let pass = req.body.password;
    let dba = client.db("Users");
    dba
      .collection("Users")
      .findOne({ email: em, password: md5(pass) }, (err, user) => {
        if (err) res.status(400).json(err);
        if (user) {
          res.json({ error: null, data: em });
        } else {
          res.status(404).json({ error: "Not found", data: null });
        }
      });
  });

  app.listen(port, function () {
    console.log(`Server opened on port ${port}`);
  });
}

main();
