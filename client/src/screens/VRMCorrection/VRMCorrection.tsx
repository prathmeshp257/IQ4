import React, { FC, useContext, useState ,useEffect} from "react";
import { CardWithTabs,Flex, MultiSelect} from "../../components";
import { LabelledComponent } from "../../components/LabelledComponent";
import { Shell } from "../../containers";
import { isMobile } from "react-device-detect";
import { AuthContext, SiteContext, UserContext } from "../../context";
import { VRMCorrectionData } from "./VRMCorrectionData";
import { VRMCorrectionHistory } from "./VRMCorrectionHistory";
import { Formatter } from "../../utils";
import axios from "axios";
import { VRMCorrectionReport } from "./VRMCorrectionReports";


export const VRMCorrection: FC = () => {

	const [activeLabel, setActiveLabel] = useState<string>("VRM Correction");
	const {userData} = useContext(AuthContext)
	const {sitesData} = useContext(SiteContext)
	const {sites} = useContext(UserContext)
	const [allSites, setAllSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [selectableSites, setSelectableSites] = useState<any>([]);

	

	const getAllSites = async () => {
        try {
            const site = userData.sites;
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setAllSites(data);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }

    useEffect(() => {

		if(allSites && allSites.length > 0){

			let vrmCorrectionaccessSites = allSites.filter((eachSite: any) => {
				return eachSite.vrmCorrectionAccess === true
			})
			let selectableSites = [] as any;
			for (const eachSite of vrmCorrectionaccessSites) {
				selectableSites.push(eachSite._id)
			}
			setSelectableSites(selectableSites);
		}
       

    }, [allSites]);

	useEffect(() => {
		getAllSites()
		// nt-disable-next-line
	},[sitesData,sites])

	const items = [{
		label: "VRM Correction",
		value: "VRM Correction",
		content: (
			<>
				<VRMCorrectionData sites = {allSites} mainSite={selectedSites} />
			</>
		)
	},
	{
		label: "Show History",
		value: "Show History",
		content: (
			<>
				<VRMCorrectionHistory sites = {allSites} mainSite={selectedSites}  />
			</>
		)
	},
	{
		label: "Reports",
		value: "Reports",
		content: (
			<>
				<VRMCorrectionReport   />
			</>
		)
	},
	];

	
	
	
	

	return (
		
		<Shell 
		title="VRM Correction" 
		subtitle="Correct the VRMs"
		endSlot={
		<Flex className="dashboard__refine-menu" justify="space-between">
			<LabelledComponent label="Sites" className="--margin-right-large">
				<MultiSelect
				fullWidth={!!isMobile}
				multi={false}
				className="insights__refine-menu__multi-select"
				options={selectableSites.map((site:any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
				values={selectedSites}
				onChange={(values) => {
					const normalizedSites = Formatter.normalizeSites(values) || [];
					localStorage.setItem("iqStats-overall-site",normalizedSites[0]);
					setSelectedSites(normalizedSites);
				}}
				/>
			</LabelledComponent>
			
		</Flex>
	}>
	<CardWithTabs
		style={{height:'100%'}}
		key={activeLabel}
		activeLabel={activeLabel || "Live Data"}
		title={activeLabel}
		onItemClick={({label}) => setActiveLabel(label)}
		tabColor="dark"
		isOpen
		items={items}
	/>
	</Shell>

	);
};
