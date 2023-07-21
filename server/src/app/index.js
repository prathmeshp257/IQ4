const path = require("path");

module.exports = (clientPath) => {
  const router = require("express").Router();

  // don't serve compressed files directly
  router.get("*.gz", (req, res) => {
    res.sendStatus(404);
  });

  //anything we don't understand just returns the app
  router.get("*", (req, res) => res.sendFile(path.join(clientPath, "index.html")));

  return router;
};
