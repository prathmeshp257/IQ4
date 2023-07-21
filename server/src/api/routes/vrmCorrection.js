const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.get("/vrmCorrectionListingManual", async (req, res) => {
    const { email, type, site, page } = req.query;
	const vrmCorrectionListingManualUrl = `${baseUrl}/api/vrmCorrection/vrmCorrectionListingManual?email=${email}&type=${type}&site=${site}&page=${page}`;
	try {
		const { data: vrmCorrectionData } = await axios.get(vrmCorrectionListingManualUrl);
		res.send(vrmCorrectionData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/editVrm", async (req, res) => {
	try {
		const response = await axios.post(`${baseUrl}/api/vrmCorrection/editVrm`, req.body);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post('/setCluster', async (req, res) => {
	try {
		const {data} = await axios.post(`${baseUrl}/api/vrmCorrection/setCluster`,req.body);
		res.send(data)
	} catch (e) {
		res.status(500).send({ message: e.message });
	}

})

router.post("/resend", async (req, res) => {
	try {
		const response = await axios.post(`${baseUrl}/api/vrmCorrection/resend`, req.body);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/vrmCorrectionListing", async (req, res) => {
    const { email, type, site, date, sortType,historicDataAccess,clusterDataAccess,page } = req.query;
	const vrmCorrectionUrl = `${baseUrl}/api/vrmCorrection/vrmCorrectionListing?type=${type}&email=${email}&site=${site}&date=${date}&sortType=${sortType}&historicDataAccess=${historicDataAccess}&clusterDataAccess=${clusterDataAccess}&page=${page}`;
	try {
		const { data: vrmCorrectionData } = await axios.get(vrmCorrectionUrl);
		res.send(vrmCorrectionData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/vrmCorrectionHistory", async (req, res) => {
    const { email, type, site} = req.query;
	const vrmCorrectionHistoryUrl = `${baseUrl}/api/vrmCorrection/vrmCorrectionHistory?type=${type}&email=${email}&site=${site}`;
	try {
		const { data: vrmCorrectionHistoryData } = await axios.get(vrmCorrectionHistoryUrl);
		res.send(vrmCorrectionHistoryData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/vrmCorrectedBefore", async (req, res) => {
    const { vrm,site,email,type} = req.query;
	const vrmCorrectedUrl = `${baseUrl}/api/vrmCorrection/vrmCorrectedBefore?vrm=${vrm}&site=${site}&email=${email}&type=${type}`;
	try {
		const { data: vrmCorrectedData } = await axios.get(vrmCorrectedUrl);
		res.send(vrmCorrectedData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});


router.get("/allReportListing", async (req, res) => {
    const { userType,createdBy} = req.query;
	const vrmCorrectedUrl = `${baseUrl}/api/vrmCorrection/allReportListing?userType=${userType}&createdBy=${createdBy}`;
	try {
		const { data: vrmCorrectionReportData } = await axios.get(vrmCorrectedUrl);
		res.send(vrmCorrectionReportData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/addReportNotification", async (req, res) => {
	try {
		const response = await axios.post(`${baseUrl}/api/vrmCorrection/addReportNotification`, req.body);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.put("/editReportNotification", async (req, res) => {
	try {
		const response = await axios.put(`${baseUrl}/api/vrmCorrection/editReportNotification`, req.body);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.delete("/", async (req, res) => {
    const { id } = req.query;
	try {
		const response = await axios.delete(`${baseUrl}/api/vrmCorrection/?id=${id}`);
		res.send(response.data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});
module.exports = router;