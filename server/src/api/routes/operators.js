const router = require("express").Router();
const { baseUrl } = require("../../config/constants");
const { default: axios } = require("axios");

router.get("/:id", async (req, res) => {
	try {
		const { id: operatorId } = req.params;

		if (!operatorId) return res.status(400).send({ message: "Bad request" });

		const { data } = await axios.get(`${baseUrl}/api/operators/${operatorId}`);

		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/AllOperatorWithCoOperator", async (req, res) => {
	try {

		const { data } = await axios.get(`${baseUrl}/api/operators/AllOperatorWithCoOperator`);

		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;
