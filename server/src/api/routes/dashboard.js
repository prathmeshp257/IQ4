const { default: axios } = require("axios");
const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");
const { baseUrl } = require("../../config/constants");
const Formatter = require("../../utils/Formatter");
const router = require("express").Router();

dayjs.extend(isoWeek);

const YMD = "YYYY-MM-DD";

router.get("/diff", async (req, res) => {
	const { sites, userType, email } = req.query;

	const diffUrl = `${baseUrl}/api/dashboard/diff?sites=${sites}&userType=${userType}&email=${email}`;

	try {
		const { data } = await axios.get(diffUrl);
		res.send(data);
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/", async (req, res) => {
	const { sites, zoom, userType, email } = req.query;

	try {
		const results = await extractDataForDashboard(sites, zoom, userType, email);
		res.send(results);
	} catch (e) {
		console.log(e)
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.post("/dashboardOccupancyTable", async (req, res) => {
    const dashpboardOccupancyUrl = `${baseUrl}/api/dashboard/dashboardOccupancyTable`;
	try {
		const { data: occupancyData } = await axios.post(dashpboardOccupancyUrl,req.body);
		res.send(occupancyData);
	} catch (e) {
		console.log(e)
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/dwell", async (req, res) => {
	const { site } = req.query;

	if (!site) return res.status(400).send({ message: "Missing query param 'site'" });

	const fromDate = dayjs().format(YMD);
	const toDate = dayjs().add(1, "day").format(YMD);

	const dwellUrl = `${baseUrl}/api/analytics/dwell?site=${site}&fromDate=${fromDate}&toDate=${toDate}`;

	try {
		const { data } = await axios.get(dwellUrl);

		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

const extractDataForDashboard = async (sites, zoom, userType, email) => {
	if (!sites) throw new Error({ status: 400, message: "Missing query param 'sites'" });

	const dashboardUrl = `${baseUrl}/api/dashboard?sites=${sites}&zoom=${zoom}&userType=${userType}&email=${email}`;

	const { data: dashboardData } = await axios.get(dashboardUrl);

	const results = {};

	for (const site of sites.split(",")) {
		const keysLength = Object.keys(dashboardData[site]).length;
		if(keysLength > 0){
			const siteOccupancy = dashboardData[site].occupancy;
			const siteVisits = dashboardData[site].visits;
			const siteDwell = dashboardData[site].dwell;
			const siteHistoric = Array.isArray(dashboardData[site].historic) ? dashboardData[site].historic : dashboardData[site].historic ? [dashboardData[site].historic] : [];
			const siteRepeatTime = dashboardData[site].repeatTime;
			const siteRepeatFrequency = dashboardData[site].repeatFrequency;
			const siteDwellByHour = dashboardData[site].dwellByHour;

			const averageOccupancy = siteOccupancy.data.length > 0 ?
				(siteOccupancy.data.reduce((acc, { occupancy }) => acc + Number(occupancy || 0), 0) / siteOccupancy.data.length) : 0;

			const occupancy = {
				capacity: siteOccupancy.capacity,
				current: zoom === "1d" ? siteOccupancy.current : Number(averageOccupancy).toFixed(0),
				ratio:
					(zoom === "1d" && siteOccupancy.ratio) || Number((averageOccupancy * 100) / siteOccupancy.capacity).toFixed(0),
				data: {
					labels: siteOccupancy.data.map(({ when }) => dayjs(when).format("YYYY-MM-DD HH:mm")),
					values: siteOccupancy.data.map(({ occupancy }) => occupancy)
				}
			};

			const averageVisits = Math.round(siteHistoric.reduce((acc, { ins }) => acc + Number(ins || 0), 0) / siteHistoric.length);

			const visits = {
				total: Object.values(siteVisits).reduce((acc, val) => acc + Number(val || 0), 0),
				average: averageVisits,
				data: {
					labels: Object.keys(siteVisits),
					values: Object.values(siteVisits)
				}
			};

			const comulativeHistoric = siteHistoric.reduce(
				(acc, val) => {
					return {
						ins: acc.ins + val.ins,
						unique: acc.unique + val.unique,
						repeat: acc.repeat + val.repeat,
						uniqueCount: acc.uniqueCount + val.uniqueCount,
						repeatCount: acc.repeatCount + val.repeatCount,
						occupancy: acc.occupancy + val.occupancy,
						dwell: acc.dwell + val.dwell
					};
				},
				{
					ins: 0,
					unique: 0,
					repeat: 0,
					uniqueCount: 0,
					repeatCount: 0,
					occupancy: 0,
					dwell: 0
				}
			);

			const averageHistoric = {
				ins: Math.round(comulativeHistoric.ins / siteHistoric.length),
				unique: Math.round(comulativeHistoric.unique / siteHistoric.length),
				repeat: Math.round(comulativeHistoric.repeat / siteHistoric.length),
				uniqueCount: Math.round(comulativeHistoric.uniqueCount / siteHistoric.length),
				repeatCount: Math.round(comulativeHistoric.repeatCount / siteHistoric.length),
				occupancy: Math.round(comulativeHistoric.occupancy / siteHistoric.length),
				dwell: Math.round(comulativeHistoric.dwell / siteHistoric.length)
			};

			const repeatTime = {
				data: {
					labels: Object.keys(siteRepeatTime),
					values: Object.values(siteRepeatTime)
				}
			};
			
			const frequencyTotal = Object.values(siteRepeatFrequency).reduce((acc, v ) => acc + Number(v || 0) , 0);

			const repeatFrequency = {
				total:frequencyTotal,
				data: {
					labels: Object.keys(siteRepeatFrequency),
					values: Object.values(siteRepeatFrequency)
				}
			};

			const avgTotalDwell = (Object.values(siteDwellByHour).reduce((acc, v ) => acc + Number(v.totalDwell || 0) , 0))/(Object.keys(siteDwellByHour).length);

			const dwellByHour = {
				average:avgTotalDwell,
				data: {
					labels: Object.keys(siteDwellByHour),
					values: Object.values(siteDwellByHour).map(val => val.totalDwell)
				}
			};

			results[site] = {
				site: Formatter.capitalizeSite(site),
				occupancy,
				visits,
				historic: averageHistoric,
				dwell: siteDwell,
				repeatTime,
				repeatFrequency,
				dwellByHour
			};
		}
	}

	return results;
};

module.exports = router;
