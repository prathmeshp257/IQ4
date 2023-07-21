const { default: axios } = require("axios");
const dayjs = require("dayjs");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

const YMD = "YYYY-MM-DD";

router.get("/", async (req, res) => {
	const { sites, userType, email } = req.query;

	const fromDate = dayjs(dayjs().format(YMD)).toDate();
	const toDate = dayjs(dayjs().format(YMD)).add(1, "day").toDate();

	const liveUrl = `${baseUrl}/api/analytics/live?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&userType=${userType}&email=${email}`;

	try {
		const { data: sitesData } = await axios.get(liveUrl);

		res.send(sitesData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;
