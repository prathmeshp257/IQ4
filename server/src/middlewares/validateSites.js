const Token = require("../utils/Token");
const Formatter = require("../utils/Formatter");

const validateSites = (req, res, next) => {
	try {
		if (req.query.sites) {
			const tokenPayload = Token.extractPayload(req.headers);
			const allowedSites = Formatter.normalizeSites(tokenPayload.sites);
			const requestedSites = Formatter.normalizeSites(req.query.sites.split(","));

			const filteredRequestedSites = requestedSites.filter((requestedSite) => allowedSites.includes(requestedSite));

			req.query.sites = filteredRequestedSites.join();

			next();
		} else {
			next();
		}
	} catch (e) {
		return res.status(401).send("Unauthorised access to site");
	}
};

module.exports = validateSites;
