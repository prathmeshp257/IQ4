import React, { FC } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { Formatter } from "../../utils";

interface UserDetailsProps {
	formik: any;
	userType: string;
	userLoginType: string;
	setStep: any;
	hasInsightAccess: boolean;
	hasSiteInfoAccess: boolean;
	hasOccupancyProAccess: boolean;
	hasOccupancy24hAccess: boolean;
	hasOccupancyTableAccess: boolean;
	hasVrmCorrectionAccess: boolean;
	hasForwardsAccess: boolean;
	hasIqStatAccess: boolean;
	hasGoNeutralAccess: boolean;
	hasVoiSettingAccess: boolean;
	hasVoiPrivateAccess: boolean;
	hasVoiViewOnlyAccess: boolean;
	hasVoiSMSNotifyAccess: boolean;
	hasVehicleSearchAccess: boolean;
	hasVehicleSearchInsightAccess: boolean;
	hasVrmValidatorAccess: boolean;
	hasScheduledReportingAccess: boolean;
	hasBasicOccupancyAccess: boolean;
	hasMatchRateAlertAccess: boolean;
	hasExcludeVrmAccess: boolean;
	permitableInsightSites: any[];
	permitableSiteInfoSites: any[];
	permitableOccupancyProSites: any[];
	permitableOccupancy24hSites: any[];
	permitableOccupancyTableSites: any[];
	permitableVrmCorrectionSites: any[];
	permitableForwardsSites: any[];
	permitableIqStatSites: any[];
	permitableVrmValidatorSites: any[];
	permitableGoNeutralSites: any[];
	permitableVoiSettingSites: any[];
	permitableVoiPrivateSites: any[];
	permitableVoiViewOnlySites: any[];
	permitableVoiSMSNotifySites: any[];
	permitableVehicleSearchSites: any[];
	permitableVehicleSearchInsightSites: any[];
	permitableScheduledReportingSites: any[];
	permitableBasicOccupancySites: any[];
	permitableMatchRateAlertSites: any[];
	permitableExcludeVrmSites: any[];
	setInsightSites: any;
	setSiteInfoSites: any;
	siteInfoSites: any[];
	setOccupancyProSites: any;
	occupancyProSites: any[];
	setOccupancy24hSites: any;
	occupancy24hSites: any[];
	setOccupancyTableSites: any;
	occupancyTableSites: any[];
	setVrmCorrectionSites: any;
	vrmCorrectionSites: any[];
	setForwardsSites: any;
	forwardsSites: any[];
	insightSites: any[];
	iqStatSites: any[];
	setIqStatSites: any;
	vrmValidatorSites: any[];
	setVrmValidatorSites: any;
	goNeutralSites: any[];
	setGoNeutralSites: any;
	voiSettingSites: any[];
	setVOISettingSites: any;
	voiPrivateSites: any[];
	setVOIPrivateSites: any;
	pDCalculatorSites: any[];
	setPDCalculatorSites: any;
	voiViewOnlySites: any[];
	setVOIViewOnlySites: any;
	voiSMSNotifySites: any[];
	setVOISMSNotifySites: any;
	scheduledReportingSites: any[];
	setScheduledReportingSites: any;
	vehicleSearchSites: any[];
	setVehicleSearchSites: any;
	vehicleSearchInsightSites: any[];
	setVehicleSearchInsightSites: any;
	basicOccupancySites: any[];
	setBasicOccupancySites: any;
	matchRateAlertSites: any[];
	setMatchRateAlertSites: any;
	excludeVrmSites: any[];
	setExcludeVrmSites: any;
	cancel: any;
	hasDashboardAccess: any;
	permitableDashboardSites: any[];
	dashboardSites: any[];
	setDashboardSites: any;
	hasPDCalculatorAccess: boolean;
	permitablePDCalculatorSites: any[];
	hasIqVisionAccess: boolean;
	permitableIqVisionSites: any[];
	iqVisionSites: any[];
	setIqVisionSites: any;




}

const Label = styled.label`
	font-size: 12px;
	display: flex;
	margin-bottom: 4px;
	color: ${colors.darkGray};
`;

