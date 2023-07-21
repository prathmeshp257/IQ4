import React, { FC, useContext, useState } from "react";
import { CardWithTabs } from "../../components";
import { AuthContext } from "../../context";
import {AllNotifications} from "./AllNotifications";
import { ArchivedNotifications } from "./ArchivedNotification";
import {HistoricNotifications} from "./HistoricNotifications";
import {PendingNotifications} from "./PendingNotifications";
interface Props {
    sites: Array<any>;
	mainSites:Array<any>;
	iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
}

export const MainNotification: FC<Props> = ({sites,mainSites,iqStatsActiveLabel,reloadData,setReloadData}) => {

	const [activeLabel, setActiveLabel] = useState<string>("All notifications");
	const {userData} = useContext(AuthContext) ;
	const userLoginType = userData.userType ;

	const items = [{
		label: "All notifications",
		value: "All notifications",
		content: (
			<>
				<AllNotifications iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSites={mainSites} />
			</>
		)
	},
	{
		label: "Pending notifications",
		value: "Pending notifications",
		content: (
			<>
				<PendingNotifications iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSites={mainSites}/>
			</>
		)
	},
	{
		label: "Historic notifications",
		value: "Historic notifications",
		content: (
			<>
				<HistoricNotifications iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSites={mainSites}/>
			</>
		)
	},
	
];

 if(userLoginType === "Admin") {
	items.push({
		label: "Archived notifications",
		value: "Archived notifications",
		content: (
			<>
				<ArchivedNotifications iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSites={mainSites}/>
			</>
		)
	})
 }

	return (
		
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

	);
};
