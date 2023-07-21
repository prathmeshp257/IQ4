const jwt = require("./jwt");

const authenticate = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) return res.status(403).send("Forbidden - AUTH");

	try {
		const verifyOptions = { issuer: "iQ4" };

		const token = authorizationHeader.split("Bearer ")[1];

		const verified = jwt.verify(token, verifyOptions);

		if (!verified) return res.status(401).send("Access denied - AUTH");

		next();
	} catch (e) {
		return res.status(400).send("Bad request - AUTH");
	}
};

module.exports = authenticate;
