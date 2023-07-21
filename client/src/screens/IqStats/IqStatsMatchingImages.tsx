import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs } from "../../components";
import { AuthContext } from "../../context";
import { ApproxImageTable } from "./ApproxImageTable";
import { ClusterImageTable } from "./ClusterImageTable";
interface Props {
    sites: Array<any>;
    mainSite:Array<any>;
	iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
}

export const IqStatsMatchingImages: FC<Props> = ({sites,mainSite,iqStatsActiveLabel,reloadData,setReloadData}) => {
	const { userData } = useContext(AuthContext);
    const userLoginType = userData.userType;
    const iqStatAccessSites = userData.iqStatAccessSites || [];
    const sessionUnmatchedSite = localStorage.getItem("iqStats-unmatched-selected-site") || undefined;
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : sessionUnmatchedSite ? [sessionUnmatchedSite] : []);
	const [activeLabel, setActiveLabel] = useState<string>("Cluster Image");

    useEffect(() => {
                if (mainSite && mainSite[0]) {
                    setSelectedSites([...mainSite])
                }
            }, [mainSite])

	const items = [
	{
		label: "Cluster Image",
		value: "Cluster Image",
		content: (
			<>
				<ClusterImageTable iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites}/>
			</>
		)
	},
	{
		label: "Approx Image",
		value: "Approx Image",
		content: (
			<>
				<ApproxImageTable iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites}/>
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
