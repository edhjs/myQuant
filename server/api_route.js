const express = require("express");
const router = express.Router();
const { User, Code } = require("../models");

var child_process = require("child_process");
var exec = child_process.exec;
const courses = [
  { id: 1, name: "courses1" },
  { id: 2, name: "courses2" },
  { id: 3, name: "courses3" }
];
router.get("/api/data", (req, res) => {
  var cmd =
    "Rscript ./modules/R/quant.R " + req.query.code + " " + "2018-01-01";
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    res.send("Success" + stdout.toString());
  });
});
router.get("/api/code", (req, res) => {
  Code.findOne({
    where: { name: req.query.name }
  })
    .then(function(obj) {
      console.log(obj);
      res.status(200).send(req.query.name + " : code=" + obj.dataValues.code);
    })
    .catch(function(err) {
      console.log("error" + err);
    });
});
router.get("/api/update_code", (req, res) => {
  var cmd = "Rscript ./modules/R/get_code.R";
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    res.send("Success");
  });
});
router.get("/api/hello_world", (req, res) => {
  res.send("hello_world");
});
router.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send(`ID was not found`);
  res.send(course);
});
router.post("/api/login", (req, res) => {
  // console.log("login Api Tried", req.body);
  const profile = req.body.profile;
  const oauth = req.body.oauth;
  User.findOne({
    where: { id: profile.id }
  })
    .then(function(obj) {
      // update
      if (obj) {
        //if you have someting to update
        // obj.update({
        // });
        // console.log("already registered", obj.dataValues);
        res.status(200).send(obj.dataValues);
      }
      // insert
      else
        User.create({
          id: profile.id,
          nickname: profile.displayName,
          profile_image: profile._json.properties.profile_image || "",
          status: 0,
          company: oauth.company,
          accessToken: oauth.access_token,
          email: profile._json.has_email ? profile._json.email : ""
        }).then(result => res.status(200).send(result));
    })
    .catch(function(err) {
      console.log("errorOn", oauth.company, err);
    });
});

module.exports = router;
