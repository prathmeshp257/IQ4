import React, { FC, useState } from "react";
import { CardWithTabs } from "../../components";
import {AllNotifications} from "./AllNotifications";
import { APISetting } from "./APISetting";
import { CameraAPICallData } from "./CameraAPIData";
import { CameraNotification } from "./CameraNotification";
interface Props {
	iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
}

export const CameraAPICall: FC<Props> = ({reloadData,setReloadData}) => {

	const [activeLabel, setActiveLabel] = useState<string>("Camera API Data");

	const items = [{
		label: "Camera API Data",
		value: "Camera API Data",
		content: (
			<>
				<CameraAPICallData iqStatsActiveLabel={activeLabel} reloadData={reloadData} setReloadData={setReloadData}/>
			</>
		)
	},
	{
		label: "API Setting",
		value: "API Setting",
		content: (
			<>
				<APISetting sites={[]}/>
			</>
		)
	},
	{
		label: "Camera Notification Setting",
		value: "Camera Notification Setting",
		content: (
			<>
				<CameraNotification/>
			</>
		)
	}
];

	
	
	
	

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
