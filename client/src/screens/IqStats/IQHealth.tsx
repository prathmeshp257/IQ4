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
import {VrmCounter} from './vrmCounter';
import {TimeSync} from './TimeSync';
import {Heartbeat} from './Heartbeat';
import {FrameCount} from './FrameCount';
import {RebootLog} from './RebootLog';
import { Formatter } from "../../utils";
import RefreshIcon from '@material-ui/icons/Refresh';


export const IQHealth: FC = () => {
    const { userData } = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
    const [reloadData,setReloadData] = useState<boolean>(false);
	const isLocalContainerColMode = (localStorage.getItem("iqStats-layout-mode") || "row") === "col";
	const iqStatAccessSites = userData.iqStatAccessSites || [];
	const matchRateAlertAccessSites = userData.matchRateAlertAccessSites || [];
	const userLoginType = userData.userType;
	const { sites } = useContext(UserContext);
	const [activeLabel, setActiveLabel] = useState<string>("Time Sync");
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
	    			label: "Time Sync",
	    			value: "Time Sync",
	    			content: (
                        <>
                            <TimeSync iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
	    		{
	    			label: "Heartbeat",
	    			value: "Heartbeat",
	    			content: (
                        <>
                            <Heartbeat iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
	    		{
	    			label: "Frame Count",
	    			value: "Frame Count",
	    			content: (
                        <>
                            <FrameCount iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
	    		{
	    			label: "Reboot Log",
	    			value: "Reboot Log",
	    			content: (
                        <>
                            <RebootLog iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
                {
	    			label: "VRM Counter",
	    			value: "VRM Counter",
	    			content: (
                        <>
                            <VrmCounter iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		},
            );
        }
        
     
        setTabs(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSites,reloadData,activeLabel])    
	return (
        
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel || "Time Sync"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={tabs}
        />
	);
};
