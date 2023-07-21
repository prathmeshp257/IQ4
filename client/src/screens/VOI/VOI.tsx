import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs } from "../../components";
import {VOIList} from "./VOIList";
import { Shell } from "../../containers";
import {VOIHistory} from './VOIHistory';
import {VOISearch} from './VOISearch';
import { AuthContext } from "../../context";
import { EmailGroups } from "./EmailGroups";
import { VOIArchiveList } from "./VOIArchiveList";
import { PrivateVoi } from "./PrivateVoi";
import { SpreadsheetStatus } from "./SpreadsheetStatus";

export const VOI: FC = () => {
	const { userData } = useContext(AuthContext);
	const [activeLabel, setActiveLabel] = useState<string>("Vehicle Of Interest Settings");
	const { vehicleSearchAccess, vehicleSearchAccessSites, voiSettingAccess, voiSettingAccessSites, voiViewOnlyAccess, voiViewOnlyAccessSites, voiPrivateAccess, voiPrivateAccessSites} = userData;
	const userLoginType = userData.userType;
	const items = [];

	if(userLoginType === "Admin" || (voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0])){
		items.push({
				label: "Vehicle Of Interest Settings",
				value: "Vehicle Of Interest Settings",
				content: (
					<>
						<VOIList/>
					</>
				)
			},)
	}

	if(userLoginType === "Admin" || (voiViewOnlyAccess && voiViewOnlyAccessSites && voiViewOnlyAccessSites[0]) || (voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0])){
		items.push({
				label: "Vehicle Of Interest Sightings",
				value: "Vehicle Of Interest Sightings",
				content: (
					<>
						<VOIHistory/>
					</>
				)
			})
	}

	if(userLoginType === "Admin" || (vehicleSearchAccess && vehicleSearchAccessSites && vehicleSearchAccessSites[0])){
		items.push({
				value: "Vehicle Search",
				label: "Vehicle Search",
				content: (
					<>
						<VOISearch/>
					</>
				)
			})
	}

	
	if(userLoginType === "Admin" || (voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0])){
		items.push({
				label: "Email Groups",
				value: "Email Groups",
				content: (
					<>
						<EmailGroups/>
					</>
				)
			},)
	}

	if(userLoginType === "Admin" || (voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0])){
		items.push({
				label: "Archive",
				value: "Archive",
				content: (
					<>
						<VOIArchiveList/>
					</>
				)
			},)
	}

	if(userLoginType === "Admin" || (voiPrivateAccess && voiPrivateAccessSites && voiPrivateAccessSites[0])){
		items.push({
				label: "Private VOI",
				value: "Private VOI",
				content: (
					<>
						<PrivateVoi />
					</>
				)
			},)
	}
	if(userLoginType === "Admin" || (voiPrivateAccess && voiPrivateAccessSites && voiPrivateAccessSites[0])){
		items.push({
				label: "Spreadsheet Status",
				value: "Spreadsheet Status",
				content: (
					<>
						<SpreadsheetStatus />
					</>
				)
			},)
	}
	
	useEffect(() => {
		if(userLoginType !== "Admin" && !(voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0])){
			setActiveLabel("Vehicle Of Interest Sightings");
		}
		if(userLoginType !== "Admin" && !(voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0]) && !(voiViewOnlyAccess && voiViewOnlyAccessSites && voiViewOnlyAccessSites[0])){
			setActiveLabel("Vehicle Search");
		}
		if(userLoginType !== "Admin" && !(voiSettingAccess && voiSettingAccessSites && voiSettingAccessSites[0]) && !(voiViewOnlyAccess && voiViewOnlyAccessSites && voiViewOnlyAccessSites[0]) && !(vehicleSearchAccess && vehicleSearchAccessSites && vehicleSearchAccessSites[0])){
			setActiveLabel("Private VOI");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return (
		<Shell 
            title="Vehicle Of Interest" 
            subtitle="Vehicle Of Interest Configuration And Data"
        >
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel || "Vehicle Of Interest Settings"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={items}
        />
        </Shell>
	);
};
