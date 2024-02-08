const router = require("express").Router();
const supabase = require("./db.js");
const axios = require("axios");

router.post("/farmer", async (req, res) => {
  console.log("Hola");

  const { farmer_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "FarmerBuy"."id" as transactionId, "FarmerBuy"."total", "FarmerBuy"."totalTax", \
    "FarmerBuy"."totalDeduction", "FarmerBuy"."cashback", "FarmerBuy"."timestamp", "FarmerBuy"."status", \
    ARRAY_AGG(row_to_json(A.*)) AS buyItems\
    FROM\
      "FarmerBuy" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."tax", C."totalPrice"\
      FROM "FarmerBuyItem" as C, "Product" as B where B.id = C.pid) as A\
    where\
      "FarmerBuy"."id" = A."tid" and "FarmerBuy"."farmerId" = $1 \
    group by "FarmerBuy"."id", "FarmerBuy"."total", "FarmerBuy"."totalTax", \ 
    "FarmerBuy"."totalDeduction", "FarmerBuy"."cashback", "FarmerBuy"."timestamp", "FarmerBuy"."status"\
    ORDER BY "FarmerBuy"."timestamp" DESC;`,
      [farmer_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.error("Error in /buy_request/farmer:", error);
    let respone = {
      status: "failed",
      message: "Internal server error",
    };
    res.status(500).send(respone);
  }
});

router.post("/sme", async (req, res) => {
  console.log("Hola");

  const { sme_id } = req.body;

  const req_data = { user_id: req.body.id };

  try {
    let data = await supabase.any(
      `SELECT "SmeBuy"."id" as transactionId, "SmeBuy"."total", "SmeBuy"."totalTax", \
    "SmeBuy"."totalDeduction", "SmeBuy"."cashback", "SmeBuy"."timestamp", "SmeBuy"."status", \
    ARRAY_AGG(row_to_json(A.*)) AS buyItems\
    FROM\
      "SmeBuy" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."tax", C."totalPrice"\
      FROM "SmeBuyItem" as C, "Product" as B where B.id = C.pid) as A\
    where\
      "SmeBuy"."id" = A."tid" and "SmeBuy"."smeId" = $1\
    group by "SmeBuy"."id", "SmeBuy"."total", "SmeBuy"."totalTax", "SmeBuy"."totalDeduction", "SmeBuy"."cashback", "SmeBuy"."timestamp", "SmeBuy"."status"\
    ORDER BY "SmeBuy"."timestamp" DESC;`,
      [sme_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/agent/farmer", async (req, res) => {
  console.log("Hola");

  const { agent_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "FarmerBuy"."id" as transactionId, F."name" as farmername, F."avatarLink", F."phone", "FarmerBuy"."total",\ 
      "FarmerBuy"."totalTax", "FarmerBuy"."totalDeduction", "FarmerBuy"."cashback", "FarmerBuy"."timestamp", "FarmerBuy"."status",\
      ARRAY_AGG(row_to_json(A.*)) AS buyItems\
      FROM\
        "FarmerBuy" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."tax", C."totalPrice"\
        FROM "FarmerBuyItem" as C, "Product" as B where B.id = C.pid) as A,\
        (SELECT "id", "name", "avatarLink", "phone" FROM "User") AS F\
      where
        "FarmerBuy"."id" = A."tid" and "FarmerBuy"."agentId" = $1 and F."id" = "FarmerBuy"."farmerId"\
      group by "FarmerBuy"."id", F."name", F."avatarLink", F."phone", "FarmerBuy"."total", "FarmerBuy"."totalTax",\ 
      "FarmerBuy"."totalDeduction", "FarmerBuy"."cashback", "FarmerBuy"."timestamp", "FarmerBuy"."status"\
      ORDER BY "FarmerBuy"."timestamp" DESC;`,
      [agent_id]
    );

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/agent/sme", async (req, res) => {
  console.log("Hola");

  const { agent_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "SmeBuy"."id" as transactionId, F."name" as smename, F."avatarLink", F."phone", "SmeBuy"."total",\ 
      "SmeBuy"."totalTax", "SmeBuy"."totalDeduction", "SmeBuy"."cashback", "SmeBuy"."timestamp", "SmeBuy"."status",\
      ARRAY_AGG(row_to_json(A.*)) AS buyItems\
      FROM\
        "SmeBuy" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."tax", C."totalPrice"\
        FROM "SmeBuyItem" as C, "Product" as B where B.id = C.pid) as A,\
        (SELECT "id", "name", "avatarLink", "phone" FROM "User") AS F\
      where
        "SmeBuy"."id" = A."tid" and "SmeBuy"."agentId" = $1 and F."id" = "SmeBuy"."smeId"\
      group by "SmeBuy"."id", F."name", F."avatarLink", F."phone", "SmeBuy"."total", "SmeBuy"."totalTax",\ 
      "SmeBuy"."totalDeduction", "SmeBuy"."cashback", "SmeBuy"."timestamp", "SmeBuy"."status"\
      ORDER BY "SmeBuy"."timestamp" DESC;`,
      [agent_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
