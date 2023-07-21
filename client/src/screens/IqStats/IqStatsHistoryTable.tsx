import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs } from "../../components";

import { MatchingData } from "./MatchingData";
import { Shell } from "../../containers";
import { AuthContext } from "../../context";
import { AverageMatchRate } from "./AverageMatchRate";
interface Props {
    sites: Array<any>;
    mainSite:Array<any>;
	iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
}

export const IqStatsHistoryTable: FC<Props> = ({sites,mainSite,iqStatsActiveLabel,reloadData,setReloadData}) => {
	const { userData } = useContext(AuthContext);
	const [activeLabel, setActiveLabel] = useState<string>("Matching Data");
	const items = [
	{
		label: "Matching Data",
		value: "Matching Data",
		content: (
			<>
				<MatchingData iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSite={mainSite}/>
			</>
		)
	},
	{
		label: "Average Match Rate",
		value: "Average Match Rate",
		content: (
			<>
				<AverageMatchRate iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites = {sites} mainSite={mainSite}/>
			</>
		)
	}];

	
	
	
	

	return (
		
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={items}
        />

	);
};
