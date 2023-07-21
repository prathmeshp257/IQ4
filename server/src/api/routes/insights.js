const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
		const response = await axios.post(`${baseUrl}/api/insights`, req.body);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/", async (req, res) => {
	const tariffListngUrl = `${baseUrl}/api/insights`;
	try {
		const { data} = await axios.get(tariffListngUrl);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.delete("/", async (req, res) => {
	const { id } = req.query;
	const tariffListngUrl = `${baseUrl}/api/insights?id=${id}`;
	try {
		await axios.delete(tariffListngUrl);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/response", async (req, res) => {
	const pAndDResponseUrl = `${baseUrl}/api/insights/response`;
	try {
		const { data} = await axios.get(pAndDResponseUrl);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/overstaysListing", async (req, res) => {
	const overstaysURL = `${baseUrl}/api/insights/overstaysListing`;
	try {
		const { data} = await axios.post(overstaysURL,req.body);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;


