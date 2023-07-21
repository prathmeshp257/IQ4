import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs, Flex, MultiSelect } from "../../components";
import {IqStatsLive} from "./IqStatsLive";
import { Shell } from "../../containers";
import { LabelledComponent } from "../../components/LabelledComponent";
import Button from "@material-ui/core/Button";
import RowLayoutIcon from "@material-ui/icons/Menu";
import ColumnLayoutIcon from "@material-ui/icons/ViewWeek";
import {  Switch } from "antd";
import { isMobile } from "react-device-detect";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { Formatter } from "../../utils";
import RefreshIcon from '@material-ui/icons/Refresh';
import { Notification } from "./Notification";
import { IQHealth } from "./IQHealth";
import { Statistics } from "./Statistics";
import { CameraAPICall } from "./CameraAPICall";
import { FrameCount } from "./FrameCount";
import { Heartbeat } from "./Heartbeat";
import { IqStatsHistoryTable } from "./IqStatsHistoryTable";
import { IqStatsMatchingImages } from "./IqStatsMatchingImages";
import { MainNotification } from "./MainNotification";
import { MatchRate } from "./MatchRate";
import { NotificationSettings } from "./NotificationSettings";
import { RebootLog } from "./RebootLog";
import { TimeSync } from "./TimeSync";
import { UnmatchedVrmDataTable } from "./UnmatchedVrmDataTable";
import { VrmCounter } from "./vrmCounter";

export const IqStats: FC = () => {
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
                        },
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
		<Shell 
            title="IQ Stats" 
            subtitle="Understand the match percent and unmatched data for your car parks"
            endSlot={
            <Flex className="dashboard__refine-menu" justify="space-between">
                <LabelledComponent label="Sites" className="--margin-right-large">
                    <MultiSelect
                    fullWidth={!!isMobile}
                    multi={false}
                    className="insights__refine-menu__multi-select"
                    options={allSites.map((site:any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                    values={selectedSites}
                    onChange={(values) => {
                        const normalizedSites = Formatter.normalizeSites(values) || [];
                        localStorage.setItem("iqStats-overall-site",normalizedSites[0]);
                        setSelectedSites(normalizedSites);
                    }}
                    />
                </LabelledComponent>

                <LabelledComponent label="Refresh Data" className="--margin-right-large">
                  <Button style={{width:'72px'}} onClick={()=>clearData()} variant="contained"><RefreshIcon/></Button>
                </LabelledComponent>
               
                {!isMobile && activeLabel === "Live Data" && (
                    <LabelledComponent label="Layout" className="--margin-right-large">
                        <Switch
                            className="reports__refine-menu__switch"
                            checkedChildren={<ColumnLayoutIcon />}
                            unCheckedChildren={<RowLayoutIcon />}
                            defaultChecked={isContainerColMode}
                            onChange={(isCol) => {
                                setIsContainerColMode(isCol);
                                localStorage.setItem("iqStats-layout-mode", isCol ? "col" : "row");
                            }}
                        />
                    </LabelledComponent>
                )}
            </Flex>
        }>
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel || "Notifications"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={tabs}
        />
        </Shell>
	);
};
function setActiveLabel(arg0: string) {
    throw new Error("Function not implemented.");
}

function setTabs(items: any) {
    throw new Error("Function not implemented.");
}

function setSelectedSites(normalizedSites: string[]) {
    throw new Error("Function not implemented.");
}
