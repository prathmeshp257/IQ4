import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { UserContext, AuthContext } from "../../context";
import { Formatter } from "../../utils";
import { GoNeutralRow, Divider } from '../../components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import ProgressBar from "../Reports/ProgressBar";

const useStyles = makeStyles({
  container: {
    minHeight: 200,
  },
});

interface Props {
	isContainerColMode: boolean;
}

export const CalculateAndOffset: FC<Props> = ({isContainerColMode}) => {
	const { userData } = useContext(AuthContext);
	const userType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [goNeutral, setGoNeutral] = useState<any>({});
	const [goNeutralSites, setGoNeutralSites] = useState<any>([]);
	const { email } = useContext(UserContext);
	const classes = useStyles();

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const {data} = await axios.get(`/api/goNeutral/calculateAndOffset?type=${userType}&email=${email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setGoNeutral(data);
				let sites = Object.keys(data.siteData || {});
				setGoNeutralSites(sites);
			} catch (e) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
			}
			setLoading(false);
		};

		getData()

		// eslint-disable-next-line
	}, []);

	return (
			<div className={isContainerColMode ? "goNeutral__container-mode-col" : "goNeutral__container-mode-row"}>
				{
            		loading ? <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
					<ProgressBar/>
					</div> :
					<React.Fragment>
						<GoNeutralRow
							className={isContainerColMode ? "goNeutral__container-mode-col__card" : "goNeutral__container-mode-row__card"}
							key={'Data Across All Sites'}
							title={'Data Across All Sites'}
							data={goNeutral.overAllData || {}}
						/>
						<Divider />
						<TableContainer className={classes.container}>
							<h3 style={{margin:'20px 0'}}>Data For Individual Sites</h3>
							<Table stickyHeader aria-label="sticky table">
								<TableHead>
									<TableRow>
										<TableCell rowSpan={2}>Site</TableCell>
										<TableCell colSpan={4}>Total tCO²e Usage</TableCell>
										<TableCell colSpan={4}>Cost For Offsetting tCO²e Usage</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Current Month</TableCell>
										<TableCell>Last Month</TableCell>
										<TableCell>Anually</TableCell>
										<TableCell>Lifetime</TableCell>
										<TableCell>Current Month</TableCell>
										<TableCell>Last Month</TableCell>
										<TableCell>Anually</TableCell>
										<TableCell>Lifetime</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										goNeutralSites && goNeutralSites.map((eachSite:any) => {
											return <TableRow>
												<TableCell>{Formatter.capitalizeSite(eachSite)}</TableCell>
												<TableCell>{Number(goNeutral.siteData[eachSite].currentMonthCo2 || 0).toFixed(2)}</TableCell>
												<TableCell>{Number(goNeutral.siteData[eachSite].lastMonthCo2 || 0).toFixed(2)}</TableCell>
												<TableCell>{Number(goNeutral.siteData[eachSite].currentYearCo2 || 0).toFixed(2)}</TableCell>
												<TableCell>{Number(goNeutral.siteData[eachSite].lifetimeCo2Usage || 0).toFixed(2)}</TableCell>
												<TableCell>£{Number(goNeutral.siteData[eachSite].currentMonthOffset || 0).toFixed(2)}</TableCell>
												<TableCell>£{Number(goNeutral.siteData[eachSite].lastMonthOffset || 0).toFixed(2)}</TableCell>
												<TableCell>£{Number(goNeutral.siteData[eachSite].currentYearOffset || 0).toFixed(2)}</TableCell>
												<TableCell>£{Number(goNeutral.siteData[eachSite].lifetimeOffset || 0).toFixed(2)}</TableCell>
											</TableRow>
										})
									}
								</TableBody>
							</Table>
						</TableContainer>
					</React.Fragment>
				}
			</div>
	);
};
