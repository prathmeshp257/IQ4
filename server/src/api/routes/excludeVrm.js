const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const {email, userType} = req.query;
	const listsUrl = `${baseUrl}/api/excludeVrm?email=${email}&userType=${userType}`;

	try {
		const { data } = await axios.get(listsUrl);

		return res.send({ lists: data.lists });
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.post("/", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/excludeVrm`, req.body);
		res.sendStatus(200);
	} catch (e) {
		console.log(e)
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.delete("/", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/excludeVrm?id=${req.query.id}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.put("/", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/excludeVrm`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

module.exports = router;
