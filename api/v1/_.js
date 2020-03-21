const express = require("express");
const auth = require("../../util/auth");
const cors = require("cors");

const router = express.Router();
router.get("/me", auth(), require("./me"));
router.get("/user", auth(true), cors(), require("./user"));
router.get("/posts", auth(), require("./posts"));
router.get("/post/:username/:slug", auth(true), cors(), require("./post"));
router.post("/like/:username/:slug", auth(), require("./like"));
router.post("/unlike/:username/:slug", auth(), require("./unlike"));
router.post("/new/:slug", auth(), require("./postCreate"));
router.post("/edit/:slug", auth(), require("./postEdit"));
router.post("/delete/:slug", auth(), require("./postDelete"));

module.exports = router;
