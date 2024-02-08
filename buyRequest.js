const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {
    const { agent_id } = req.body;

    try {
        let farmers = await supabase.any(`select * from "Farmer" where "agentId" = $1`, [agent_id]);
        let products = await supabase.any(`select * from "Product"`);
        let response = {
            farmers: farmers,
            products: products,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /buy_request/farmer:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }

});

router.route("/sme").post(async (req, res) => {
    const { agent_id } = req.body;

    try {
        let smes = await supabase.any(`select * from "Sme" where "agentId" = $1`, [agent_id]);
        let products = await supabase.any(`select * from "Product"`);
        let response = {
            smes: smes,
            products: products,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /buy_request/sme:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }

});

module.exports = router;