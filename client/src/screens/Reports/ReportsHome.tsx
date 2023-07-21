import React, { FC, useState, useContext } from "react";
import { CardWithTabs } from "../../components";
import { Reports } from "./Reports";
import { Shell } from "../../containers";
import { ScheduledReporting } from "./ScheduledReporting"
import { AuthContext } from "../../context";

export const ReportsHome: FC = () => {
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const scheduledReportingAccess = userData.scheduledReportingAccess;
	const scheduledReportingAccessSites = userData.scheduledReportingAccessSites || [];
	const hasAccessToScheduledReporting = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && scheduledReportingAccess && scheduledReportingAccessSites.length > 0 && scheduledReportingAccessSites[0]);
	const dashboardAccess = userData.dashboardAccess;
	const dashboardAccessSites = userData.dashboardAccessSites || [];
	const hasAccessToDashboardAccess = userLoginType === "Admin" || userLoginType === "Customer" || ((userLoginType === "Retailer" || userLoginType === "Operator") && dashboardAccess && dashboardAccessSites.length > 0 && dashboardAccessSites[0]);
	const [activeLabel, setActiveLabel] = useState<string>("Reports");

	return (
		<Shell title="Reports" subtitle="Manage and download reports">
			{
				hasAccessToScheduledReporting && hasAccessToDashboardAccess ? 
					<CardWithTabs
						style={{height:'100%'}}
						key={activeLabel}
						activeLabel={activeLabel || "Reports"}
						title={activeLabel}
						onItemClick={({label}) => setActiveLabel(label)}
						tabColor="dark"
						isOpen
						items={[
							{
								label: "Reports",
								value: "Reports",
								content: (
									<>
										<Reports/>
									</>
								)
							},
							{
								label: "Scheduled Reporting",
								value: "Scheduled Reporting",
								content: (
									<>
										<ScheduledReporting/>
									</>
								)
							},
						]}
					/>
				:
				hasAccessToScheduledReporting ?
					<ScheduledReporting/>
				:
				hasAccessToDashboardAccess ?
					<Reports/>
				:""
			}
        </Shell>
	);
};
