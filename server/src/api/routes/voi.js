const router = require("express").Router();
const { sendZip } = require("../../utils/ArchiveUtil");
const ErrorHandler = require("../../utils/ErrorHandler");
const { baseUrl } = require("../../config/constants");
const { default: axios } = require("axios");

router.post("/all", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/voi/all`,req.body);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.get("/bySites", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/voi/bySites?sites=${req.query.sites}&userType=${req.query.userType}&email=${req.query.email}`);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/historic", async (req, res) => {
	try {
		const {page, perPage, site, listName, responseType="json", insightsData='true', userType, email} = req.body
		
		const { data } = await axios.post(`${baseUrl}/api/voi/historic`, {page,perPage,site,listName,userType,email,insightsData,responseType},{responseType: responseType === "json" ? "json" : "arraybuffer"});
		if (responseType === "csv") {
			const zipFiles = [
				{ fileName: `voi_history`, file: data },
			];

			await sendZip({ files: zipFiles, zipName: "VOIHistory", res });
			return;
		}
		else{
			res.send(data);
		}
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.put("/", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/voi`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/voi`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.delete("/", async (req, res) => {
	try {
		await axios.delete(`${baseUrl}/api/voi?id=${req.query.id}&type=${req.query.type}`);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.get("/search", async (req, res) => {
	try {
		const { data } = await axios.get(`${baseUrl}/api/voi/search`, {
			params: req.query,
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `vehicle_search`, file: data },
			];
			await sendZip({ files: zipFiles, zipName: "VehicleSearch", res });
			return;
		}
		else{
			res.status(200).send(data);
		}
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/addRemoveVehicle", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/voi/addRemoveVehicle`, req.body);
		res.sendStatus(200);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.get("/fetchEmailGroups", async (req, res) => {
	try {
		const {createdBy, userType} = req.query
		const { data } = await axios.get(`${baseUrl}/api/voi/fetchEmailGroups?createdBy=${createdBy}&userType=${userType}`);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/addAndEditEmailGroups", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/voi/addAndEditEmailGroups`,req.body);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});


router.post("/archiveNotification", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/voi/archiveNotification`,req.body);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});


router.delete("/deleteEmailGroups", async (req, res) => {
	try {
		const { data } = await axios.delete(`${baseUrl}/api/voi/deleteEmailGroups?groupId=${req.query.groupId}`);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/privateVoiList", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/voi/privateVoiList`,req.body);
		res.send(data);
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

module.exports = router;
