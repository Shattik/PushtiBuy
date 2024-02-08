const supabase = require("./db.js");
const router = require("express").Router();
const supabase = require('./db.js');
const axios = require("axios");

router.post("/", async (req, res) => {
  console.log("Hola");
  const productMsUrl = await getProductMsUrl();
  const inventoryUrl = productMsUrl + "/inventory";

  console.log(inventoryUrl);

  const req_data = { user_id: req.body.id};

  try {
    const response = await axios.post(inventoryUrl, req_data);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
