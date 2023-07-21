const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const usersUrl = `${baseUrl}/api/users`;

	try {
		const { data } = await axios.get(usersUrl, { email: req.query.email });

		return res.send({ sites: data.sites });
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/raw", async (_, res) => {
	const sitesRawUrl = `${baseUrl}/api/sites/raw`;

	try {
		const { data } = await axios.get(sitesRawUrl);

		return res.send(data);
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/allSites", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/sites?email=${req.query.email ? req.query.email: ""}`);

		return res.send(data);
	} catch (e) {
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/manualSites", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/sites/manualSites`);
		return res.send(data);
	} catch (e) {
		console.log(e);
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.get("/correctedVrmList", async (req, res) => {
	try {
		const {site,type,email} = req.query ;
		const { data } = await axios.get(`${baseUrl}/api/sites/correctedVrmList?site=${site}&type=${type}&email=${email}`);
		return res.send(data);
	} catch (e) {
		console.log(e);
		res.status(e.status || 500).send({ message: e.message });
	}
});

router.post("/", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/sites`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/addUrl", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/sites/addUrl`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/editUrl", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/sites/editUrl`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/multitaskingGetDataApi", async (req, res) => {
	try {
		const {data} = await axios.post(`${baseUrl}/api/sites/multitaskingGetDataApi`, req.body);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/deleteUrl", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/sites/deleteUrl`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/siteDetails", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/sites/siteDetails`, req.body);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.delete("/", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/sites?site=${req.query.site}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.put("/", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/sites?site=${req.body.id}`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.get("/makeBySite", async (req, res) => {
	try {
		const {site} = req.query;
		if(!site)res.status(500).send("Please enter valid site");
		const { data } = await axios.get(`${baseUrl}/api/sites/makeBySite?site=${site}`);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.get("/modelBySite", async (req, res) => {
	try {
		const {site, make} = req.query;
		if(!site)res.status(500).send("Please enter valid site");
		if(!make)res.status(500).send("Please enter valid make");
		const { data } = await axios.get(`${baseUrl}/api/sites/modelBySite?site=${site}&make=${make}`);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.get("/colorBySite", async (req, res) => {
	try {
		const {site} = req.query;
		if(!site)res.status(500).send("Please enter valid site");
		const { data } = await axios.get(`${baseUrl}/api/sites/colorBySite?site=${site}`);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

module.exports = router;
