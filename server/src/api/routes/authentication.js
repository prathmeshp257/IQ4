const router = require("express").Router();
const ErrorHandler = require("../../utils/ErrorHandler");
const { default: axios } = require("axios");
const { baseUrl } = require("../../config/constants");

router.post("/login", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/retailers/login`, req.body);
		return res.status(200).send({ 
				token: data.token, 
				userType:data.userType, 
				userLogo:data.userLogo, 
				profileImg:data.profileImg, 
			});
		
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/adminLogin", async (req, res) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/admin/login`, req.body);
		return res.status(200).send({ token: data.token, userLogo:data.userLogo ,profileImg:data.profileImg });
	} catch (e) {
		return ErrorHandler.generic(res, e);
	}
});

router.post("/logout", async (req, res) => {
	await axios.post(`${baseUrl}/api/retailers/logout`, req.body);
	return res.status(200).send("User Logged Out Successfully");
});

module.exports = router;
