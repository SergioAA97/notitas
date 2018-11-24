var express = require("express");
var router = express.Router();
var mongoClient = require("mongodb").MongoClient;
import validator from "validator";

const dbName = "notitas";
const collectionName = "notas";

const createNote = ({ title, body }) => {
  return {
    title,
    body,
    createdOn: new Date(),
    lastModified: new Date()
  };
};

/* Insert Document */
const insertNote = function(db, { title, body }, callback) {
  //Get document collection
  const collection = db.collection(collectionName);
  // Insert
  collection.insertOne(createNote({ title, body }), function(err, result) {
    console.log("Inserted new note");
    callback(result);
  });
};

const getNotes = function(db, res, callback) {
  const collection = db.collection(collectionName);
  //Get
  collection.find({}).toArray(function(err, result) {
    if (err) {
      res.send(err);
    } else if (result.length) {
      res.render("index", {
        // Pass the returned database documents to Pug
        notes: result,
        title: "Notitas"
      });
    } else {
      res.send("No documents found");
    }
    callback();
  });
};

router.get("/", (req, res) => {
  mongoClient.connect(
    "mongodb://notitas:5EXcMWCWtJPrD74bC8bKGqQ2GB3iDsPwot2NOqx1Kbl52iO2y402VXsE7AxB8F64PH2Ub5NuXlId6ck5eDWbPA%3D%3D@notitas.documents.azure.com:10255/?ssl=true",
    function(err, client) {
      if (err) client.close();
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      getNotes(db, res, () => {
        client.close();
      });
    }
  );
});

/* INSERT note listing. */
router.get("/insert", function(req, res, next) {
  mongoClient.connect(
    "mongodb://notitas:5EXcMWCWtJPrD74bC8bKGqQ2GB3iDsPwot2NOqx1Kbl52iO2y402VXsE7AxB8F64PH2Ub5NuXlId6ck5eDWbPA%3D%3D@notitas.documents.azure.com:10255/?ssl=true",
    function(err, client) {
      if (err) client.close();
      console.log("Connected successfully to server");

      let title, body;
      title = req.get("title");
      body = req.get("body");

      if (!title || !body) {
        client.close();
        console.log("Error parsing headers");
      } else if (
        !validator.isAscii(title) ||
        !validator.isLength(title, { min: 1, max: 64 })
      ) {
        console.log("Error parsing headers");
        client.close();
      }

      const db = client.db(dbName);

      insertNote(db, { title, body }, () => {
        client.close();
      });
    }
  );
});

module.exports = router;
