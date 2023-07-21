const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.get("/calculateAndOffset", async (req, res) => {
    const {type, email} = req.query

	const calculateAndOffsetUrl = `${baseUrl}/api/goNeutral/calculateAndOffset?type=${type}&email=${email}`;

	try {
		const { data: calculateAndOffsetData } = await axios.get(calculateAndOffsetUrl);

		res.send(calculateAndOffsetData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/monthlyGoNeutralData", async (req, res) => {
    const {type, email, year} = req.query
	const monthlyGoNeutralUrl = `${baseUrl}/api/goNeutral/monthlyGoNeutralData?type=${type}&email=${email}&year=${year}`;

	try {
		const { data: monthlyCo2OffsetData } = await axios.get(monthlyGoNeutralUrl);

		res.send(monthlyCo2OffsetData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;