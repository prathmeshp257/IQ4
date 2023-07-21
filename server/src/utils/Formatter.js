const capitalize = (text) => {
	return String(text)
		.toLowerCase()
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(" ");
};

const capitalizeSite = (site) => {
	const formattedSite = site.replace("site-", "").replace(/-/g, " ") || "";
	return capitalize(formattedSite);
};

const capitalizeSites = (sites) => {
	return sites.map((site) => capitalize(site.replace(/-/g, " ")));
};

const normalizeSite = (site) => {
	return site.replace(/\s+/g, "-").toLowerCase();
};

const normalizeSites = (sites) => {
	return sites.map((site) => site.replace(/\s+/g, "-").toLowerCase());
};

module.exports = {
	capitalize,
	capitalizeSite,
	capitalizeSites,
	normalizeSite,
	normalizeSites
};
