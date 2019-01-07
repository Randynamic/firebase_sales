const express = require("express");
const api_routes = express.Router();

const utils = require("../utils");

api_routes.get(
  "/",
  utils.wrap(async (req, res) =>
    res.json({
      ok: true,
      data: { a: 42 }
    })
  )
);

module.exports = api_routes;
