import { Formatter } from ".";

export const formatSite = (site: any, email: any) => {
	if (["guykendall@eurocarparks.com", "peter.coakley@smartparking.com"].includes(email)) {
		if (Formatter.normalizeSite(site) === "king-st-west-stockport") return "King St";
		if (Formatter.normalizeSite(site) === "test") return "Office";
	}
	return site;
};
