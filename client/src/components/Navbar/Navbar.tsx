import ReportsIcon from "@material-ui/icons/Assessment";
import LiveIcon from "@material-ui/icons/BlurCircular";
import InsightsIcon from "@material-ui/icons/ControlCamera";
import DashboardIcon from "@material-ui/icons/Dashboard";
import React, { FC, useContext } from "react";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import { UserContext, AuthContext } from "../../context";
import { Flex } from "../Flex";
import { ProfileDropdown } from "../ProfileDropdown";
import { Tab } from "../Tab/Tab";
import VerifiedUserOutlined from "@material-ui/icons/VerifiedUserOutlined";
import LocalHospitalOutlinedIcon from '@material-ui/icons/LocalHospitalOutlined';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import AddAlertOutlinedIcon from '@material-ui/icons/AddAlertOutlined';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export const Navbar: FC = () => {
	const history = useHistory();
	const { pathname } = useLocation();
	const { adminLogo, operatorLogo, retailerLogo,customerLogo } = useContext(UserContext);
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const insightAccess = userData.insightAccess;
	const insightAccessSites = userData.insightAccessSites || [];
	const iqStatAccess = userData.iqStatAccess;
	const iqStatAccessSites = userData.iqStatAccessSites || [];
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
	const iqVisionAccess = userData.iqVisionAccess;
	const iqVisionAccessSites = userData.iqVisionAccessSites || [];
	const hasAccessToInsights = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites[0] !== "");
	const hasAccessToIqVision = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && iqVisionAccess && iqVisionAccessSites.length > 0 && iqVisionAccessSites[0] !== "");

	const hasAccessToIqStats = userLoginType === "Admin" || 
		((userLoginType === "Retailer" || userLoginType === "Operator") && iqStatAccess && iqStatAccessSites.length > 0 && iqStatAccessSites[0] !== "") || 
		((userLoginType === "Retailer" || userLoginType === "Operator") && matchRateAlertAccess && matchRateAlertAccessSites.length > 0 && matchRateAlertAccessSites[0] !== "");
	const hasAccessToVRMCorrection = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && vrmCorrectionAccess && vrmCorrectionAccessSites.length > 0 && vrmCorrectionAccessSites[0] !== "");
	const hasVoiAccess = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && ((voiSettingAccess && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0] !== "") ||
		(voiViewOnlyAccess && voiViewOnlyAccessSites.length > 0 && voiViewOnlyAccessSites[0] !== "") ||
		(voiPrivateAccess && voiPrivateAccessSites.length > 0 && voiPrivateAccessSites[0] !== "") ||
		(vehicleSearchAccess && vehicleSearchAccessSites.length > 0 && vehicleSearchAccessSites[0] !== "")));
	const hasAccessToDashboard = userLoginType === "Admin" || userLoginType === "Customer" || ((userLoginType === "Retailer" || userLoginType === "Operator") && dashboardAccess && dashboardAccessSites.length > 0 && dashboardAccessSites[0] !== "");
	const hasAccessToScheduledReporting = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && scheduledReportingAccess && scheduledReportingAccessSites.length > 0 && scheduledReportingAccessSites[0]);
	const iconStyle = { fontSize: isMobile ? 24 : 18, margin: isMobile ? "4px 0 8px 0" : "unset" };

	return (
		<div className="navbar">
			<div className="navbar__wrapper">
				<Flex direction="row" justify="space-between" className="navbar__container">
					<Flex justify="center" className="navbar__logo" align="center" onClick={() => history.push(PATHS.LIVE)}>
					{userLoginType==="Admin" && adminLogo && adminLogo !== "" && (
							<img src={`data:image/png;base64,${adminLogo}`} alt="" className="navbar__img" />
						)}
						{userLoginType==="Operator" && operatorLogo && operatorLogo !== "" && (
							<img src={`data:image/png;base64,${operatorLogo}`} alt="" className="navbar__img" />
						)}
						{userLoginType==="Retailer" &&retailerLogo && retailerLogo !== "" && retailerLogo !== "undefined" && (
							<img src={`data:image/png;base64,${retailerLogo}`} alt="" className="navbar__img" />
						)}
						{userLoginType==="Customer" && customerLogo && customerLogo !== "" && customerLogo !== "undefined" && (
							<img src={`data:image/png;base64,${customerLogo}`} alt="" className="navbar__img" />
						)}
					</Flex> 
					{isMobile && <ProfileDropdown />}
					<div className="navbar__tabs">
						<Flex className="navbar__tabs__nav-tabs">
							{hasAccessToDashboard && (
								<React.Fragment>
									<Tab
										id="live-tab"
										label={isMobile ? " " : "Live"}
										style={{ width: isMobile ? "25%" : "unset" }}
										beforeSlot={<LiveIcon style={iconStyle} />}
										onClick={() => {
											history?.push(PATHS.LIVE);
											const tab = document.getElementById("live-tab");
											tab?.blur();
										}}
										active={pathname === PATHS.LIVE}
									/>
									<Tab
										id="dashboard-tab"
										label={isMobile ? " " : "Dashboard"}
										style={{ width: isMobile ? "25%" : "unset" }}
										onClick={() => {
											history?.push(PATHS.DASHBOARD);
											const tab = document.getElementById("dashboard-tab");
											tab?.blur();
										}}
										beforeSlot={<DashboardIcon style={iconStyle} />}
										active={pathname === PATHS.DASHBOARD}
									/>
								</React.Fragment>
							)}
							{hasAccessToInsights && (
								<Tab
									id="insights-tab"
									label={isMobile ? " " : "Insights"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.INSIGHTS);
										const tab = document.getElementById("insights-tab");
										tab?.blur();
									}}
									afterSlot={isMobile ? undefined : <div className="navbar__tabs__tag">Beta</div>}
									beforeSlot={<InsightsIcon style={iconStyle} />}
									active={pathname === PATHS.INSIGHTS}
								/>
							)}
							{(hasAccessToDashboard || hasAccessToScheduledReporting) && (
								<Tab
									id="reports-tab"
									label={isMobile ? " " : "Reports"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.REPORTS);
										const tab = document.getElementById("reports-tab");
										tab?.blur();
									}}
									beforeSlot={<ReportsIcon style={iconStyle} />}
									active={pathname === PATHS.REPORTS}
								/>
							)}
							{hasAccessToIqStats && (
								<Tab
									id="iqStat-tab"
									label={isMobile ? " " : "IQ Stats"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.IQ_STATS);
										const tab = document.getElementById("iqStat-tab");
										tab?.blur();
									}}
									beforeSlot={<TrendingUpOutlinedIcon style={iconStyle} />}
									active={pathname === PATHS.IQ_STATS}
								/>
							)}
							{hasAccessToVRMCorrection && (
								<Tab
									id="vrmCorrection-tab"
									label={isMobile ? " " : "VRM Correction"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.VRM_CORRECTION);
										const tab = document.getElementById("vrmCorrection-tab");
										tab?.blur();
									}}
									beforeSlot={<BuildOutlinedIcon style={iconStyle}/>}
									
									active={pathname === PATHS.VRM_CORRECTION}
								/>
							)}
							{hasVoiAccess && (
								<Tab
									id="voi-tab"
									label={isMobile ? " " : "VOI"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.VOI);
										const tab = document.getElementById("voi-tab");
										tab?.blur();
									}}
									beforeSlot={<AddAlertOutlinedIcon style={iconStyle} />}
									active={pathname === PATHS.VOI}
								/>
							)}
							{userLoginType !== 'Customer' && (
								<Tab
									id="users-tab"
									label={isMobile ? " " : "Admin"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.USERS);
										const tab = document.getElementById("users-tab");
										tab?.blur();
									}}
									beforeSlot={<VerifiedUserOutlined style={iconStyle} />}
									active={pathname === PATHS.USERS}
								/>
							)}
							{
								userLoginType === "Admin" ?
									<Tab
										id="system-health-tab"
										label={isMobile ? " " : "System Health"}
										style={{ width: isMobile ? "25%" : "unset" }}
										onClick={() => {
											history?.push(PATHS.SYSTEM_HEALTH);
											const tab = document.getElementById("system-health-tab");
											tab?.blur();
										}}
										beforeSlot={<LocalHospitalOutlinedIcon style={iconStyle} />}
										active={pathname === PATHS.SYSTEM_HEALTH}
									/>
									: ""
							}
							{/* {
								hasAccessToIqVision ?
							    <Tab
									id="iqVision-tab"
									label={isMobile ? " " : "IQ Vision"}
									style={{ width: isMobile ? "25%" : "unset" }}
									onClick={() => {
										history?.push(PATHS.IQ_VISION);
										const tab = document.getElementById("iqVision-tab");
										tab?.blur();
									}}
									afterSlot={isMobile ? undefined : <div className="navbar__tabs__tag">Beta</div>}
									beforeSlot={<RemoveRedEyeIcon style={iconStyle} />}
									active={pathname === PATHS.IQ_VISION}
								/> :""
                            } */}
						</Flex>
						<hr className="navbar__divider" style={{ marginRight: 16, marginLeft: 11 }} />
						{!isMobile && <ProfileDropdown />}
					</div>
				</Flex>
			</div>
		</div>
	);
};
