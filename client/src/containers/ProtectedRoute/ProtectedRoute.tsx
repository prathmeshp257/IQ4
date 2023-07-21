import React, { FC, useContext } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { PATHS } from "../../constants";
import { AuthContext } from "../../context";
import { Token } from "../../utils";
import { Shell } from "../Shell";

interface ProtectedRouteProps {
	component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
	requiredLevel?: number;
	path?: string;
	exact?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ path, exact, component: Component, requiredLevel = 0, ...rest }) => {
	const { loading, userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const insightAccess = userData.insightAccess;
	const insightAccessSites = userData.insightAccessSites || [];
	const iqStatAccess = userData.iqStatAccess;
	const iqStatAccessSites = userData.iqStatAccessSites|| [];
	const vrmCorrectionAccess = userData.vrmCorrectionAccess;
	const vrmCorrectionAccessSites = userData.vrmCorrectionAccessSites || [];
	const voiSettingAccess = userData.voiSettingAccess;
	const voiViewOnlyAccess = userData.voiViewOnlyAccess;
	const voiSettingAccessSites = userData.voiSettingAccessSites || [];
	const voiViewOnlyAccessSites = userData.voiViewOnlyAccessSites || [];
	const voiPrivateAccess = userData.voiPrivateAccess;
	const voiPrivateAccessSites = userData.voiPrivateAccessSites || [];
	const vehicleSearchAccess = userData.vehicleSearchAccess;
	const vehicleSearchAccessSites = userData.vehicleSearchAccessSites || [];
	const matchRateAlertAccess = userData.matchRateAlertAccess;
	const matchRateAlertAccessSites = userData.matchRateAlertAccessSites || [];
	const dashboardAccess = userData.dashboardAccess;
	const dashboardAccessSites = userData.dashboardAccessSites || [];
	const scheduledReportingAccess = userData.scheduledReportingAccess;
	const scheduledReportingAccessSites = userData.scheduledReportingAccessSites || [];
	const hasAccessToInsights = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites[0] !== "");
	const hasAccessToIqStats = userLoginType === "Admin" || 
		((userLoginType === "Retailer" || userLoginType === "Operator") && iqStatAccess && iqStatAccessSites.length > 0 && iqStatAccessSites[0] !== "") || 
		((userLoginType === "Retailer" || userLoginType === "Operator") && matchRateAlertAccess && matchRateAlertAccessSites.length > 0 && matchRateAlertAccessSites[0] !== "");
	const hasAccessToVRMCorrection = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && vrmCorrectionAccess && vrmCorrectionAccessSites.length > 0 && vrmCorrectionAccessSites[0] !== "");
	const hasVoiAccess = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && ((voiSettingAccess && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0] !== "") || (voiPrivateAccess && voiPrivateAccessSites.length > 0 && voiPrivateAccessSites[0] !== "") || (voiViewOnlyAccess && voiViewOnlyAccessSites.length > 0 && voiViewOnlyAccessSites[0] !== "") || (vehicleSearchAccess && vehicleSearchAccessSites.length > 0 && vehicleSearchAccessSites[0] !== "")));
	const hasAccessToDashboard = userLoginType === "Admin" || userLoginType === "Customer" || ((userLoginType === "Retailer" || userLoginType === "Operator") && dashboardAccess && dashboardAccessSites.length > 0 && dashboardAccessSites[0] !== "");
	const hasAccessToScheduledReporting = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && scheduledReportingAccess && scheduledReportingAccessSites.length > 0 && scheduledReportingAccessSites[0]);
    const iqVisionAccess = userData.iqVisionAccess;
	const iqVisionAccessSites = userData.iqVisionAccessSites || [];
	const hasAccesstoIqVision = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && iqVisionAccess && iqVisionAccessSites.length > 0 && iqVisionAccessSites[0] !== "");

	const hasAccess = (path === PATHS.INSIGHTS && hasAccessToInsights) || 
					(path === PATHS.IQ_STATS && hasAccessToIqStats) || 
					(path === PATHS.VRM_CORRECTION && hasAccessToVRMCorrection) || 
					(path === PATHS.VOI && hasVoiAccess) || 
					(path === PATHS.LIVE && hasAccessToDashboard) || 
					(path === PATHS.DASHBOARD && hasAccessToDashboard) || 
					(path === PATHS.REPORTS && (hasAccessToDashboard || hasAccessToScheduledReporting)) || 
					(path === PATHS.USERS && userLoginType !== 'Customer') || 
					(path === PATHS.SYSTEM_HEALTH && userLoginType === 'Admin') || 
					userLoginType === "Admin" ||
					(path === PATHS.EDIT_USER && userLoginType !== 'Customer') ||
					(path === PATHS.IQ_VISION && hasAccesstoIqVision) ;

	return (
		<Route
			path={path}
			exact={exact}
			{...rest}
			render={(props) => {
				if (!loading && Token.exists() && hasAccess) {
					return <Component {...rest} {...props} />;
				} else if (!loading && !Token.exists()) {
					return (
						<Redirect
							to={{
								pathname: "/login",
								state: {
									from: props.location
								}
							}}
						/>
					);
				} else if (!loading && !hasAccess) {
					return (
						<Redirect
							to={{
								pathname: "/login",
								state: {
									from: props.location
								}
							}}
						/>
					);
				} else if (loading) {
					return <Shell title="" subtitle=""></Shell>;
				}
			}}
		/>
	);
};

export default ProtectedRoute;
