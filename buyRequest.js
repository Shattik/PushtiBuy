const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer").post(async (req, res) => {
    const { agent_id } = req.body;

    try {
        let farmers = await supabase.any(`select "nid", "phone", "name", "avatarLink", "permanentAddress", "rank", "points", "farmerType", "cashback", "taxDeduction"
                                            from "Farmer" as F, "User" as U, "Rank" as R
                                            where F."id" = U."id"
                                            and F."rank" = R."className"
                                            and "agentId" = $1`, [agent_id]);
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
        let smes = await supabase.any(`select "nid", "phone", "name", "avatarLink", "permanentAddress", "rank", "points", "cashback", "taxDeduction"
                                        from "Sme" as S, "User" as U, "Rank" as R
                                        where S."id" = U."id"
                                        and S."rank" = R."className"
                                        and "agentId" = $1`, [agent_id]);
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

router.route("/farmer/info").post(async (req, res) => {
    const { farmer_nid } = req.body;

    try {
        let rem = await supabase.any(`select "ongoingLoan" from "Farmer" where "id" = (select "id" from "User" where "nid" = $1)`, [farmer_nid]);
        if(rem.length == 0) {
            let response = {
                remaining: 0,
            }
            res.status(200).send(response);
            return;
        }
        let info = await supabase.any(`select "remainingAmount" from "FarmerLoan" where "id" = $1`, [rem[0].ongoingLoan]);
        let response = {
            remaining: info[0].remainingAmount,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /buy_request/farmer/info:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

router.route("/sme/info").post(async (req, res) => {
    const { sme_nid } = req.body;

    try {
        let rem = await supabase.any(`select "ongoingLoan" from "Sme" where "id" = (select "id" from "User" where "nid" = $1)`, [sme_nid]);
        if(rem.length == 0) {
            let response = {
                remaining: 0,
            }
            res.status(200).send(response);
            return;
        }
        let info = await supabase.any(`select "remainingAmount" from "SmeLoan" where "id" = $1`, [rem[0].ongoingLoan]);
        let response = {
            remaining: info[0].remainingAmount,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /buy_request/sme/info:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

router.route("/farmer/submit").post(async (req, res) => {
    const { buyReq, buyItems } = req.body;
    try{
        let buyReqId = await supabase.any(`insert into "FarmerBuy" ("agentId", "farmerId", "total", "totalTax", "totalDeduction", "cashback") 
                                            values ($1, $2, $3, $4, $5, $6) returning "id"`, 
                                            [buyReq.agentId, buyReq.farmerId, buyReq.total, buyReq.totalTax, buyReq.totalDeduction, buyReq.cashback]);
        buyReqId = buyReqId[0].id;
        for (let i = 0; i < buyItems.length; i++) {
            let buyItem = buyItems[i];
            await supabase.none(`insert into "FarmerBuyItem" ("tid", "pid", "quantity", "totalPrice", "tax") 
                                values ($1, $2, $3, $4, $5)`, 
                                [buyReqId, buyItem.productId, buyItem.quantity, buyItem.price, buyItem.tax]);
        }
        let info = await supabase.any(`select "id", "timestamp", "status" from "FarmerBuy" where "id" = $1`, [buyReqId]);
        res.status(200).send(info);
    }
    catch (error) {
        console.error("Error in /buy_request/farmer/submit:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

router.route("/sme/submit").post(async (req, res) => {
    const { buyReq, buyItems } = req.body;
    try{
        let buyReqId = await supabase.any(`insert into "SmeBuy" ("agentId", "smeId", "total", "totalTax", "totalDeduction", "cashback") 
                                            values ($1, $2, $3, $4, $5, $6) returning "id"`, 
                                            [buyReq.agentId, buyReq.smeId, buyReq.total, buyReq.totalTax, buyReq.totalDeduction, buyReq.cashback]);
        buyReqId = buyReqId[0].id;
        for (let i = 0; i < buyItems.length; i++) {
            let buyItem = buyItems[i];
            await supabase.none(`insert into "SmeBuyItem" ("tid", "pid", "quantity", "totalPrice", "tax") 
                                values ($1, $2, $3, $4, $5)`, 
                                [buyReqId, buyItem.productId, buyItem.quantity, buyItem.price, buyItem.tax]);
        }
        let info = await supabase.any(`select "id", "timestamp", "status" from "SmeBuy" where "id" = $1`, [buyReqId]);
        res.status(200).send(info);
    }
    catch (error) {
        console.error("Error in /buy_request/sme/submit:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

module.exports = router;