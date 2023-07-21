import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs, Flex, MultiSelect } from "../../components";
import {IqStatsLive} from "./IqStatsLive";
import { Shell } from "../../containers";
import { LabelledComponent } from "../../components/LabelledComponent";
import Button from "@material-ui/core/Button";
import RowLayoutIcon from "@material-ui/icons/Menu";
import ColumnLayoutIcon from "@material-ui/icons/ViewWeek";
import { Switch } from "antd";
import { isMobile } from "react-device-detect";
import { UserContext, AuthContext, SiteContext } from "../../context";
import {IqStatsHistoryTable} from './IqStatsHistoryTable';
import {UnmatchedVrmDataTable} from './UnmatchedVrmDataTable';
import {IqStatsMatchingImages} from './IqStatsMatchingImages'
import { Formatter } from "../../utils";
import RefreshIcon from '@material-ui/icons/Refresh';

export const Statistics: FC = () => {
    const { userData } = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
    const [reloadData,setReloadData] = useState<boolean>(false);
	const isLocalContainerColMode = (localStorage.getItem("iqStats-layout-mode") || "row") === "col";
	const iqStatAccessSites = userData.iqStatAccessSites || [];
	const matchRateAlertAccessSites = userData.matchRateAlertAccessSites || [];
	const userLoginType = userData.userType;
	const { sites } = useContext(UserContext);
	const [activeLabel, setActiveLabel] = useState<string>("Historic Data");
	const [isContainerColMode, setIsContainerColMode] = useState(isLocalContainerColMode);
    const [tabs, setTabs] = useState<any>([]);
    const localStatsSite = localStorage.getItem(`iqStats-overall-site`) || undefined;
	const [allSites, setAllSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>(localStatsSite ? [localStatsSite] : []);
    useEffect(() => {
		if(userLoginType !== "Admin"){
			let accessSites = [] as any;
            let availableSites = [];
            if(userData.iqStatAccess){
                accessSites = iqStatAccessSites;
                availableSites = iqStatAccessSites;
            }
        
			for(const eachSite of availableSites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setAllSites(accessSites);
		}
		else if(userLoginType === "Admin"){
			setAllSites(sites);
		}
		else{
			setAllSites([])
		}
		// eslint-disable-next-line
	},[sites, iqStatAccessSites, sitesData])

    const clearData = () => {
        sessionStorage.clear();
        setReloadData(true)
    }

    useEffect(() => {
        const items = [];
        if(userLoginType === 'Admin' || (userData.iqStatAccess && iqStatAccessSites && iqStatAccessSites[0])){
            items.push(
                
                
	    		{
	    			label: "Matching Data",
	    			value: "Historic Data",
	    			content: (
                        <>
                            <IqStatsHistoryTable iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
                {
	    			label: "Matching Images",
	    			value: "Matching Images",
	    			content: (
                        <>
                            <IqStatsMatchingImages iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
	    		{
	    			label: "Unmatched VRM Data",
	    			value: "Unmatched VRM Data",
	    			content: (
                        <>
                            <UnmatchedVrmDataTable iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		}
	    		
            );
        }
       
        
        
        
     
        setTabs(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSites,reloadData,activeLabel])    

	return (

        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel || "Historic Data"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={tabs}
        />
	);
};
