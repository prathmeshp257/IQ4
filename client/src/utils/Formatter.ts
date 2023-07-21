const capitalize = (text: string) => {
	return String(text)
		.toLowerCase()
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(" ");
};

const capitalizeSite = (site: string | undefined) => {
	if (!site) return null;
	const formattedSite = site?.replace("site-", "").replace(/-/g, " ");
	return capitalize(formattedSite);
};

const capitalizeSites = (sites: string[] = []): (string | null)[] => {
	return [...sites?.map((site) => capitalizeSite(site))];
};

const normalizeSite = (site: string | undefined) => {
	return site?.replace(/\s+/g, "-").toLowerCase();
};

const normalizeSites = (sites: string[] = []) => {
	return sites?.map((site) => site.replace(/\s+/g, "-").toLowerCase());
};

export const Formatter = {
	capitalize,
	capitalizeSite,
	capitalizeSites,
	normalizeSite,
	normalizeSites
};
