import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { UserContext, AuthContext } from "../../context";
import { Formatter } from "../../utils";
import { MultiSelect } from '../../components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import ProgressBar from "../Reports/ProgressBar";
import { isMobile } from "react-device-detect";

const useStyles = makeStyles({
	container: {
		minHeight: 200,
		
	},
});

interface Props {
	isContainerColMode: boolean;
}

export const ArchivedCO2Stats: FC<Props> = ({ isContainerColMode }) => {
	const { userData } = useContext(AuthContext);
	const userType = userData.userType;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const localSelectedYear = (localStorage.getItem("archived-CO2-Year") && localStorage.getItem("archived-CO2-Year")?.split(",")) || [];
	const [selectedYear, setSelectedYear] = useState<string[]>(localSelectedYear);
	const [goNeutralMonthlyCo2, setGoNeutralMonthlyCo2] = useState<any>({});
	const [selectableYears, setSelectableYears] = useState<any>([]);
	const [goNeutralSites, setGoNeutralSites] = useState<any>([]);
	const [showHeaderRow, setShowHeaderRow] = useState(true);
	const [tableElement, setTableElement] = useState<any>()
	

	const { email } = useContext(UserContext);
	const classes = useStyles();
	let date = new Date();
	let month = date.getMonth();
	let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as any;
	let monthIndex = [] as any;

	for (let i = 0; i <= month; i++) {
		monthIndex.push(i)
	}

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		let yearArray = [];
		yearArray.push(year.toString(), (year - 1).toString(), (year - 2).toString(), (year - 3).toString(), (year - 4).toString())
		setSelectableYears(yearArray)
	}, [])




	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const { data } = await axios.get(`/api/goNeutral/monthlyGoNeutralData?type=${userType}&email=${email}&year=${selectedYear.join()}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});

				setGoNeutralMonthlyCo2(data);
				let sites = Object.keys(data.siteData || {});
				setGoNeutralSites(sites);
			} catch (e) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
			}
			setLoading(false);
		};

		if (selectedYear && selectedYear.length > 0) {
			getData()
		}


		// eslint-disable-next-line
	}, [selectedYear]);
	



	return (
		<div className={isContainerColMode ? "goNeutral__container-mode-col" : "goNeutral__container-mode-row"}>
			{
				loading ? <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}>
					<ProgressBar />
				</div> :
					<React.Fragment>
						<div style={{ display: "flex", justifyContent: 'space-between', flexWrap: 'wrap' }}>
							<h3 style={{ margin: '20px 0' }}>Data For Individual Sites</h3>
							<MultiSelect
								fullWidth={!!isMobile}
								multi={false}
								placeholder="Select Year"
								className="insights__refine-menu__multi-select"
								options={selectableYears.map((site: any) => ({ value: site, label: site }))}
								values={selectedYear}
								onChange={(values) => {
									sessionStorage.removeItem("insights-emissions-manufacturers");
									setSelectedYear(values);
									localStorage.setItem("archived-CO2-Year", values.join());
								}}
							/>
						</div>


						<TableContainer className={classes.container} id="tableElement">

							<Table stickyHeader aria-label="sticky table">
								<TableHead>
									<TableRow>
										<TableCell rowSpan={2}>Site</TableCell>
										<TableCell colSpan={12} align='center'>Months</TableCell>
									</TableRow>
									<TableRow>
										{Number(selectedYear) === date.getFullYear() ?
											<>
												{
													monthIndex.map((value: any) => {
														return <TableCell >{monthArray[value]}</TableCell>
													})
												}
											</> :
											<>
											
												<TableCell>January</TableCell>
												<TableCell>February</TableCell>
												<TableCell>March</TableCell>
												<TableCell>April</TableCell>
												<TableCell>May</TableCell>
												<TableCell>June</TableCell>
												<TableCell>July</TableCell>
												<TableCell>August</TableCell>
												<TableCell>September</TableCell>
												<TableCell>October</TableCell>
												<TableCell>November</TableCell>
												<TableCell>December</TableCell></>
										}

									</TableRow>
								</TableHead>
								<TableBody>
									{
										goNeutralMonthlyCo2 && Object.keys(goNeutralMonthlyCo2).length > 0 && Object.keys(goNeutralMonthlyCo2).map((eachSite: any) => {
											return <TableRow>
												<TableCell>{Formatter.capitalizeSite(eachSite)}</TableCell>
												{goNeutralMonthlyCo2[eachSite].length > 0 ? goNeutralMonthlyCo2[eachSite].map((eachData: any) => {
													return <TableCell>{`${Number(eachData.currentMonthCo2).toFixed(2)}/ £${Number(eachData.currentMonthOffset).toFixed(2)}`}</TableCell>
												}) : <TableCell align="center" colSpan={12}>No Data Found</TableCell>
												}

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
