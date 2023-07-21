import RowLayoutIcon from "@material-ui/icons/Menu";
import ColumnLayoutIcon from "@material-ui/icons/ViewWeek";
import { Switch } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { DashRow, Flex } from "../../components";
import { Divider } from "../../components/Divider";
import { LabelledComponent } from "../../components/LabelledComponent";
import { PATHS } from "../../constants";
import { Shell } from "../../containers";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { LiveData } from "../../types";
import { formatSite, Formatter } from "../../utils";

export const Live: FC = () => {
	const isLocalContainerColMode = (localStorage.getItem("live-layout-mode") || "row") === "col";

	const { enqueueSnackbar } = useSnackbar();

	const history = useHistory();

	const source = axios.CancelToken.source();

	const [loading, setLoading] = useState(false);
	const [sitesData1, setSitesData] = useState<LiveData>();
	const [isContainerColMode, setIsContainerColMode] = useState(isLocalContainerColMode);

	const { sites, email } = useContext(UserContext);
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				let accessSites = userData.userType === 'Admin' || userData.userType === "Customer" ? sites : userData.dashboardAccess && userData.dashboardAccessSites && userData.dashboardAccessSites[0] ? userData.dashboardAccessSites : [];
				if(userData.userType !== 'Admin'){
					for(const eachSite of sites){
						const foundSite = sitesData.filter((val: any) => val.id === Formatter.normalizeSite(eachSite));
						if(foundSite[0] && foundSite[0].contractExpired){
							accessSites = accessSites.filter((val: any) => val !== eachSite)
						}
					}
				}
				let qsSites = Formatter.normalizeSites(accessSites).join();
				const liveDataReq = axios.get(`/api/live?sites=${qsSites}&userType=${userData.userType}&email=${email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") },
					cancelToken: source.token
				});

				const diffDataReq = axios.get(`/api/dashboard/diff?sites=${qsSites}&userType=${userData.userType}&email=${email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") },
					cancelToken: source.token
				});

				const [{ data }, { data: diffData }] = await Promise.all([liveDataReq, diffDataReq]);

				qsSites.split(",").forEach((site) => {
					const keyLength =data[site] ? Object.keys(data[site]).length : 0;
					if(keyLength > 0){
						data[site] = { ...data[site], diff: diffData[site] };
					}
				});

				setSitesData(data);
			} catch (e:any) {
				if (!axios.isCancel(e)) {
					enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
				}

				if (e.response && e.response.status === 401) {
					history.replace(PATHS.LOGIN);
				}
			}
			setLoading(false);
		};

		if (!loading) {
			getData();
		}

		// eslint-disable-next-line
	}, [enqueueSnackbar, sites]);

	useEffect(() => {
		return () => {
			source.cancel();
		};

		// eslint-disable-next-line
	}, []);

	return (
		<Shell
			title="Live"
			subtitle="Realtime data"
			loading={loading}
			endSlot={
				<>
					{!isMobile && (
						<Flex className="dashboard__refine-menu" justify="space-between">
							<LabelledComponent label="Layout" className="--margin-right-large">
								<Switch
									className="reports__refine-menu__switch"
									checkedChildren={<ColumnLayoutIcon />}
									unCheckedChildren={<RowLayoutIcon />}
									defaultChecked={isContainerColMode}
									onChange={(isCol) => {
										setIsContainerColMode(isCol);
										localStorage.setItem("live-layout-mode", isCol ? "col" : "row");
									}}
								/>
							</LabelledComponent>
						</Flex>
					)}
				</>
			}
		>
			<Divider />
			<div className={isContainerColMode ? "live__container-mode-col" : "live__container-mode-row"}>
				{!loading &&
					sitesData1 &&
					Object.keys(sitesData1).map((site) => {
						const keyLength = sitesData1 && sitesData1[site] ? Object.keys(sitesData1[site]).length : 0;
						if(sitesData1?.[site] && keyLength > 0){
							return (
								<DashRow
									mode={isContainerColMode ? 'col' : 'row'}
									className={isContainerColMode ? "live__container-mode-col__card" : "live__container-mode-row__card"}
									key={site}
									title={Formatter.capitalizeSite(formatSite(site, email)) || ""}
									data={sitesData1?.[site]}
								/>
							);
						}
						else{
							return '';
						}
					})}
			</div>
		</Shell>
	);
};
