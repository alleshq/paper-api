const express = require("express");
const auth = require("../../util/auth");

const router = express.Router();
router.get("/me", auth(), require("./me"));
router.get("/user", auth(), require("./user"));
router.get("/post/:username/:slug", auth(true), require("./post"));
router.post("/new/:slug", auth(), require("./postCreate"));
router.post("/edit/:slug", auth(), require("./postEdit"));
router.post("/delete/:slug", auth(), require("./postDelete"));

module.exports = router;
