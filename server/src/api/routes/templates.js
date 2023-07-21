const router = require("express").Router();

const { baseUrl } = require("../../config/constants");
const { default: axios } = require("axios");

router.get("/", async (req, res) => {
	try {
		const email = req.query.email;

		if (!email) return res.status(400).send({ message: "Bad request" });

		const { data } = await axios.get(`${baseUrl}/api/templates?email=${email}`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;
