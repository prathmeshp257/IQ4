const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const systemHealthUrl = `${baseUrl}/api/health/systemHealth`;

	try {
		const { data: systemHealthData } = await axios.get(systemHealthUrl);

		res.send(systemHealthData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/mmc", async (req, res) => {
	const {page, perPage} = req.query

	const systemHealthUrl = `${baseUrl}/api/health/systemHealthMmc?page=${page}&perPage=${perPage}`;
	try {
		const { data: systemHealthData } = await axios.get(systemHealthUrl);

		res.send(systemHealthData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/mmcFailedData", async (req, res) => {
	const failedDataUrl = `${baseUrl}/api/health/mmcFailedData`;

	try {
		const { data: failedData } = await axios.get(failedDataUrl);
		res.send(failedData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/vrmCorrectionStats", async (req, res) => {
	const {page,perPage} = req.query;
	const vrmCorrectionStatsUrl = `${baseUrl}/api/health/vrmCorrectionStats?page=${page}&perPage=${perPage}`;

	try {
		const { data: vrmCorrectionStats } = await axios.get(vrmCorrectionStatsUrl);
		res.send(vrmCorrectionStats);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/co2FailedData", async (req, res) => {
	const failedDataUrl = `${baseUrl}/api/health/co2FailedData`;

	try {
		const { data: failedData } = await axios.get(failedDataUrl);

		res.send(failedData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/valuationData", async (req, res) => {
	const valuationDataUrl = `${baseUrl}/api/health/valuationData`;

	try {
		const { data: valuationData } = await axios.get(valuationDataUrl);

		res.send(valuationData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/loginData", async (req, res) => {
	const {type, email, name} = req.query;

	const loginDataUrl = `${baseUrl}/api/health/loginData?type=${type || ''}&email=${email || ''}&name=${name || ''}`;

	try {
		const { data: loginData } = await axios.get(loginDataUrl);

		res.send(loginData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/filterData", async (req, res) => {
	const filterDataUrl = `${baseUrl}/api/health/filterData`;

	try {
		const { data: filterData } = await axios.get(filterDataUrl);

		res.send(filterData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;
