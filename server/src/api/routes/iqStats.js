const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");
const router = require("express").Router();
const { sendZip } = require("../../utils/ArchiveUtil");

router.get("/", async (req, res) => {
	const { type, email } = req.query

	const iqStatUrl = `${baseUrl}/api/iqStats?type=${type}&email=${email}`;

	try {
		const { data: iqStatData } = await axios.get(iqStatUrl);

		res.send(iqStatData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/history", async (req, res) => {
	const { type, email, site, responseType = 'json' } = req.query

	const iqStatHistoryUrl = `${baseUrl}/api/iqStats/history?type=${type}&responseType=${responseType}&email=${email}&site=${site}`;


	try {
		const { data: matching_data } = await axios.get(iqStatHistoryUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});

		// const { data: iqStatData } = await axios.get(iqStatHistoryUrl);
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `matching_data`, file: matching_data },
			];
			await sendZip({ files: zipFiles, zipName: "matching_data", res });
			return;
		}
		else {
			res.status(200).send(matching_data);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}


});

router.get("/clusterData", async (req, res) => {
	const { type, userType, email, site, page} = req.query

	const iqStatClusterUrl = `${baseUrl}/api/iqStats/clusterData?userType=${userType}&type=${type}&email=${email}&site=${site}&page=${page}`;

	try {
		const { data: iqStatClusterData } = await axios.get(iqStatClusterUrl);

		res.send(iqStatClusterData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});



router.get("/approxData", async (req, res) => {
	const { type, userType, email, site, page} = req.query

	const iqStatApproxUrl = `${baseUrl}/api/iqStats/approxData?userType=${userType}&type=${type}&email=${email}&site=${site}&page=${page}`;

	try {
		const { data: iqStatApproxData } = await axios.get(iqStatApproxUrl);

		res.send(iqStatApproxData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/unmatchedData", async (req, res) => {
	const { type, email, site, page, perPage } = req.query

	const iqStatUnmatchedUrl = `${baseUrl}/api/iqStats/unmatchedData?type=${type}&email=${email}&site=${site}&page=${page}&perPage=${perPage}`;

	try {
		const { data: iqStatUnmatchedData } = await axios.get(iqStatUnmatchedUrl);

		res.send(iqStatUnmatchedData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/getCamera", async (req, res) => {
	const { type, email, site } = req.query

	const iqStatVrmCount = `${baseUrl}/api/iqStats/getCamera?type=${type}&email=${email}&site=${site}`;

	try {
		const { data: iqStatVrmCountData } = await axios.get(iqStatVrmCount);

		res.send(iqStatVrmCountData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/getCameraApiCallData", async (req, res) => {
	const { type, email, site } = req.query

	const cameraAPICallUrl = `${baseUrl}/api/iqStats/getCameraApiCallData?type=${type}&email=${email}&site=${site}`;

	try {
		const { data: cameraAPICallData } = await axios.get(cameraAPICallUrl);

		res.send(cameraAPICallData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/getVrmCount", async (req, res) => {
	const { type, email, site, camera } = req.body

	const iqStatVrmCountData = `${baseUrl}/api/iqStats/getVrmCount?type=${type}&email=${email}&site=${site}&camera=${camera}`;

	try {
		const { data: iqStatVrmCountCamData } = await axios.post(iqStatVrmCountData, { type, email, site, camera });

		res.send(iqStatVrmCountCamData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/allNotification", async (req, res) => {
	const { site, page, perPage, status, priorityStatus, sortType, notificationType, type, email } = req.body;
	const allNotification = `${baseUrl}/api/iqStats/allNotification`
	try {
		const { data: allNotificationData } = await axios.post(allNotification, { site, page, perPage, status, priorityStatus, sortType, notificationType, type, email });
		res.status(200).send(allNotificationData);
	} catch (e) {
		console.log("error", e);
		res.status(500).send({ message: e.message });
	}
});

router.get("/popAllNotification", async (req, res) => {
	const { site, page, perPage, status, camera, notificationType, subNotification } = req.query;
	const popAllNotification = `${baseUrl}/api/iqStats/popAllNotification?site=${site}&page=${page}&perPage=${perPage}&status=${status}&camera=${camera ? camera.replace("&", "%26") : ""}&notificationType=${notificationType}&subNotification=${subNotification}`
	try {
		const { data: popAllNotificationData } = await axios.get(popAllNotification);
		res.status(200).send(popAllNotificationData);
	} catch (e) {
		console.log("error", e);
		res.status(500).send({ message: e.message });
	}
});
router.get("/averageMatchRate", async (req, res) => {
	const { email, userType, site, filterType, type } = req.query;
	const averageMatchRate = `${baseUrl}/api/iqStats/averageMatchRate?site=${site}&email=${email}&filterType=${filterType.replace('+', '%2B')}&userType=${userType}&type=${type}`
	try {
		const { data: averageMatchRateData } = await axios.get(averageMatchRate);
		res.status(200).send(averageMatchRateData);
	} catch (e) {
		console.log("error", e);
		res.status(500).send({ message: e.message });
	}
});


router.post("/allNotificationActionTaken", async (req, res) => {
	const { status, notification_id, notificationType, subNotification, daysToSnooze, camera, site, userType, createdBy } = req.body;


	const allNotificationActionTaken = `${baseUrl}/api/iqStats/allNotificationActionTaken`;

	try {
		const { data: allNotificationActionTakenData } = await axios.post(allNotificationActionTaken, { status, notification_id, notificationType, subNotification, daysToSnooze, camera, site, userType, createdBy });

		res.send(allNotificationActionTakenData);
	} catch (e) {

		console.log("errror", e)
		res.status(500).send({ message: e.message });
	}
});

router.post("/allNotificationDeleteAction", async (req, res) => {
	const { email, type, site, status, notification_id, notificationType, subNotification} = req.body;

	const allNotificationDeleteAction = `${baseUrl}/api/iqStats/allNotificationDeleteAction`;

	try {
		await axios.post(allNotificationDeleteAction, { email, type, site, status, notification_id, notificationType, subNotification});
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});


router.post("/addNotification", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/iqStats/addNotification`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.post("/addCameraNotification", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/iqStats/addCameraNotification`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});



router.post("/addNotes", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/iqStats/addNotes`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});



router.get("/listNotes", async (req, res) => {
	const { notification_id, notificationType, filterType } = req.query;
	const iqStatNotificationUrl = `${baseUrl}/api/iqStats/listNotes?notification_id=${notification_id}&notificationType=${notificationType}&filterType=${filterType}`;
	try {
		const { data: notificationsData } = await axios.get(iqStatNotificationUrl);
		res.send(notificationsData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/notifications", async (req, res) => {
	const { userType, createdBy } = req.query;
	const iqStatNotificationUrl = `${baseUrl}/api/iqStats/notifications?userType=${userType}&createdBy=${createdBy}`;
	try {
		const { data: notificationsData } = await axios.get(iqStatNotificationUrl);
		res.send(notificationsData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/cameraNotifications", async (req, res) => {
	const { userType, createdBy } = req.query;
	const cameraNotificationUrl = `${baseUrl}/api/iqStats/cameraNotifications?userType=${userType}&createdBy=${createdBy}`;
	try {
		const { data: cameraNotificationsData } = await axios.get(cameraNotificationUrl);
		res.send(cameraNotificationsData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});


router.get("/getSafStatusData", async (req, res) => {
	const { site, title } = req.query;
	try {
		const { data: safStatusData } = await axios.get(`${baseUrl}/api/iqStats/getSafStatusData?site=${site}&title=${title}`);
		res.send(safStatusData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/fetchNotificationSites", async (req, res) => {
	const { type, userType, email } = req.query;
	const fetchNotificationSites = `${baseUrl}/api/iqStats/fetchNotificationSites?type=${type}&userType=${userType}&email=${email}`;
	try {
		const { data: fetchNotificationSitesData } = await axios.get(fetchNotificationSites);
		res.send(fetchNotificationSitesData);
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});



router.post("/editMultipleNotification", async (req, res) => {
	try {
		await axios.post(`${baseUrl}/api/iqStats/editMultipleNotification`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.delete("/notification", async (req, res) => {
	const { id } = req.query;
	const iqStatNotificationUrl = `${baseUrl}/api/iqStats/notification?id=${id}`;
	try {
		await axios.delete(iqStatNotificationUrl);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.delete("/cameraNotification", async (req, res) => {
	const { id } = req.query;
	const iqStatNotificationUrl = `${baseUrl}/api/iqStats/cameraNotification?id=${id}`;
	try {
		await axios.delete(iqStatNotificationUrl);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.put("/editNotification", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/iqStats/editNotification`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.put("/editCameraNotification", async (req, res) => {
	try {
		await axios.put(`${baseUrl}/api/iqStats/editCameraNotification`, req.body);
		res.status(200).send();
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});




router.get("/timeSync", async (req, res) => {
	const { site, page = 0, perPage = 50, responseType = 'json', userType, email } = req.query;
	const iqStatTimeSyncUrl = `${baseUrl}/api/iqStats/timeSync?site=${site}&page=${page}&perPage=${perPage}&responseType=${responseType}&userType=${userType}&email=${email}`;
	try {
		const { data: timeSyncData } = await axios.get(iqStatTimeSyncUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `time_sync`, file: timeSyncData },
			];
			await sendZip({ files: zipFiles, zipName: "TimeSync", res });
			return;
		}
		else {
			res.status(200).send(timeSyncData);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/heartbeat", async (req, res) => {
	const { site, page = 0, perPage = 50, responseType = 'json', userType, email } = req.query;
	const iqStatHeartbeatUrl = `${baseUrl}/api/iqStats/heartbeat?site=${site}&page=${page}&perPage=${perPage}&responseType=${responseType}&userType=${userType}&email=${email}`;
	try {
		const { data: heartbeatData } = await axios.get(iqStatHeartbeatUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `heartbeat`, file: heartbeatData },
			];
			await sendZip({ files: zipFiles, zipName: "Heartbeat", res });
			return;
		}
		else {
			res.status(200).send(heartbeatData);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/frameCount", async (req, res) => {
	const { site, page = 0, perPage = 50, responseType = 'json', userType, email } = req.query;
	const iqStatFrameCountUrl = `${baseUrl}/api/iqStats/frameCount?site=${site}&page=${page}&perPage=${perPage}&responseType=${responseType}&userType=${userType}&email=${email}`;
	try {
		const { data: frameCountData } = await axios.get(iqStatFrameCountUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `frame_count`, file: frameCountData },
			];
			await sendZip({ files: zipFiles, zipName: "FrameCount", res });
			return;
		}
		else {
			res.status(200).send(frameCountData);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/rebootLog", async (req, res) => {
	const { site, page = 0, perPage = 50, responseType = 'json', userType, email } = req.query;
	const iqStatRebootLogUrl = `${baseUrl}/api/iqStats/rebootLog?site=${site}&page=${page}&perPage=${perPage}&responseType=${responseType}&userType=${userType}&email=${email}`;
	try {
		const { data: rebootLogData } = await axios.get(iqStatRebootLogUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `reboot_log`, file: rebootLogData },
			];
			await sendZip({ files: zipFiles, zipName: "RebootLog", res });
			return;
		}
		else {
			res.status(200).send(rebootLogData);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

router.get("/matchAlert", async (req, res) => {
	const { site, page = 0, perPage = 50, responseType = 'json', userType, email } = req.query;

	const iqStatMatchAlertUrl = `${baseUrl}/api/iqStats/matchAlert?site=${site}&page=${page}&perPage=${perPage}&responseType=${responseType}&userType=${userType}&email=${email}`;
	try {
		const { data: matchAlertData } = await axios.get(iqStatMatchAlertUrl, {
			responseType: req.query.responseType === "csv" ? "arraybuffer" : "json"
		});
		if (req.query.responseType === "csv") {
			const zipFiles = [
				{ fileName: `match_alert`, file: matchAlertData },
			];
			await sendZip({ files: zipFiles, zipName: "MatchAlert", res });
			return;
		}
		else {
			res.status(200).send(matchAlertData);
		}
	} catch (e) {
		res.status(500).send({ message: e.message });
	}
});

module.exports = router;
