const router = require("express").Router();

const ErrorHandler = require("../../utils/ErrorHandler");
const { baseUrl } = require("../../config/constants");
const { default: axios } = require("axios");

router.get("/", async (req, res) => {
	try {
		const email = req.query.email;
		const operatorId = req.query.operatorId;

		if (operatorId) {
			const { data } = await axios.get(`${baseUrl}/api/retailers?email=${email}&operatorId=${operatorId}`);
			return res.send(data);
		}

		const { data } = await axios.get(`${baseUrl}/api/retailers?email=${email}`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/getLogos", async (req, res) => {
	try {
		const email = req.query.email;
		const userType = req.query.userType;

		const { data } = await axios.get(`${baseUrl}/api/retailers/getLogos?email=${email}&userType=${userType}`);

		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.put("/", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/retailers`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/retailers`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.get("/retailers", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/retailers/allRetailer?operator=${req.query.operator ? req.query.operator : ""}`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});
router.get("/operators", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/operators?email=`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});
router.get("/customers", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/customer?email=${req.query.email ? req.query.email : ""}&retailer=${req.query.retailer ? req.query.retailer : ""}`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});
router.get("/admin", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/admin?email=`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/getCoOperator", async (req, res) => {
	const {operator,userType} = req.query;
	try {
		const { data } = await axios.get(`${baseUrl}/api/operators/getCoOperator?operator=${operator}&userType=${userType}`);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});


router.post("/retailer", async (req, res) => {
	try {
		req.body.type = "pdf"
		await axios.post(`${baseUrl}/api/retailers`, req.body);
		//await axios.post(`${baseUrl}/api/templates`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/disableUser", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/retailers/disableUser`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.post("/admin", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/admin`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.post("/operator", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/operators/`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/addCoOperator", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/operators/addCoOperator`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.post("/customer", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/customer`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});


router.delete("/retailer", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/retailers?email=${req.query.email}`);
		await axios.delete(`${baseUrl}/api/templates?id=${req.query.id}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.delete("/admin", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/admin?email=${req.query.email}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.delete("/operator", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/operators?email=${req.query.email}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.delete("/customer", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/customer?email=${req.query.email}`);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});


router.put("/retailer", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/retailers`, req.body);
		//await axios.put(`${baseUrl}/api/templates`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.put("/admin", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/admin`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.put("/operator", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/operators`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

router.post("/editCoOperator", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/operators/editCoOperator`, req.body);
		res.sendStatus(200);
	} catch (e) {
		console.log("error",e)
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.put("/customer", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/customer`, req.body);
		res.sendStatus(200);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});
router.post("/retailers/getSites", async (req, res) => {
	try {
		const {data} = await axios.post(`${baseUrl}/api/retailers/getSites`, req.body);
		res.send(data);
	} catch (e) {
		res.status(500).send({ message: e?.response?.data?.message || "Something went wrong"});
	}
});

module.exports = router;