const Error = styled.label`
	font-size: 12px;
	color: red;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
`;

export const Features: FC<UserDetailsProps> = ({
	formik,
	userType,
	userLoginType,
	setStep,
	hasInsightAccess,
	hasSiteInfoAccess,
	hasOccupancyProAccess,
	hasOccupancy24hAccess,
	hasOccupancyTableAccess,
	hasVrmCorrectionAccess,
	hasForwardsAccess,
	hasIqStatAccess,
	hasGoNeutralAccess,
	hasVoiSettingAccess,
	hasVoiPrivateAccess,
	hasPDCalculatorAccess,
	hasVoiViewOnlyAccess,
	hasVoiSMSNotifyAccess,
	hasVehicleSearchAccess,
	hasVehicleSearchInsightAccess,
	hasVrmValidatorAccess,
	hasScheduledReportingAccess,
	hasBasicOccupancyAccess,
	hasMatchRateAlertAccess,
	permitableInsightSites,
	permitableSiteInfoSites,
	permitableOccupancyProSites,
	permitableOccupancy24hSites,
	permitableOccupancyTableSites,
	permitableVrmCorrectionSites,
	permitableForwardsSites,
	permitableIqStatSites,
	permitableVrmValidatorSites,
	permitableGoNeutralSites,
	permitableVoiSettingSites,
	permitableVoiPrivateSites,
	permitableVoiViewOnlySites,
	permitableVoiSMSNotifySites,
	permitableVehicleSearchSites,
	permitableVehicleSearchInsightSites,
	permitableScheduledReportingSites,
	permitableBasicOccupancySites,
	permitablePDCalculatorSites,
	permitableMatchRateAlertSites,
	insightSites,
	setInsightSites,
	setSiteInfoSites,
	siteInfoSites,
	setOccupancyProSites,
	occupancyProSites,
	setOccupancy24hSites,
	occupancy24hSites,
	setOccupancyTableSites,
	occupancyTableSites,
	setVrmCorrectionSites,
	vrmCorrectionSites,
	setForwardsSites,
	forwardsSites,
	iqStatSites,
	setIqStatSites,
	vrmValidatorSites,
	setVrmValidatorSites,
	goNeutralSites,
	setGoNeutralSites,
	voiSettingSites,
	setVOISettingSites,
	voiPrivateSites,
	setVOIPrivateSites,
	pDCalculatorSites,
	setPDCalculatorSites,
	voiViewOnlySites,
	setVOIViewOnlySites,
	voiSMSNotifySites,
	setVOISMSNotifySites,
	scheduledReportingSites,
	setScheduledReportingSites,
	vehicleSearchSites,
	setVehicleSearchSites,
	vehicleSearchInsightSites,
	setVehicleSearchInsightSites,
	basicOccupancySites,
	setBasicOccupancySites,
	matchRateAlertSites,
	setMatchRateAlertSites,
	cancel,
	hasExcludeVrmAccess, permitableExcludeVrmSites, excludeVrmSites, setExcludeVrmSites, hasDashboardAccess, permitableDashboardSites, dashboardSites, setDashboardSites,
	hasIqVisionAccess,
	permitableIqVisionSites,
	iqVisionSites,
	setIqVisionSites


}) => {
	const featuresAvailable = (hasInsightAccess && permitableInsightSites[0]) || (hasIqStatAccess && permitableIqStatSites[0]) || (hasGoNeutralAccess && permitableGoNeutralSites[0]) ||
		(hasVoiSettingAccess && permitableVoiSettingSites[0]) || (hasVoiPrivateAccess && permitableVoiPrivateSites[0]) || (hasVoiViewOnlyAccess && permitableVoiViewOnlySites[0]) || (hasVoiSMSNotifyAccess && permitableVoiSMSNotifySites[0]) ||
		(hasVehicleSearchAccess && permitableVehicleSearchSites[0]) || (hasVehicleSearchInsightAccess && permitableVehicleSearchInsightSites[0]) || (hasVrmValidatorAccess && permitableVrmValidatorSites[0]) ||
		(hasScheduledReportingAccess && permitableScheduledReportingSites[0]) || (hasBasicOccupancyAccess && permitableBasicOccupancySites[0]) || (hasMatchRateAlertAccess && permitableMatchRateAlertSites[0]) ||
		(hasExcludeVrmAccess && permitableExcludeVrmSites[0]) || (hasDashboardAccess && permitableDashboardSites[0]) || (hasOccupancyProAccess && permitableOccupancyProSites[0]) ||
		(hasOccupancy24hAccess && permitableOccupancy24hSites[0]) || (hasOccupancyTableAccess && permitableOccupancyTableSites[0]) || (hasSiteInfoAccess && permitableSiteInfoSites[0]) ||
		(hasVrmCorrectionAccess && permitableVrmCorrectionSites[0]) || (hasForwardsAccess && permitableForwardsSites[0]) || (hasPDCalculatorAccess && permitablePDCalculatorSites[0]) || (hasIqVisionAccess && permitableIqVisionSites[0]) ;

	return (
		<div style={{ padding: 0, margin: 0 }} >
			<hr />
			<h2 style={{ textAlign: 'center' }}>Features</h2>
			{
				!featuresAvailable ?
					<div className="emptyMessage">No features are available for selected sites</div>
					:
					<Flex direction="row" justify="space-between" wrap="wrap" >

						{
							hasForwardsAccess && (userType === 'Retailer' || userType === 'Operator') && permitableForwardsSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Forwards Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setForwardsSites([]);
											formik.setFieldValue("forwardsAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.forwardsAccess !== "true"} name="forwardsAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.forwardsAccess === "true"} name="forwardsAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>

								<div className="--margin-bottom-large">
									<Label>Forwards Access Sites</Label>
									<MultiSelect
										disabled={formik.values.forwardsAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableForwardsSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={forwardsSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setForwardsSites(normalizedSites);
											formik.setFieldValue("forwardsAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.forwardsAccessSites && formik.errors.forwardsAccessSites && (
										<Error>{formik.touched.forwardsAccessSites && formik.errors.forwardsAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}

						{
							hasVrmCorrectionAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVrmCorrectionSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>VRM Correction Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVrmCorrectionSites([]);
											formik.setFieldValue("vrmCorrectionAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.vrmCorrectionAccess !== "true"} name="vrmCorrectionAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.vrmCorrectionAccess === "true"} name="vrmCorrectionAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>

								<div className="--margin-bottom-large">
									<Label>VRM Correction Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.vrmCorrectionAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVrmCorrectionSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={vrmCorrectionSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVrmCorrectionSites(normalizedSites);
											formik.setFieldValue("vrmCorrectionAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.vrmCorrectionAccessSites && formik.errors.vrmCorrectionAccessSites && (
										<Error>{formik.touched.vrmCorrectionAccessSites && formik.errors.vrmCorrectionAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasSiteInfoAccess && (userType === 'Retailer' || userType === 'Operator') && permitableSiteInfoSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Site Info Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setSiteInfoSites([]);
											formik.setFieldValue("siteInfoAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.siteInfoAccess !== "true"} name="siteInfoAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.siteInfoAccess === "true"} name="siteInfoAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Site Info Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.siteInfoAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableSiteInfoSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={siteInfoSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setSiteInfoSites(normalizedSites);
											formik.setFieldValue("siteInfoAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.siteInfoAccessSites && formik.errors.siteInfoAccessSites && (
										<Error>{formik.touched.siteInfoAccessSites && formik.errors.siteInfoAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasInsightAccess && (userType === 'Retailer' || userType === 'Operator') && permitableInsightSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Insight Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setInsightSites([]);
											formik.setFieldValue("insightAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.insightAccess !== "true"} name="insightAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.insightAccess === "true"} name="insightAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Insight Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.insightAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableInsightSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={insightSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setInsightSites(normalizedSites);
											formik.setFieldValue("insightAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.insightAccessSites && formik.errors.insightAccessSites && (
										<Error>{formik.touched.insightAccessSites && formik.errors.insightAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasGoNeutralAccess && (userType === 'Retailer' || userType === 'Operator') && permitableGoNeutralSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Go Neutral Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setGoNeutralSites([]);
											formik.setFieldValue("goNeutralAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.goNeutralAccess !== "true"} name="goNeutralAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.goNeutralAccess === "true"} name="goNeutralAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Go Neutral Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.goNeutralAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableGoNeutralSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={goNeutralSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setGoNeutralSites(normalizedSites);
											formik.setFieldValue("goNeutralAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.goNeutralAccessSites && formik.errors.goNeutralAccessSites && (
										<Error>{formik.touched.goNeutralAccessSites && formik.errors.goNeutralAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVoiSettingAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVoiSettingSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>VOI Setting Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVOISettingSites([]);
											setVOISMSNotifySites([]);
											formik.setFieldValue("voiSettingAccessSites", []);
											formik.setFieldValue("voiSMSNotifyAccess", 'false');
											formik.setFieldValue("voiSMSNotifyAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.voiSettingAccess !== "true"} name="voiSettingAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.voiSettingAccess === "true"} name="voiSettingAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>VOI Setting Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.voiSettingAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVoiSettingSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={voiSettingSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVOISettingSites(normalizedSites);
											formik.setFieldValue("voiSettingAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.voiSettingAccessSites && formik.errors.voiSettingAccessSites && (
										<Error>{formik.touched.voiSettingAccessSites && formik.errors.voiSettingAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVoiViewOnlyAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVoiViewOnlySites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>VOI View Only Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVOIViewOnlySites([]);
											formik.setFieldValue("voiViewOnlyAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.voiViewOnlyAccess !== "true"} name="voiViewOnlyAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.voiViewOnlyAccess === "true"} name="voiViewOnlyAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>VOI View Only Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.voiViewOnlyAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVoiViewOnlySites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={voiViewOnlySites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVOIViewOnlySites(normalizedSites);
											formik.setFieldValue("voiViewOnlyAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.voiViewOnlyAccessSites && formik.errors.voiViewOnlyAccessSites && (
										<Error>{formik.touched.voiViewOnlyAccessSites && formik.errors.voiViewOnlyAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVoiSMSNotifyAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVoiSMSNotifySites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>VOI SMS Notify Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVOISMSNotifySites([]);
											formik.setFieldValue("voiSMSNotifyAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.voiSMSNotifyAccess !== "true"} name="voiSMSNotifyAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.voiSMSNotifyAccess === "true"} name="voiSMSNotifyAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>VOI SMS Notify Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.voiSMSNotifyAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVoiSMSNotifySites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={voiSMSNotifySites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVOISMSNotifySites(normalizedSites);
											formik.setFieldValue("voiSMSNotifyAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.voiSMSNotifyAccessSites && formik.errors.voiSMSNotifyAccessSites && (
										<Error>{formik.touched.voiSMSNotifyAccessSites && formik.errors.voiSMSNotifyAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVoiPrivateAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVoiPrivateSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Private VOI Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVOIPrivateSites([]);
											formik.setFieldValue("voiPrivateAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.voiPrivateAccess !== "true"} name="voiPrivateAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.voiPrivateAccess === "true"} name="voiPrivateAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Private VOI Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.voiPrivateAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVoiPrivateSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={voiPrivateSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVOIPrivateSites(normalizedSites);
											formik.setFieldValue("voiPrivateAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.voiPrivateAccessSites && formik.errors.voiPrivateAccessSites && (
										<Error>{formik.touched.voiPrivateAccessSites && formik.errors.voiPrivateAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasIqStatAccess && (userType === 'Retailer' || userType === 'Operator') && permitableIqStatSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>IQ Stat Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setIqStatSites([]);
											formik.setFieldValue("iqStatAccessSites", []);
											formik.setFieldValue("vrmValidator", 'false');
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.iqStatAccess !== "true"} name="iqStatAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.iqStatAccess === "true"} name="iqStatAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>IQ Stat Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.iqStatAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableIqStatSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={iqStatSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setIqStatSites(normalizedSites);
											formik.setFieldValue("iqStatAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.iqStatAccessSites && formik.errors.iqStatAccessSites && (
										<Error>{formik.touched.iqStatAccessSites && formik.errors.iqStatAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVrmValidatorAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVrmValidatorSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>VRM Validator</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVrmValidatorSites([]);
											formik.setFieldValue("vrmValidatorSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.vrmValidator !== "true"} name="vrmValidator" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.vrmValidator === "true"} name="vrmValidator" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>VRM Validator Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.vrmValidator !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVrmValidatorSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={vrmValidatorSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVrmValidatorSites(normalizedSites);
											formik.setFieldValue("vrmValidatorSites", normalizedSites)
										}}
									/>
									{formik.touched.vrmValidatorSites && formik.errors.vrmValidatorSites && (
										<Error>{formik.touched.vrmValidatorSites && formik.errors.vrmValidatorSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVehicleSearchAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVehicleSearchSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Vehicle Search Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVehicleSearchSites([]);
											formik.setFieldValue("vehicleSearchAccessSites", []);
											formik.setFieldValue("vehicleSearchInsightAccess", 'false');
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.vehicleSearchAccess !== "true"} name="vehicleSearchAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.vehicleSearchAccess === "true"} name="vehicleSearchAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Vehicle Search Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.vehicleSearchAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVehicleSearchSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={vehicleSearchSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVehicleSearchSites(normalizedSites);
											formik.setFieldValue("vehicleSearchAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.vehicleSearchAccessSites && formik.errors.vehicleSearchAccessSites && (
										<Error>{formik.touched.vehicleSearchAccessSites && formik.errors.vehicleSearchAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasVehicleSearchInsightAccess && (userType === 'Retailer' || userType === 'Operator') && permitableVehicleSearchInsightSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Vehicle Search Insight Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setVehicleSearchInsightSites([]);
											formik.setFieldValue("vehicleSearchInsightAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.vehicleSearchInsightAccess !== "true"} name="vehicleSearchInsightAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.vehicleSearchInsightAccess === "true"} name="vehicleSearchInsightAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Vehicle Search Insight Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.vehicleSearchInsightAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableVehicleSearchInsightSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={vehicleSearchInsightSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setVehicleSearchInsightSites(normalizedSites);
											formik.setFieldValue("vehicleSearchInsightAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.vehicleSearchInsightAccessSites && formik.errors.vehicleSearchInsightAccessSites && (
										<Error>{formik.touched.vehicleSearchInsightAccessSites && formik.errors.vehicleSearchInsightAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasBasicOccupancyAccess && (userType === 'Retailer' || userType === 'Operator') && permitableBasicOccupancySites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Basic Occupancy Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setBasicOccupancySites([]);
											formik.setFieldValue("basicOccupancyAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.basicOccupancyAccess !== "true"} name="basicOccupancyAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.basicOccupancyAccess === "true"} name="basicOccupancyAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Basic Occupancy Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.basicOccupancyAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableBasicOccupancySites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={basicOccupancySites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setBasicOccupancySites(normalizedSites);
											formik.setFieldValue("basicOccupancyAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.basicOccupancyAccessSites && formik.errors.basicOccupancyAccessSites && (
										<Error>{formik.touched.basicOccupancyAccessSites && formik.errors.basicOccupancyAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasOccupancyProAccess && (userType === 'Retailer' || userType === 'Operator') && permitableOccupancyProSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Occupancy Pro Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setOccupancyProSites([]);
											formik.setFieldValue("occupancyProAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.occupancyProAccess !== "true"} name="occupancyProAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.occupancyProAccess === "true"} name="occupancyProAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Occupancy Pro Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.occupancyProAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableOccupancyProSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={occupancyProSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setOccupancyProSites(normalizedSites);
											formik.setFieldValue("occupancyProAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.occupancyProAccessSites && formik.errors.occupancyProAccessSites && (
										<Error>{formik.touched.occupancyProAccessSites && formik.errors.occupancyProAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}

						{
							hasOccupancy24hAccess && (userType === 'Retailer' || userType === 'Operator') && permitableOccupancy24hSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Occupancy 24h Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setOccupancy24hSites([]);
											formik.setFieldValue("occupancy24hAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.occupancy24hAccess !== "true"} name="occupancy24hAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.occupancy24hAccess === "true"} name="occupancy24hAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Occupancy 24h Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.occupancy24hAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableOccupancy24hSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={occupancy24hSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setOccupancy24hSites(normalizedSites);
											formik.setFieldValue("occupancy24hAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.occupancy24hAccessSites && formik.errors.occupancy24hAccessSites && (
										<Error>{formik.touched.occupancy24hAccessSites && formik.errors.occupancy24hAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}


						{
							hasMatchRateAlertAccess && (userType === 'Retailer' || userType === 'Operator') && permitableMatchRateAlertSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Match Rate Alert Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setMatchRateAlertSites([]);
											formik.setFieldValue("matchRateAlertAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.matchRateAlertAccess !== "true"} name="matchRateAlertAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.matchRateAlertAccess === "true"} name="matchRateAlertAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Match Rate Alert Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.matchRateAlertAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableMatchRateAlertSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={matchRateAlertSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setMatchRateAlertSites(normalizedSites);
											formik.setFieldValue("matchRateAlertAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.matchRateAlertAccessSites && formik.errors.matchRateAlertAccessSites && (
										<Error>{formik.touched.matchRateAlertAccessSites && formik.errors.matchRateAlertAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasExcludeVrmAccess && (userType === 'Retailer' || userType === 'Operator') && permitableExcludeVrmSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Remove VRM's From Stats Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setExcludeVrmSites([]);
											formik.setFieldValue("excludeVrmAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.excludeVrmAccess !== "true"} name="excludeVrmAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.excludeVrmAccess === "true"} name="excludeVrmAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Remove VRM's From Stats Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.excludeVrmAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableExcludeVrmSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={excludeVrmSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setExcludeVrmSites(normalizedSites);
											formik.setFieldValue("excludeVrmAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.excludeVrmAccessSites && formik.errors.excludeVrmAccessSites && (
										<Error>{formik.touched.excludeVrmAccessSites && formik.errors.excludeVrmAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasDashboardAccess && (userType === 'Retailer' || userType === 'Operator') && permitableDashboardSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Dashboard Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setDashboardSites([]);
											formik.setFieldValue("dashboardAccessSites", []);
											formik.setFieldValue("occupancyTableAccess", 'false');
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.dashboardAccess !== "true"} name="dashboardAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.dashboardAccess === "true"} name="dashboardAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Dashboard Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.dashboardAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableDashboardSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={dashboardSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setDashboardSites(normalizedSites);
											formik.setFieldValue("dashboardAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.dashboardAccessSites && formik.errors.dashboardAccessSites && (
										<Error>{formik.touched.dashboardAccessSites && formik.errors.dashboardAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}

						{
							hasOccupancyTableAccess && (userType === 'Retailer' || userType === 'Operator') && permitableOccupancyTableSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Occupancy Table Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setOccupancyTableSites([]);
											formik.setFieldValue("occupancyTableAccessSites", []);

											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.occupancyTableAccess !== "true"} name="occupancyTableAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.occupancyTableAccess === "true"} name="occupancyTableAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Occupancy Table Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.occupancyTableAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableOccupancyTableSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={occupancyTableSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setOccupancyTableSites(normalizedSites);
											formik.setFieldValue("occupancyTableAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.occupancyTableAccessSites && formik.errors.occupancyTableAccessSites && (
										<Error>{formik.touched.occupancyTableAccessSites && formik.errors.occupancyTableAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						{
							hasScheduledReportingAccess && (userType === 'Retailer' || userType === 'Operator') && permitableScheduledReportingSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Scheduled Reporting Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setScheduledReportingSites([]);
											formik.setFieldValue("scheduledReportingAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.scheduledReportingAccess !== "true"} name="scheduledReportingAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.scheduledReportingAccess === "true"} name="scheduledReportingAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Scheduled Reporting Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.scheduledReportingAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableScheduledReportingSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={scheduledReportingSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setScheduledReportingSites(normalizedSites);
											formik.setFieldValue("scheduledReportingAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.scheduledReportingAccessSites && formik.errors.scheduledReportingAccessSites && (
										<Error>{formik.touched.scheduledReportingAccessSites && formik.errors.scheduledReportingAccessSites}</Error>
									)}
								</div>
							</React.Fragment>

						}
						{
							hasPDCalculatorAccess && (userType === 'Retailer' || userType === 'Operator') && permitablePDCalculatorSites.length > 0  && 
                            <React.Fragment>
							<div className="--margin-bottom-large">
								<Label>P & D Calculator Access</Label>
								<div className="feature" role="group"
									onChange={(e: any) => {
										setPDCalculatorSites([]);
										formik.setFieldValue("pDCalculatorAccessSites", []);
										formik.handleChange(e);
									}}
								>
									<label style={{ cursor: "pointer" }}>
										<input type="radio" checked={formik.values.pDCalculatorAccess !== "true"} name="pDCalculatorAccess" value="false" id="false" style={{ marginRight: "5px" }} />
										FALSE
									</label>
									<label style={{ cursor: "pointer" }}>
										<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.pDCalculatorAccess === "true"} name="pDCalculatorAccess" value="true" id="true" />
										TRUE
									</label>
								</div>
							</div>
							<div className="--margin-bottom-large">
								<Label>P & D Calculator Access Sites</Label>
								<MultiSelect
									place="popUp"
									disabled={formik.values.pDCalculatorAccess !== "true"}
									style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
									options={permitablePDCalculatorSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
									values={pDCalculatorSites}
									onChange={async (values) => {
										const normalizedSites = Formatter.normalizeSites(values);
										await setPDCalculatorSites(normalizedSites);
										formik.setFieldValue("pDCalculatorAccessSites", normalizedSites)
									}}
								/>
								{/* {formik.touched.scheduledReportingAccessSites && formik.errors.scheduledReportingAccessSites && (
									<Error>{formik.touched.scheduledReportingAccessSites && formik.errors.scheduledReportingAccessSites}</Error>
								)} */}
							</div>
						</React.Fragment>
						}
						{
							hasIqVisionAccess && (userType === 'Retailer' || userType === 'Operator') && permitableIqVisionSites.length > 0 &&
							<React.Fragment>
								<div className="--margin-bottom-large">
									<Label>Iq Vision Access</Label>
									<div className="feature" role="group"
										onChange={(e: any) => {
											setIqVisionSites([]);
											formik.setFieldValue("iqVisionAccessSites", []);
											formik.handleChange(e);
										}}
									>
										<label style={{ cursor: "pointer" }}>
											<input type="radio" checked={formik.values.iqVisionAccess !== "true"} name="iqVisionAccess" value="false" id="false" style={{ marginRight: "5px" }} />
											FALSE
										</label>
										<label style={{ cursor: "pointer" }}>
											<input style={{ marginLeft: "50px", marginRight: "5px" }} type="radio" checked={formik.values.iqVisionAccess === "true"} name="iqVisionAccess" value="true" id="true" />
											TRUE
										</label>
									</div>
								</div>
								<div className="--margin-bottom-large">
									<Label>Insight Access Sites</Label>
									<MultiSelect
										place="popUp"
										disabled={formik.values.iqVisionAccess !== "true"}
										style={{ width: `${isMobile ? "260px" : "285px"}`, height: '44px' }}
										options={permitableIqVisionSites.map((site: string) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) }))}
										values={iqVisionSites}
										onChange={async (values) => {
											const normalizedSites = Formatter.normalizeSites(values);
											await setIqVisionSites(normalizedSites);
											formik.setFieldValue("iqVisionAccessSites", normalizedSites)
										}}
									/>
									{formik.touched.iqVisionAccessSites && formik.errors.iqVisionAccessSites && (
										<Error>{formik.touched.iqVisionAccessSites && formik.errors.iqVisionAccessSites}</Error>
									)}
								</div>
							</React.Fragment>
						}
						
					</Flex>
			}
			<Flex direction="row" justify="end" wrap="wrap" >
				<Button text="Previous" className="userButton" onClick={() => setStep(1)} color='secondary' />
				<Button text="Cancel" className="userButton" onClick={() => cancel()} color='secondary' />
				<Button text="Submit" className="userButton" type="submit" loading={formik.isSubmitting} />
			</Flex>
		</div>
	)
}
