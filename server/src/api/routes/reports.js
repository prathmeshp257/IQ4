const { default: axios } = require("axios");
const dayjs = require("dayjs");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();
const { sendZip } = require("../../utils/ArchiveUtil");

const YMD = "YYYY-MM-DD";

router.get("/", async (req, res) => {
	const { sites, format, userType, email } = req.query;

	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

	const responseType = req.query.responseType || "json";
	const reportsUrl = `${baseUrl}/api/reports/historic?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&email=${email}`;
	
	try {
		const { data } = await axios.get(`${reportsUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "reports", file: data },
			];

			await sendZip({ files: zipFiles, zipName: "reports", res });
			return;
		}else{
			return res.send({data});
		}

	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/repeatTime", async (req, res) => {
	const { sites, format, userType, email} = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

	const responseType = req.query.responseType || "json";

	const repeatTimeUrl = `${baseUrl}/api/visits/repeatTime?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&email=${email}`;

	try {
		const { data: repeatTime } = await axios.get(`${repeatTimeUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "reports_repeat_time", file: repeatTime },
			];

			await sendZip({ files: zipFiles, zipName: "reports", res });
			return;
		}else{
			return res.send({repeatTime});
		}

	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/repeatFrequency", async (req, res) => {
	const { sites, format, userType, email } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

	const responseType = req.query.responseType || "json";

	const repeatFrequencyUrl = `${baseUrl}/api/visits/repeatFrequency?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&email=${email}`;

	try {
		const { data: repeatFrequency } = await axios.get(`${repeatFrequencyUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "reports_repeat_frequency", file: repeatFrequency },
			];

			await sendZip({ files: zipFiles, zipName: "reports", res });
			return;
		}else{
			return res.send({repeatFrequency});
		}

	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/dwellByHour", async (req, res) => {
	const { sites, format, userType, email } = req.query;
	const fromDate = dayjs(req.query.fromDate).format(YMD);
	const toDate = dayjs(req.query.toDate).add(1, 'day').format(YMD);

	const responseType = req.query.responseType || "json";

	const dwellByHourUrl = `${baseUrl}/api/analytics/dwellByHour?sites=${sites}&fromDate=${fromDate}&toDate=${toDate}&format=${format}&userType=${userType}&email=${email}`;

	try {
		const { data: dwellByHour } = await axios.get(`${dwellByHourUrl}&responseType=${responseType}`, {
			responseType: responseType === "json" ? "json" : "arraybuffer"
		});

		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: "reports_dwell_by_hour", file: dwellByHour }
			];

			await sendZip({ files: zipFiles, zipName: "reports", res });
			return;
		}else{
			return res.send({dwellByHour});
		}

	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

module.exports = router;
