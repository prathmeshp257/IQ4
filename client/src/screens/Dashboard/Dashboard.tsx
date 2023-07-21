import BarChartIcon from "@material-ui/icons/Equalizer";
import OverlayIcon from "@material-ui/icons/GraphicEq";
import LoadIcon from "@material-ui/icons/Search";
import LineChartIcon from "@material-ui/icons/Timeline";
import DetachIcon from "@material-ui/icons/ViewHeadline";
import { Switch } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useSnackbar } from "notistack";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { Button, CardWithTabs, Divider, Flex, MultiSelect } from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { PATHS } from "../../constants";
import { Shell } from "../../containers";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { DashboardGraph } from "../../graphs/DashboardGraph";
import { DashboardData } from "../../types";
import { Formatter } from "../../utils";
import {OccupancyTable} from './OccupancyTable'

dayjs.extend(isoWeek);
interface OverlayedData {
	"1d"?: any;
	"1w"?: any;
	wtd?: any;
	"1m"?: any;
	mtd?: any;
	"occupancyTable"?:any;
}


export type ZoomType = "1d" | "1w" | "wtd" | "1m" | "mtd" | "occupancyTable";

const DATE_FORMAT = "DD MMMM";

export const Dashboard: FC = () => {
	const { sites = [], email } = useContext(UserContext);
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const localDashboardSites = localStorage.getItem("dashboard-selected-sites");
	const localSelectedSites = (localDashboardSites && localDashboardSites.split(",")) || [];

	const sessionChartType = (sessionStorage.getItem("dashboard-chart-type") || "line") as "bar" | "line";

	const { enqueueSnackbar } = useSnackbar();

	const source = axios.CancelToken.source();

	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [shouldSearch, setShouldSearch] = useState(true);

	const [zoomLevel, setZoomLevel] = useState<ZoomType>("1d");

	const [selectedSites, setSelectedSites] = useState<string[]>(localSelectedSites);
	const [selectableSites, setSelectableSites] = useState<string[]>(sites);
	const [overlayedData, setOverlayedData] = useState<OverlayedData>();

	const [graphType, setGraphType] = useState(sessionChartType);
	const [overviewGraphType, setOverviewGraphType] = useState<string>("Occupancy");
	const [isOverlayed, setIsOverlayed] = useState(true);
	const [date, setDate] = useState(dayjs().format(DATE_FORMAT));

	const getData = async (zoom: ZoomType) => {
		setLoading(true);

		try {
			let accessSites = Formatter.normalizeSites(selectedSites.sort());
			if(userData.userType !== 'Admin'){
				for(const eachSite of selectedSites){
					const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
					if(foundSite[0] && foundSite[0].contractExpired){
						accessSites = accessSites.filter((val: any) => val !== eachSite)
					}
				}
			}
			const normalizedSites = accessSites;
			const localData = sessionStorage.getItem(`dashboard-${selectedSites.join()}-${zoom}`);

			if (!localData || shouldSearch === true) {
				const dashboarZoomReq = axios.get(`/api/dashboard?zoom=${zoom}&sites=${normalizedSites}&userType=${userData.userType}&email=${userData.email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") },
					cancelToken: source.token
				});

				const dashboardDiffReq = axios.get(`/api/dashboard/diff?sites=${normalizedSites}&userType=${userData.userType}&email=${userData.email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") },
					cancelToken: source.token
				});

				const [{ data: zoomData }, { data: diffData }] = await Promise.all([dashboarZoomReq, dashboardDiffReq]);

				const allSiteNames = Object.values(zoomData).map((data) => (data as DashboardData).site);
				const allOccupancy = Object.values(zoomData).map((data) => (data as DashboardData).occupancy);
				const allDwell = Object.values(zoomData).map((data) => (data as DashboardData).dwell);
				const allHistoric = Object.values(zoomData).map((data) => (data as DashboardData).historic);
				const allVisits = Object.values(zoomData).map((data) => (data as DashboardData).visits);
				const allRepeatTime = Object.values(zoomData).map((data) => (data as DashboardData).repeatTime);
				const allRepeatFrequency = Object.values(zoomData).map((data) => (data as DashboardData).repeatFrequency);
				const allDwellByHour = Object.values(zoomData).map((data) => (data as DashboardData).dwellByHour);

				const zoomFormatted = {
					sites: allSiteNames,
					occupancy: allOccupancy,
					dwell: allDwell,
					visits: allVisits,
					historic: allHistoric,
					diff: diffData.all,
					repeatTime: allRepeatTime,
					repeatFrequency: allRepeatFrequency,
					dwellByHour: allDwellByHour
				};

				sessionStorage.setItem(
					`dashboard-${selectedSites.join()}-${zoom}`,
					JSON.stringify({ ...overlayedData, [zoom]: zoomFormatted })
				);

				setOverlayedData({ ...overlayedData, [zoom]: zoomFormatted });
			} else {
				const parsedLocalData = JSON.parse(String(localData));
				setOverlayedData(parsedLocalData);
			}
		} catch (e:any) {
			if (!axios.isCancel(e)) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
			}

			if (e.response && e.response.status === 401) {
				history.replace(PATHS.LOGIN);
			}
		}

		setLoading(false);
		setShouldSearch(false);
	};

	useEffect(() => {
		if ((selectedSites && selectedSites?.length >= 1 && shouldSearch) && zoomLevel!=="occupancyTable"  ) {
			getData(zoomLevel);
		}
		// eslint-disable-next-line
	}, [selectedSites, shouldSearch, zoomLevel]);

	useEffect(() => {
		const tday = dayjs().format(DATE_FORMAT);
		if (zoomLevel === "1d") {
			setDate(`${tday}`);
		} else if (zoomLevel === "wtd") {
			const wtd = dayjs().startOf("isoWeek").format(DATE_FORMAT);
			setDate(`${wtd} - ${tday}`);
		} else if (zoomLevel === "1w") {
			const wago = dayjs().subtract(1, "week").format(DATE_FORMAT);
			setDate(`${wago} - ${tday}`);
		} else if (zoomLevel === "mtd") {
			const mtd = dayjs().startOf("month").format(DATE_FORMAT);
			setDate(`${mtd} - ${tday}`);
		} else if(zoomLevel === "occupancyTable"){
			const mago = dayjs().subtract(1, "month").format(DATE_FORMAT);
			setDate(`${dayjs(mago).add(1,'day').format(DATE_FORMAT)} - ${tday}`);
		}
		else {
			const mago = dayjs().subtract(1, "month").format(DATE_FORMAT);
			setDate(`${mago} - ${tday}`);
		}
	}, [zoomLevel]);

	useEffect(() => {
		return () => {
			source.cancel();
		};

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		let accessSites = userData.userType === 'Admin' || userData.userType === "Customer" ? sites : userData.dashboardAccess && userData.dashboardAccessSites && userData.dashboardAccessSites[0] ? userData.dashboardAccessSites : [];
		if(userData.userType !== 'Admin'){
			for(const eachSite of sites){
				const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
				if(foundSite[0] && foundSite[0].contractExpired){
					accessSites = accessSites.filter((val: any) => val !== eachSite)
				}
			}
		}
		const localDashboardSites = localStorage.getItem("dashboard-selected-sites");
	    const localSelectedSites = (localDashboardSites && localDashboardSites.split(",")) || [];
		const normalizedSites = Formatter.normalizeSites(accessSites);
		if(localSelectedSites && localSelectedSites.length > 0 ){
			setSelectedSites(localSelectedSites);
		}else{
			const preSelectedSites = normalizedSites.slice(0,5)
			localStorage.setItem("dashboard-selected-sites", preSelectedSites.join());
			setSelectedSites(preSelectedSites);

		}
		setSelectableSites(normalizedSites);
		
		// eslint-disable-next-line
	}, [sitesData,zoomLevel])
 

	return (
		<Shell
			title="Dashboard"
			subtitle="View and compare data at a glance"
			endSlot={
				<Flex className="dashboard__refine-menu" justify="space-between">
					<LabelledComponent label="Car parks" className="--margin-right-large">
						<MultiSelect
					        type="dashboard"
							className="dashboard__refine-menu__multi-select"
							options = { selectableSites.map((site: any) => ({ value: Formatter.normalizeSite(site) || '', label: Formatter.capitalizeSite(site) })) }
							values={selectedSites}
							onChange={(values) => {
								const normalizedSites = Formatter.normalizeSites(values) || [];
								setShouldSearch(true); 
								setSelectedSites(normalizedSites);
								localStorage.setItem("dashboard-selected-sites", normalizedSites.join());
							}}
						/>
					</LabelledComponent>
					
					<LabelledComponent label="Graphs settings" className="--margin-right-large">
						<Switch
							className="reports__refine-menu__switch --margin-right-medium"
							checkedChildren={<BarChartIcon />}
							unCheckedChildren={<LineChartIcon />}
							defaultChecked={graphType !== "line"}
							onChange={(isBarChart) => {
								if (isBarChart) {
									setGraphType("bar");
									sessionStorage.setItem("dashboard-chart-type", "bar");
								} else {
									sessionStorage.setItem("dashboard-chart-type", "line");
									setGraphType("line");
								}
							}}
						/>
						<Switch
							className="reports__refine-menu__switch"
							checkedChildren={<DetachIcon />}
							unCheckedChildren={<OverlayIcon />}
							defaultChecked={!isOverlayed}
							onChange={(isOverlayed) => {
								if (isOverlayed) {
									setIsOverlayed(false);
									sessionStorage.setItem("dashboard-graph-overlayed", "0");
								} else {
									setIsOverlayed(true);
									sessionStorage.setItem("dashboard-graph-overlayed", "1");
								}
							}}
						/>
					</LabelledComponent>
					<LabelledComponent className="dashboard__refine-menu__search">
						<Button
							text="Search"
							icon={<LoadIcon fontSize="small" />}
							iconPosition="after"
							loading={loading}
							disabled={selectedSites.length === 0}
							onClick={() => setShouldSearch(true)}
							buttonStyle={{ marginRight: 8 }}
						/>
					</LabelledComponent>
				</Flex>
			}
		>
			<Divider />
			<div id="chart"></div>
			<>
				{isOverlayed && (
					<CardWithTabs
					   style= {{height: zoomLevel==="occupancyTable"? '100%':420}}
						mHeight={860}
						activeLabel={zoomLevel || "1d"}
						loading={loading}
						reverseActionBar={isMobile}
						tabColor="dark"
						title={
							<Flex direction="column">
								<h2 style={{ margin: 0, marginRight: 8, marginBottom: 4, marginTop: 8 }}>
									<b>Selected car parks</b>
								</h2>
								<h4>{date}</h4>
							</Flex>
						}
						items={userData && (userData.userType==="Admin" || (userData.occupancyTableAccess && userData.occupancyTableAccessSites.length > 0))?[
							{ label: "1D", value: "1d", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1d");}},
							{ label: "WTD", value: "wtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("wtd")}},
							{ label: "1W", value: "1w", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1w")}},
							{ label: "MTD", value: "mtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("mtd")}},
							{ label: "1M", value: "1m", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1m")}},
						    { label:  "Occupancy Table", value: "occupancyTable", onClick: () => {setShouldSearch(true); setZoomLevel("occupancyTable")}}
						]:[
							{ label: "1D", value: "1d", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1d");}},
							{ label: "WTD", value: "wtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("wtd")}},
							{ label: "1W", value: "1w", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1w")}},
							{ label: "MTD", value: "mtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("mtd")}},
							{ label: "1M", value: "1m", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1m")}},
						]}
						mainContent={
						  zoomLevel==="occupancyTable"?<OccupancyTable setDate={setDate} isOverLayed={isOverlayed} site={selectedSites.filter((site:any)=>(userData.occupancyTableAccessSites.includes(site)))}/>:	
							<DashboardGraph
								data={overlayedData && overlayedData[zoomLevel]? overlayedData[zoomLevel]:{}}
								diff={(overlayedData && overlayedData[zoomLevel] && overlayedData[zoomLevel].diff ? overlayedData?.[zoomLevel].diff : {})}
								type={overviewGraphType}
								zoom={zoomLevel}
								isOverlayed={isOverlayed}
								format={graphType}
								onTypeSwitch={(type) => setOverviewGraphType(type)}
							/>
						}
					/>
				)}
				{!isOverlayed &&
					selectedSites &&
					selectedSites.map((site: any) => {
						return (
							<CardWithTabs
							style= {{height: zoomLevel==="occupancyTable"? '100%':420}}
								mHeight={860}
								key={site}
								activeLabel={zoomLevel || "1d"}
								loading={loading}
								reverseActionBar={isMobile}
								tabColor="dark"
								title={
									<Flex direction="column">
										<h2 style={{ margin: 0, marginRight: 8 }}>
											<b>
												{Formatter.capitalizeSite(
													["guykendall@eurocarparks.com"].includes(email)
														? site === "king-st-west-stockport"
															? "king-st"
															: site === "test"
															? "office"
															: site
														: site
												)}
											</b>
										</h2>
										<h4>{date}</h4>
									</Flex>
								}
								items={ userData && (userData.userType==="Admin" ||(userData.occupancyTableAccess && userData.occupancyTableAccessSites && userData.occupancyTableAccessSites.includes(site)))?[
									{ label: "1D", value: "1d", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1d");}},
									{ label: "WTD", value: "wtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("wtd")}},
									{ label: "1W", value: "1w", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1w")}},
									{ label: "MTD", value: "mtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("mtd")}},
									{ label: "1M", value: "1m", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1m")}},
									{ label:  "Occupancy Table", value: "occupancyTable", onClick: () => {setShouldSearch(true); setZoomLevel("occupancyTable")}}
								]:[
									{ label: "1D", value: "1d", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1d");}},
									{ label: "WTD", value: "wtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("wtd")}},
									{ label: "1W", value: "1w", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1w")}},
									{ label: "MTD", value: "mtd", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("mtd")}},
									{ label: "1M", value: "1m", disabled: loading, onClick: () => {setShouldSearch(true); setZoomLevel("1m")}},
								]}
								mainContent={
									zoomLevel==="occupancyTable" && userData.occupancyTableAccess && userData.occupancyTableAccessSites.includes(site) ? <OccupancyTable setDate={setDate} isOverLayed={isOverlayed} site={[site]}/>:
									<DashboardGraph
									data={overlayedData && overlayedData[zoomLevel]? overlayedData[zoomLevel]:{}}
									diff={(overlayedData && overlayedData[zoomLevel] && overlayedData[zoomLevel].diff ? overlayedData?.[zoomLevel].diff : {})}
										type={overviewGraphType}
										zoom={zoomLevel}
										site={site}
										isOverlayed={isOverlayed}
										format={graphType}
										onTypeSwitch={(type) => setOverviewGraphType(type)}
									/>
								}
							/>
						);
					})}
			</>
		</Shell>
	);
};
