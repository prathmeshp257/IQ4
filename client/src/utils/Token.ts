import axios from "axios";

const exists = () => {
	const token = localStorage.getItem("token");
	return !!token;
};

type UserData = {
	pDCalculatorAccess: any;
	pDCalculatorAccessSites: any;
	_id:any;
	firstName: string;
	lastName: string;
	email: string;
	sites: string[];
	operatorId: string;
	userType: any;
	isCoOperator:any;
	insightAccess?:any;
	insightAccessSites?: any;
	siteInfoAccess?:any;
	siteInfoAccessSites?:any;
	occupancyProAccess?:any;
	occupancyProAccessSites?:any;
	occupancy24hAccess?:any;
	occupancy24hAccessSites?:any;
	occupancyTableAccess?:any;
	occupancyTableAccessSites?:any;
	vrmCorrectionAccess?:any;
	vrmCorrectionAccessSites?:any;
	forwardsAccess?:any;
	forwardsAccessSites?:any;
	iqStatAccess?: any;
	iqStatAccessSites?: any;
	vrmValidator?: any;
	vrmValidatorSites?: any;
	goNeutralAccess?: any;
	goNeutralAccessSites?: any;
	voiSettingAccess?: any;
	voiViewOnlyAccess?: any;
	voiSettingAccessSites?: any;
	voiViewOnlyAccessSites?: any;
	voiPrivateAccess?: any;
	voiPrivateAccessSites?: any;
	voiSMSNotifyAccess?:  any;
	voiSMSNotifyAccessSites?: any;
	vehicleSearchAccess?: any;
	vehicleSearchAccessSites?: any;
	vehicleSearchInsightAccess?: any;
	vehicleSearchInsightAccessSites?: any;
	scheduledReportingAccess?: any;
	scheduledReportingAccessSites?: any;
	basicOccupancyAccess?: any;
	basicOccupancyAccessSites?: any;
	matchRateAlertAccess?: any;
	matchRateAlertAccessSites?: any;
	excludeVrmAccess?: any;
	excludeVrmAccessSites?: any;
	dashboardAccess?: any;
	dashboardAccessSites?: any;
	iqVisionAccess?:any;
	iqVisionAccessSites?: any;
};

const user = (token: string): UserData => {
	const base64Payload = String(token).split(".")[1];
	const payload = JSON.parse(atob(base64Payload)) as UserData;
	return payload;
};

const isValid = async (): Promise<boolean> => {
	try {
		await axios.post("/api/token", null, {
			headers: { authorization: "Bearer " + localStorage.getItem("token") }
		});

		return true;
	} catch (error) {
		return false;
	}
};

export const Token = {
	exists,
	user,
	isValid
};
