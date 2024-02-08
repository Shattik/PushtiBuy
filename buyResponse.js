const supabase = require("./db.js");
const router = require("express").Router();

router.route("/farmer/reject").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "FarmerBuy" SET status = 'rejected' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Rejected successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Error in rejecting"
        }
        res.json(response);
    }
});

router.route("/sme/reject").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "SmeBuy" SET status = 'rejected' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Rejected successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Error in rejecting"
        }
        res.json(response);
    }
});

router.route("/farmer/accept").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "FarmerBuy" SET status = 'approved' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Accepted successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Not enough budget"
        }
        res.json(response);
    }
});

router.route("/sme/accept").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "SmeBuy" SET status = 'approved' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Accepted successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Not enough budget"
        }
        res.json(response);
    }
});

module.exports = router;