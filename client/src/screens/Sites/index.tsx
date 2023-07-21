import React, { FC, useState, useContext, useEffect } from "react";
import { CardWithTabs } from "../../components";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { SitesData } from './SitesData';
import { ExcludeVrm } from '../ExcludeVRM/ExcludeVrm';
export const SitesHome: FC = () => {
    const { userData } = useContext(AuthContext)
	const { sitesData } = useContext(SiteContext);
	const userLoginType = userData.userType;
	const { sites } = useContext(UserContext);
	const [allSites, setAllSites] = useState<any[]>([]);
	const [activeLabel, setActiveLabel] = useState<string>("Sites");
    const [tabs, setTabs] = useState<any>([]);

	useEffect(() => {
		if(userLoginType !== "Admin"){
			let accessSites = [] as any;
            let availableSites = [];
            if(userData.excludeVrmAccess){
                availableSites = userData.excludeVrmAccessSites;
            }
            accessSites = availableSites;
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
	},[sites, userData, sitesData])

    useEffect(() => {
        const items = [
            {
                label: "Sites",
                value: "Sites",
                content: (
                    <>
                        <SitesData />
                    </>
                )
            },
        ];
        if(userLoginType === 'Admin' || (userData.excludeVrmAccess && userData.excludeVrmAccessSites && userData.excludeVrmAccessSites[0])){
            items.push(
	    		{
	    			label: "Remove VRM's From Stats",
	    			value: "Remove VRM's From Stats",
	    			content: (
                        <>
                            <ExcludeVrm sites={allSites} />
                        </>
                    )
	    		},
            );
        }
        setTabs(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSites])    

	return (
        <React.Fragment>
            {
                // userLoginType === "Retailer" ? 
                //     <ExcludeVrm sites={allSites} />
                // :
                    <CardWithTabs
                        style={{height:'90%', overflowY:'scroll'}}
                        key={activeLabel}
                        activeLabel={activeLabel || "Sites"}
                        title={activeLabel}
                        onItemClick={({label}) => setActiveLabel(label)}
                        tabColor="dark"
                        isOpen
                        items={tabs}
                    />
            }
        </React.Fragment>
	);
};
