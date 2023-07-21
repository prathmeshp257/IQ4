import React, { FC, useContext, useState } from "react";
import { CardWithTabs } from "../../components";
import { AuthContext, UserContext } from "../../context";
import { ForwardHistory } from "./ForwardHistory";
import { URLCrud } from "./URLCrud";




export const ForwardsURL: FC= () => {

	const [activeLabel, setActiveLabel] = useState<string>("Corrected VRMs");
	const {userData} = useContext(AuthContext);
	const userType = userData.userType;
	const {sites} = useContext(UserContext)
	const forwardsAccessSites =  userData.forwardsAccessSites || [] ;


	const items = [{
		label: "Corrected VRMs",
		value: "Corrected VRMs",
		content: (
			<>
				<ForwardHistory sites = {userType==="Admin"? sites: forwardsAccessSites}/>
			</>
		)
	},
	{
		label: "URLs",
		value: "URLs",
		content: (
			<>
				<URLCrud sites = {userType==="Admin"? sites:forwardsAccessSites} />
			</>
		)
	},
	];

	
	
	
	

	return (
		
        <CardWithTabs
            style={{height:'90%', overflowY:'scroll'}}
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
