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
import { MainNotification } from "./MainNotification";
import {MatchRate} from './MatchRate';
import {NotificationSettings} from './NotificationSettings';
import { Formatter } from "../../utils";
import RefreshIcon from '@material-ui/icons/Refresh';
import { CameraAPICall } from "./CameraAPICall";

export const Notification: FC = () => {
    const { userData } = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
    const [reloadData,setReloadData] = useState<boolean>(false);
	const isLocalContainerColMode = (localStorage.getItem("iqStats-layout-mode") || "row") === "col";
	const iqStatAccessSites = userData.iqStatAccessSites || [];
	const matchRateAlertAccessSites = userData.matchRateAlertAccessSites || [];
	const userLoginType = userData.userType;
	const { sites } = useContext(UserContext);
	const [activeLabel, setActiveLabel] = useState<string>("All Notifications");
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
	    			label: "All Notifications",
	    			value: "All Notifications",
	    			content: (
                        <>
                            <MainNotification iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData}  sites={userLoginType === 'Admin' ? sites : iqStatAccessSites} mainSites={selectedSites}/>
                        </>
                    )
	    		},

            );
        }
        else{
            setActiveLabel('Match Rate Alert')
        }
        if(userLoginType === 'Admin' || (userData.matchRateAlertAccess && matchRateAlertAccessSites && matchRateAlertAccessSites[0])){
            items.push(
	    		{
	    			label: "Match Rate Alert",
	    			value: "Match Rate Alert",
	    			content: (
                        <>
                            <MatchRate iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData} sites={userLoginType === 'Admin' ? sites : matchRateAlertAccessSites} mainSite={selectedSites} />
                        </>
                    )
	    		}
            );
        }
        if(userLoginType === 'Admin' || (userData.matchRateAlertAccess && matchRateAlertAccessSites && matchRateAlertAccessSites[0]) || (userData.iqStatAccess && iqStatAccessSites && iqStatAccessSites[0])){
            items.push(
	    		{
	    			label: "Notification Settings",
	    			value: "Notification Settings",
	    			content: (
                        <>
                            <NotificationSettings />
                        </>
                    )
	    		}
            );
        }

        if(userLoginType === "Admin"){
            items.push(
                {
                    label: "Camera API Call",
                    value: "Camera API Call",
                    content: (
                        <>
                            <CameraAPICall iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData}/>
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
	    	activeLabel={activeLabel || "All Notifications"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={tabs}
        />

	);
};
