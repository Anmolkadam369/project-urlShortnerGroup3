const urlController = require("../controller/urlController")
const express = require('express');
const router = express.Router();

router.post("/url/shorten", urlController.urlCreate);
router.get("/:urlCode", urlController.urlGet);

router.all("/*", (req, res) => {
    res.status(404).send({ msg: "invalid http request" })
})

module.exports = router
