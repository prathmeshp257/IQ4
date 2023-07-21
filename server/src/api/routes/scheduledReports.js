const router = require("express").Router();
const ErrorHandler = require("../../utils/ErrorHandler");
const { baseUrl } = require("../../config/constants");
const { default: axios } = require("axios");

router.get("/all", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/scheduledReports/all?sites=${req.query.sites}&userType=${req.query.userType}`);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.put("/", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/scheduledReports`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/scheduledReports`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.delete("/", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/scheduledReports?id=${req.query.id}`);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

module.exports = router;
