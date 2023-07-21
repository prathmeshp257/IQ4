import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { IqStatsRow } from "../../components";
import { UserContext, AuthContext } from "../../context";
import { Formatter } from "../../utils";
import ProgressBar from "../Reports/ProgressBar";

interface Props {
	isContainerColMode: boolean;
}

export const IqStatsLive: FC<Props> = ({isContainerColMode}) => {
	const { userData } = useContext(AuthContext);
	const userType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [iqStats, setIqStats] = useState<any>({});
	const [iqStatsSites, setIqStatsSites] = useState<any>([]);
	const { email } = useContext(UserContext);

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const {data} = await axios.get(`/api/iqStats?type=${userType}&email=${email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setIqStats(data);
				let sites = Object.keys(data);
				setIqStatsSites(sites);
			} catch (e) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
			}
			setLoading(false);
		};

		getData()

		// eslint-disable-next-line
	}, []);

	return (
			<div className={isContainerColMode ? "iqStats__container-mode-col" : "iqStats__container-mode-row"}>
				{
            		loading ? <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
					<ProgressBar/>
					</div> :
					!loading && iqStatsSites &&
					iqStatsSites.map((eachSite:any) => {
						return (
							<IqStatsRow
								className={isContainerColMode ? "iqStats__container-mode-col__card" : "iqStats__container-mode-row__card"}
								key={eachSite}
								title={Formatter.capitalizeSite(eachSite) || ""}
								data={iqStats[eachSite] || {}}
							/>
						);
					})
				}
			</div>
	);
};
