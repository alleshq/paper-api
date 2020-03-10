const express = require("express");
const auth = require("../../util/auth");

const router = express.Router();
router.get("/me", auth, require("./me"));
router.get("/user", require("./user"));
router.get("/post/:username/:slug", require("./post"));

module.exports = router;