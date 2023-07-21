const router = require("express").Router();
const jwt = require("../../middlewares/jwt");
const { baseUrl } = require("../../config/constants");
const axios = require("axios");

router.post("/", async (req, res) => {
	const authorizationHeader = req.headers.authorization;

	const token = authorizationHeader.split("Bearer ")[1];

	const verifyOptions = { issuer: "iQ4" };

	try {
		const verified = jwt.verify(token, verifyOptions);
		if (!verified) return res.status(403).send({ message: "Forbidden: TOKEN" });
	} catch (e) {
		return res.status(400).send({ message: "Bad request - TOKEN" });
	}

	return res.status(200).send({ token });
});

router.post("/refresh", async (req, res) => {
	const authorizationHeader = req.headers.authorization;

	const token = authorizationHeader.split("Bearer ")[1];

	const verifyOptions = { issuer: "iQ4" };

	try {
		const verified = jwt.verify(token, verifyOptions);
		if (!verified) return res.status(403).send({ message: "Forbidden: TOKEN" });
	} catch (e) {
		return res.status(400).send({ message: "Bad request - TOKEN" });
	}

	try {
		if(req.body.userType === "Admin"){
			const { data } = await axios.post(`${baseUrl}/api/admin/login`, {
				email: req.body.email,
				password: req.body.password
			});
			return res.status(200).send({ token: data.token });
		}
		else{
			const { data } = await axios.post(`${baseUrl}/api/retailers/login`, {
				email: req.body.email,
				password: req.body.password
			});
			return res.status(200).send({ token: data.token });
		}

	} catch (error) {
		return res.status(500).send({ message: "Something went wrong with your authorisation" });
	}
});

module.exports = router;
